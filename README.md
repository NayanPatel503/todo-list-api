# Todo List REST API

A RESTful API for managing todo items built with Node.js, Express, Mongoose, MongoDB, and TypeScript.

## Features

- User authentication (signup/login)
- CRUD operations for todo items
- Automatic completion of expired todos via CRON job
- TypeScript for better type safety and developer experience
- MongoDB for data persistence
- JWT-based authentication

## Prerequisites

- Node.js (v20 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-list-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-list
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development with hot-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account
  - Body: `{ "email": "user@example.com", "password": "Password123" }`

- `POST /api/auth/login` - Login to get access token
  - Body: `{ "email": "user@example.com", "password": "Password123" }`

### Todo Items

All todo endpoints require authentication. Include the JWT token in the Authorization header:
`Authorization: Bearer <your-token>`

- `POST /api/todos` - Create a new todo
  - Body: `{ "title": "Task", "description": "Description", "dueDate": "2024-03-20T00:00:00.000Z" }`

- `GET /api/todos` - Get all todos for the authenticated user

- `GET /api/todos/:id` - Get a specific todo

- `PATCH /api/todos/:id` - Update a todo
  - Body: `{ "title": "Updated Task", "completed": true }`

- `DELETE /api/todos/:id` - Delete a todo

## CRON Job

The API includes a CRON job that runs daily at midnight to automatically mark expired todos as completed. A todo is considered expired if its due date has passed and it hasn't been marked as completed.

## Development

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript code

## License

MIT 