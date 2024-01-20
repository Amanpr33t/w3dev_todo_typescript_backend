import { Request, Response } from "express";

//the middleware function runs when no route matches the request
const notFound = (req: Request, res: Response) => {
    throw new Error('Route not found')
}

export default notFound