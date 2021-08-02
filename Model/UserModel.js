import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: false
    }, 
    about: {
        type: String,
        required: false
    }, 
    age: {
        type: Number,
        required: false
    }, 
    image: {
        type: String,
        required: false
    },
    education: {
        type: String,
        required: false
    },

})

export default mongoose.model('user', userSchema)