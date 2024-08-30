import cores from "cors"
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"


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

const server = async() => {
    try {
        app.listen(3001, () => {
            console.log("Server is running on 3001")
        })
    } catch (error) {
        console.log(error)
    }
}

server()