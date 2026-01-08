import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        message: "Route not found!",
        path: req.originalUrl,
        date: Date()
    })
} 

export default notFound