# To Do App

## Overview
ToDo App is a Web application built by using Flask and JavaScript, designed to help users manage tasks, organize their daily activities, and track progress.

## Features
- User registration and login via a web form
- Secure authentication using JWT tokens
- Task creation, editing, and deletion through a graphical interface
- Task priority management (low, medium, high)
- Database storage and retrieval of tasks
- Responsive design for seamless use on different devices

## Technologies Used
### Backend
- Flask
- SQLAlchemy
- Flask-CORS (to handle cross-origin requests)
- PostgreSQL (or SQLite for local development)

### Frontend
- JavaScript (Fetch API for making HTTP requests)
- HTML/CSS

## Installation
### Prerequisites
- Python 3.x
- pip (Python package manager)
- Node.js (optional, for frontend development)
- PostgreSQL (if using a production database)

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/NarekHayrapetyan68/ToDoApp.git
   cd ToDoApp
   ```
2. Move to `pyBack` directory:
   ```sh
   cd pyBack
   ```
3. Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
5. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
6. Set up the database:
   ```sh
   flask db init
   flask db migrate -m "Initial migration."
   flask db upgrade
   ```
7. Run the Flask server:
   ```sh
   python3 app.py
   ```
   The server should be running at `http://127.0.0.1:5000/`

### Frontend Setup
1. Navigate to the `jsFront/` directory:
   ```sh
   cd ..
   cd frontend
   ```
2. Open `index.html` in a browser, or start a local server:
   ```sh
   node server.cjs
   ```
3. Access the frontend at `http://localhost:8000/`

## Handling CORS Issues
If you encounter CORS issues while making requests to the backend, ensure Flask-CORS is installed and enabled:

In `app.py`:
```python
from flask_cors import CORS
CORS(app)
```

Alternatively, specify allowed origins:
```python
CORS(app, resources={r"/*": {"origins": "http://localhost:8000"}})
```

## User Authentication
### Register a User
1. Open the web page in a browser.
2. Navigate to the registration form.
3. Enter your username, email, and password.
4. Click the "Register" button.
5. If registration is successful, you will be redirected to the login page.

### Login
1. Open the login page.
2. Enter your email and password.
3. Click the "Login" button.
4. If login is successful, you will be redirected to the task management dashboard.


## API Endpoints

### Users
- **POST /auth/login** - For logging in
- **POST /auth/register** - For registering

### Tasks
- **GET /api/tasks** - Retrieve all tasks
- **POST /api/tasks** - Create a new task
- **GET /api/tasks/{id}** - Get a specific task
- **PUT /api/tasks/{id}** - Update a task
- **DELETE /api/tasks/{id}** - Delete a task
- **GET /api/tasks/priority/{priority}** - Get a task by its priority
- **GET /api/tasks/completed/{completed}** - Get a task by its status


### Example Request (Creating a Task)
```json
POST /api/tasks
{
    "title": "Complete project",
    "description": "Finish the task management app",
    "priority": "medium"
}
```

## Common Issues and Fixes
### 1. **CORS Policy Blocked**
- Ensure Flask-CORS is installed and properly configured.
- Add CORS settings in `app.py`.
- Run the frontend on the same origin as the backend.

### 2. **500 Internal Server Error**
- Check logs for the exact issue.
- Ensure all required database migrations are applied.

## License
This project is open-source and available under the MIT License.

## Contributors
- **Narek Hayrapetyan** - Developer
- Open for contributions! Feel free to submit PRs.





