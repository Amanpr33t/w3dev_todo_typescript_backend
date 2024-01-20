import { StatusCodes } from "http-status-codes";
import express, { NextFunction, Request, Response } from "express";
import todoModel from "../models/todo";
import CustomAPIError from "../errors/custom-error";

// This function is used to edit the completion date of a todo
const editCompletionDateOfToDo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        interface RequestBody {
            _id: string,
            completionDate: Date,
            completionStatus: 'pending' | 'delayed' | 'completed'
        } //We define the type of request body

        // Assuming your Express Request object is of type express.Request
        const expressReq: express.Request<{}, {}, RequestBody> = req;

        const { _id, completionDate, completionStatus } = expressReq.body

        if (completionStatus === 'completed') {
            throw new CustomAPIError('Todo has already been completed', StatusCodes.BAD_REQUEST)
        }

        if ((new Date(completionDate)).getTime() < (new Date()).getTime()) {
            //if completion date is less than current date
            throw new CustomAPIError('Completion date cannot be smaller than current date', StatusCodes.BAD_REQUEST)
        }

        if (completionStatus === 'delayed') {
            await todoModel.findOneAndUpdate(
                { _id },
                { completionStatus: 'pending' },
                { new: true, runValidators: true }
            );
        }

        await todoModel.findOneAndUpdate({ _id },
            { completionDate },
            { new: true, runValidators: true })

        return res.status(StatusCodes.CREATED).json({
            status: 'ok',
            msg: 'Todo completion date has been added updated'
        })
    } catch (error) {
        next(error);
    }
};

interface EditStatusParams {
    id: string
}
// This function is used to edit the completion status of a todo
const editCompletionStatusOfToDo = async (req: Request<EditStatusParams>, res: Response, next: NextFunction) => {
    try {
        const todoId: string = req.params.id

        // Ensure todoId is a valid ObjectId 
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(todoId);
        if (!isValidObjectId) {
            throw new CustomAPIError('Invalid todo ID', StatusCodes.BAD_REQUEST)
        }

        await todoModel.findOneAndUpdate(
            { _id: todoId },
            { completionStatus: 'completed' },
            { new: true, runValidators: true }
        );

        return res.status(StatusCodes.CREATED).json({
            status: 'ok',
            msg: 'Todo status has been updated',
        });
    } catch (error) {
        next(error);
    }
};

export { editCompletionDateOfToDo, editCompletionStatusOfToDo }