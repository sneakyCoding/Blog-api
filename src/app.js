import express from "express";
import authRoutes from "./routes/auth.routes.js"
import postRoutes from "./routes/post.routes.js"

const app = express()

app.use(express.json())
// If body is sent as x-www-form-urlencoded in Postman, this prevents req.body from being undefined.
app.use(express.urlencoded({ extended: true }))

app.get('/health',(req,res) =>{
    res.status(200).json({
        status: "ok",
        uptime: process.uptime()
    })
})

app.use("/auth",authRoutes);
app.use("/post",postRoutes);
app.use("/posts",postRoutes);

export default app;
