import { Request, Response } from 'express'
import { Todo } from '../models/Todo'
import { IUser } from '../models/User'

interface AuthRequest extends Request {
  user?: IUser
}

interface TodoFilters {
  completed?: boolean
  startDate?: Date
  endDate?: Date
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  skip?: number
  limit?: number
}

interface TodoFilter {
  user: string
  completed?: boolean
  dueDate?: {
    $gte?: Date
    $lte?: Date
  }
  $or?: Array<{
    title?: { $regex: string; $options: string }
    description?: { $regex: string; $options: string }
  }>
}

interface SortOptions {
  [key: string]: 1 | -1
}

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: {}
      })
      return
    }
    const todo = new Todo({
      ...req.body,
      user: req.user._id,
    })
    await todo.save()
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating todo',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: {}
      })
      return
    }
    const {
      completed,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      skip = 0,
      limit = 10
    }: TodoFilters = req.query

    // Build filter object
    const filter: TodoFilter = { user: req.user._id.toString() }

    // Filter by completion status
    if (completed !== undefined) {
      filter.completed = completed
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.dueDate = {}
      if (startDate) {
        filter.dueDate.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.dueDate.$lte = new Date(endDate)
      }
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort object
    const sort: SortOptions = {}
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1

    // Get total count of todos matching the filter
    const totalCount = await Todo.countDocuments(filter)

    if (totalCount === 0) {
      res.status(404).json({
        success: false,
        message: 'No todos found',
        data: {
          todos: [],
          totalCount: 0,
          pagination: {
            skip: skip,
            limit: limit,
            total: 0
          }
        }
      })
      return
    }

    const todos = await Todo.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec()

    res.json({
      success: true,
      message: 'Todos retrieved successfully',
      data: {
        todos,
        totalCount,
        pagination: {
          skip: skip,
          limit: limit,
          total: totalCount
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}

export const getTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: {}
      })
      return
    }
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found',
        data: {}
      })
      return
    }

    res.json({
      success: true,
      message: 'Todo retrieved successfully',
      data: todo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'User not authenticated',
      data: {}
    })
    return
  }
  const updates = Object.keys(req.body)
  const allowedUpdates = ['title', 'description', 'dueDate', 'completed']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    res.status(400).json({
      success: false,
      message: 'Invalid updates',
      data: {}
    })
    return
  }

  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found',
        data: {}
      })
      return
    }

    updates.forEach((update) => {
      (todo as unknown as Record<string, unknown>)[update] = req.body[update]
    })
    await todo.save()
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating todo',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        data: {}
      })
      return
    }
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found',
        data: {}
      })
      return
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: todo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
} 