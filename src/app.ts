import express, { Express } from "express";
import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

const app: Express = express();

// middleware
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000", // client side URL
    credentials: true
}));
app.use(express.json());
app.use("/posts", postRouter);

app.get("/", async (req, res) => {
    res.send("Blog app server is running");
});

export default app;