from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Task, db

task_bp = Blueprint("tasks", __name__)

# Get all tasks for the current user
@task_bp.route("/tasks", methods=["GET"])
@jwt_required()  # Ensure the token is coming from cookies
def get_tasks():
    try:
        user_id = get_jwt_identity()  # Get the user identity from the JWT token
    except Exception as e:
        return jsonify({"message": "Unauthorized", 'error': e,}), 401
    taskss = Task.query.filter(Task.user_id == user_id).all()
    return jsonify([{
        "id": task.id,
        "title": task.title,
        "priority": task.priority,
        "due_date": task.due_date,
        "completed": task.completed
    } for task in taskss])

# Add a new task
@task_bp.route("/tasks", methods=["POST"])
@jwt_required()  # Ensure the token is coming from cookies
def add_task():
    data = request.json
    user_id = get_jwt_identity()
    due_date_str = data["due_date"]
    due_date_obj = datetime.strptime(due_date_str, "%Y-%m-%d").date()
    task = Task(title=data["title"], due_date=due_date_obj, priority=data["priority"], user_id=user_id)  # Create a new task with the user_id
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task added successfully", "id": task.id}), 201



@task_bp.route("/tasks/<task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    data = request.get_json()  
    if 'title' in data:
        task.title = data['title']
    if 'completed' in data:
        task.completed = data['completed']
    if 'priority' in data:
        task.priority = data['priority']
    if 'due_date' in data:
        task.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
    try:
        db.session.commit()
        return jsonify({"message": "Task Updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update task", "error": str(e)}), 500


# Delete a task
@task_bp.route("/tasks/<task_id>", methods=["DELETE"])
@jwt_required()  # Ensure the token is coming from cookies
def delete_task(task_id):
    task = Task.query.get(task_id)  # Use task_id for querying the task
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"})
    return jsonify({"message": "Task not found"}), 404




@task_bp.route("/tasks/completed/<completed>", methods=["GET"])
@jwt_required()
def filter_by_status(completed):
    current_user_id = get_jwt_identity()
    completed_bool = completed.lower() == "true"

    tasks = Task.query.filter(Task.completed == completed_bool, Task.user_id == current_user_id).all()

    return jsonify([{
        "id": task.id,
        "title": task.title,
        "priority": task.priority,
        "due_date": task.due_date,
        "completed": task.completed
    } for task in tasks])


