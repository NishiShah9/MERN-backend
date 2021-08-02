import express from "express";
import mongoose from "mongoose"
import userRoutes from "./Routes/UserRoutes.js";
import postRoutes from "./Routes/PostRoutes.js";
import passport from "passport";
import cors from "cors"
import dotenv from "dotenv"
import { MESSAGE, ROUTES } from "./Common/Constant.js";

// add config
const app = express();
const port = process.env.PORT || 8001
dotenv.config();

//middle ware
app.use(express.json())
app.use(cors())

//db config
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log(MESSAGE.MONGODB_CONNECTED))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

//Api endpoint routes
app.use(ROUTES.USER, userRoutes);
app.use(ROUTES.POST, postRoutes);

//listener
app.listen(port, () => console.log(MESSAGE.SERVER_PORT_RUNNING, port))