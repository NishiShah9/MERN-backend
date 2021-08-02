import express from "express";
import User from "../Model/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { MESSAGE } from "../Common/Constant.js"
const router = express.Router();

//register
router.post("/register", (req, res) => {
    if (req.body.email && req.body.password && req.body.name && req.body.role) {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return res.status(204).send(new Error(MESSAGE.EMAIL_ALREADY_EXIST));
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role,
                    phone: req.body.phone,
                    age: req.body.age,
                    image: req.body.image,
                    education: req.body.education,
                });
                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.send({
                                message: MESSAGE.REGISTER_SUCESSFULLY,
                                data: user
                            }))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    } else {
        return res.status(404).send({ message: MESSAGE.BAD_REQUEST });
    }

});

// login
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        // Find user by email
        User.findOne({ email }).then(user => {
            // Check if user exists
            if (!user) {
                res.status(400).send(new Error(MESSAGE.EMAIL_NO_FOUND));
            }
            // Check password
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    // User matched
                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        name: user.name
                    };
                    // Sign token
                    jwt.sign(
                        payload,
                        process.env.JWT_KEY,
                        {
                            expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.send({
                                message: MESSAGE.LOGIN_SUCESSFULL,
                                token: token,
                                role: user.role
                            });
                        }
                    );
                } else {
                    return res
                        .status(204)
                        .send({ error: MESSAGE.INVALID_PASSWORD });
                }
            });
        });
    } else {
        return res.status(404).send({ error: MESSAGE.BAD_REQUEST });
    }
});

// get all users List
router.get('/list', (req, res) => {
    const role = req.query.role
    let request = {}
    if (role) {
        request.role = role
    }
    console.log(role, "resuest")
    User.find(request, (err, data) => {
        if (err) {
            res.status(500).send({
                message: MESSAGE.INTERNAL_SERVER_ERROR
            })
        } else {
            res.status(200).send({
                count: data.length,
                data: data
            })
        }
    })
})

// update user List
router.put('/:id', (req, res) => {
    const request = req.body
    User.findByIdAndUpdate(req.params.id, request, (err, data) => {
        if (err) {
            res.status(500).send({
                message: MESSAGE.INTERNAL_SERVER_ERROR
            })
        } else {
            if (data) {
                res.status(200).send({
                    message: MESSAGE.USER_UPDATE_SUCESSFULLY
                })
            } else {
                res.status(401).send({
                    message: MESSAGE.USER_NOT_FOUND
                })
            }

        }
    })
})

// get particular user by id
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, data) => {
        console.log(err, data)
        if (err) {
            res.status(500).send({
                message: MESSAGE.INTERNAL_SERVER_ERROR
            })
        } else {
            if (data) {
                res.status(200).send(data)
            } else {
                res.status(401).send({
                    message: MESSAGE.USER_NOT_FOUND
                })
            }
        }
    })
})

// delete user
router.delete('/:id', (req, res) => {
    const request = req.body
    User.findByIdAndDelete(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: MESSAGE.INTERNAL_SERVER_ERROR
            })
        } else {
            if (data) {
                res.status(200).send({
                    message: MESSAGE.USER_DELETE_SUCESSFULLY
                })
            } else {
                res.status(401).send({
                    message: MESSAGE.USER_NOT_FOUND
                })
            }

        }
    })
})

export default router;