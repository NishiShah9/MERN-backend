import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    clientId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'user' },
})

export default mongoose.model('post', postSchema)