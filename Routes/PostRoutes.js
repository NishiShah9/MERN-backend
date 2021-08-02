import express from "express";
import User from "../Model/UserModel.js";
import Post from "../Model/PostModel.js";
import { MESSAGE } from "../Common/Constant.js";
const router = express.Router();

// create post 
router.post('/create', (req, res) => {
    let request = req.body
    User.find({ role: "RECRUITER" }, (err, data) => {
        if (err) {
            res.status(500).send({
                message: MESSAGE.INTERNAL_SERVER_ERROR
            })
        } else {
            if (data) {
                let randomNo = Math.floor(Math.random() * data.length)
                let recruiterId = data[randomNo].id
                request.recruiterId = recruiterId || 0
                Post.create(request, (err, data) => {
                    if (err) {
                        res.status(500).send({
                            message: MESSAGE.INTERNAL_SERVER_ERROR
                        })
                    } else {
                        res.status(200).send({
                            message: MESSAGE.POST_CREATED_SUCESSFULLY
                        })
                    }
                })
            } else {
                res.status(500).send({
                    message: MESSAGE.INTERNAL_SERVER_ERROR
                })
            }
        }
    })
    return
})

// get all post list 
router.get('/list', (req, res) => {
    const request = req.body
    Post.find(request, (err, data) => {
        if (err) {
            res.status(204).send({
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

// update post List
router.put('/:id', (req, res) => {
    const request = req.body
    Post.findByIdAndUpdate(req.params.id, request, (err, data) => {
        if (err) {
            res.status(500).send({
                message: MESSAGE.INTERNAL_SERVER_ERROR
            })
        } else {
            if (data) {
                res.status(200).send({
                    message: MESSAGE.POST_UPDATE_SUCESSFULLY
                })
            } else {
                res.status(401).send({
                    message: MESSAGE.POST_NOT_FOUND
                })
            }

        }
    })
})

// get particular post by id
router.get('/:id', (req, res) => {
    Post.findById(req.params.id, (err, data) => {
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
                    message: MESSAGE.POST_NOT_FOUND
                })
            }
        }
    })
})

// delete post
router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: MESSAGE.INTERNAL_SERVER_ERROR
            })
        } else {
            if (data) {
                res.status(200).send({
                    message: MESSAGE.POST_DELETE_SUCESSFULLY
                })
            } else {
                res.status(401).send({
                    message: MESSAGE.POST_NOT_FOUND
                })
            }

        }
    })
})

export default router;