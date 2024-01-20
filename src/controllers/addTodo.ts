import { StatusCodes } from "http-status-codes";
import express, { NextFunction, Request, Response } from "express";
import todoModel from "../models/todo";
import CustomAPIError from "../errors/custom-error";

// This function is used to create a todo
const addToDo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        interface RequestBody {
            about: string;
            completionDate: Date;
        } //We define the type of request body

        // Assuming your Express Request object is of type express.Request
        const expressReq: express.Request<{}, {}, RequestBody> = req;

        const { about, completionDate } = expressReq.body

        if ((new Date(completionDate)).getTime() < (new Date()).getTime()) {
            //if completion date is less than current date
            throw new CustomAPIError('Completion date cannot be smaller than current date', StatusCodes.BAD_REQUEST)
        }

        if (about.trim().length > 300) {
            throw new CustomAPIError('About cannot have more than 300 alphabets', StatusCodes.BAD_REQUEST)
        }

        await todoModel.create(expressReq.body);

        return res.status(StatusCodes.CREATED).json({
            status: 'ok',
            msg: 'Todo has been added successfully'
        });
    } catch (error) {
        next(error);
    }
};

export default addToDo;