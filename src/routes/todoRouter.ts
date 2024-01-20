import express from "express"
import addToDo from "../controllers/addTodo"
import { editCompletionDateOfToDo, editCompletionStatusOfToDo } from "../controllers/editTodo"
import getTodos from "../controllers/getAllTodo"

const todoRouter = express.Router()

todoRouter.post('/add', addToDo) //to add a new todo
todoRouter.patch('/edit-date', editCompletionDateOfToDo) //to edit the completion date of a todo
todoRouter.patch('/edit-status/:id', editCompletionStatusOfToDo) //to edit completion status of a todo
todoRouter.get('/fetchTodos', getTodos) //to get all todos

export default todoRouter