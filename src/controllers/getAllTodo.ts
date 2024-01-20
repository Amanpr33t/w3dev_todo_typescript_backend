import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import todoModel from "../models/todo";

interface GetTodosQueryParams {
    status?: 'delayed' | 'pending' | 'completed'
}
// This function is used to get all todos
const getTodos = async (req: Request<{}, {}, {}, GetTodosQueryParams>, res: Response, next: NextFunction) => {
    try {
        const { status }: GetTodosQueryParams = req.query;

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1); // Subtract 1 day

        await todoModel.updateMany(
            {
                completionDate: { $lt: currentDate }, //if completion date is less than the current date
                completionStatus: 'pending', //Only update pending todo
            },
            {
                $set: {
                    completionStatus: 'delayed'
                },
            }
        )

        let allTodos
        if (status === 'delayed' || status === 'pending' || status === 'completed') {
            allTodos = await todoModel.find({ completionStatus: status }).select('about completionDate completionStatus createdAt')
        } else {
            allTodos = await todoModel.find().select('about completionDate completionStatus createdAt')
        }

        return res.status(StatusCodes.CREATED).json({
            status: 'ok',
            allTodos
        });
    } catch (error) {
        next(error);
    }
}

export default getTodos;