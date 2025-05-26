import mongoose, { Document, Schema } from 'mongoose'

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The title of the todo
 *         description:
 *           type: string
 *           description: The description of the todo
 *         completed:
 *           type: boolean
 *           description: The completion status of the todo
 *           default: false
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The due date of the todo
 *         user:
 *           type: string
 *           description: The ID of the user who owns the todo
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the todo was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the todo was last updated
 */

export interface ITodo extends Document {
  title: string
  description?: string
  dueDate?: Date
  completed: boolean
  user: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Todo = mongoose.model<ITodo>('Todo', todoSchema) 