import mongoose from "mongoose";

// Enum to define possible completion statuses
enum CompletionStatus {
    Pending = "pending",
    Completed = "completed",
    Deleayed = "delayed"
}

const ToDoSchema = new mongoose.Schema({
    about: {
        //What the todo is about
        type: String,
        required: true,
        trim: true,
    },
    completionStatus: {
        //Tells if the todo is 'pending', 'completed' or 'delayed'
        type: String,
        enum: Object.values(CompletionStatus),
        default: CompletionStatus.Pending,
    },
    completionDate: {
        //Date by which todo has to be completed
        type: Date,
        required: true,
    },
}, { timestamps: true });

const todoModel = mongoose.model('ToDo', ToDoSchema);
export default todoModel;