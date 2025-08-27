# Project Management Backend API

## Setup Instructions

1. Install dependencies:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

2. Create a `.env` file with your MongoDB connection string and JWT secret:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/project-management
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects for user
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/project/:projectId` - Get all tasks for a project
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database Models

### User
- name, email, password, role (admin/manager/member)

### Project
- title, description, status, priority, dates, owner, members, progress

### Task
- title, description, status, priority, dueDate, project, assignedTo, createdBy, hours
