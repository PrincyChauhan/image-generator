import cores from "cors"
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import generateImageRoute from "./routes/GenerateImage.js";
import PostRouter from "./routes/Post.js"

// load env data
dotenv.config();

const app = express();
app.use(cores());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World"
    })
})

// Routes
app.use("/api/post", PostRouter)
app.use("/api/generateImage/", generateImageRoute);


// DB connection
const connectDB = () => {
    mongoose.set("strictQuery", true);
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("Connected to Mongo DB"))
        .catch((err) => {
            console.error("failed to connect with mongo");
            console.error(err);
        });
};

// Server Connection
const server = async() => {
    try {
        connectDB();
        app.listen(3001, () => {
            console.log("Server is running on 3001")
        })
    } catch (error) {
        console.log(error)
    }
}
server()