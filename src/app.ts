import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import notFound from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";
import connectDB from "./db/connectDB";

import todoRouter from "./routes/todoRouter";

dotenv.config();

const app: Express = express();
const port: number = 3011;

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//to manage CORS error
app.use(cors<Request>())
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    next()
})

app.use('/todo', todoRouter)
app.use(notFound) //this route will be triggered when no other route matches 
app.use(errorHandlerMiddleware) //errors are handles by this route

const server = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server running on port ${port}...`);
        });
    } catch (error) {
        console.error(error);
    }
}
server()

export default app




