import express from 'express'
import { auth } from '../middleware/auth'
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController'
import {
  createTodoValidation,
  updateTodoValidation,
  getTodosValidation,
  todoIdValidation
} from '../middleware/validators/todoValidators'
import { validateRequest } from '../middleware/validators/validateRequest'

const router = express.Router()

// Apply auth middleware to all routes
router.use(auth)

// Todo routes with validation
router.post('/', createTodoValidation, validateRequest, createTodo)
router.get('/', getTodosValidation, validateRequest, getTodos)
router.get('/:id', todoIdValidation, validateRequest, getTodo)
router.patch('/:id', updateTodoValidation, validateRequest, updateTodo)
router.delete('/:id', todoIdValidation, validateRequest, deleteTodo)

export default router 