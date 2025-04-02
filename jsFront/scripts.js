import {darkButton, setPriorityColor} from "./helpers.js";

const addButton = document.getElementById('add_button');

const logoutButton = document.getElementById("logout");


function applyFirstItemVisibility() {
    const firstItem = document.querySelector('.todo');
    if (firstItem && !firstItem.classList.contains('visible')) {
        // Apply smooth visibility transition to the first item only
        setTimeout(() => {
            firstItem.classList.add('visible');
        }, 100); // This is optional, adjust delay to your preference
    }
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!entry.target.classList.contains('visible')) {
                entry.target.classList.add('visible');
                console.log('Element is in the viewport:', entry.target);
            }
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.5 });


logoutButton.addEventListener("click", function () {
    localStorage.removeItem('access_token');
    window.location.href = "/";
})

document.addEventListener('DOMContentLoaded', async () => {
    let today = new Date();
    const offsetToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    const todayFormatted = offsetToday.toISOString().split('T')[0];
    document.getElementById('task-date').min = todayFormatted;
    await loadTasks();
});


addButton.addEventListener('click', async (e) => {
    e.preventDefault();


    await loadTasks();


    const todoText = document.getElementById('todo_input').value.trim();
    const todoDate = document.getElementById('task-date').value.trim();
    const todoPriority = document.getElementById('types').value.trim()
    console.log(todoPriority, todoDate)

    if (!todoText) {
        console.error("Task title is empty!");
        return;
    }


    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No access token found!");
            return;
        }

        console.log("Sending request with token:", token);

        const requestData =  { title: todoText };
        if(todoDate){
            requestData.due_date = todoDate
        }

        requestData.priority = todoPriority

        console.log(requestData)


        const response = await fetch('http://127.0.0.1:5000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to add task:", errorData);
            return;
        }

        const data = await response.json();
        console.log("Task added successfully:", data);

        if (data.message === 'Task added successfully' && data.id) {

            displayTask({ id: data.id, title: todoText, due_date: todoDate, priority: todoPriority});

            applyFirstItemVisibility();

        }

    } catch (error) {
        console.error('Error adding task:', error);
    }

    let today = new Date().toISOString().split('T')[0];

    document.getElementById('todo_input').value = '';
    document.getElementById('types').selectedIndex= 0;
    document.getElementById('task-date').value = today;
});


async function loadTasks() {
    try {
        showLoadingSpinner()

        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No access token found!");
            return;
        }

        const selectedRadioFilter = document.querySelector('input[name="filter-status"]:checked').value;

        let apiUrl = 'http://127.0.0.1:5000/api/tasks'



        if(selectedRadioFilter==='completed'){
            apiUrl +='/completed/true'
        }else if(selectedRadioFilter === 'pending'){
            apiUrl +='/completed/false'
        }



        console.log("Fetching tasks with token:", token);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to load tasks:", errorData);
            return;
        }

        const tasks = await response.json();
        console.log("Loaded tasks:", tasks);

        document.getElementById('todo-list').innerHTML = '';

        tasks.forEach(task => displayTask(task));

        setTimeout(() => {
            applyFirstItemVisibility();
        }, 0);
        document.querySelectorAll('.todo').forEach(todo => observer.observe(todo));

        hideLoadingSpinner();


    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


function displayTask(task) {
    const todoList = document.getElementById('todo-list');

    const todoItem = document.createElement('li');
    todoItem.classList.add('todo');
    todoItem.dataset.id = task.id;
    todoItem.classList.toggle('completed', task.completed);

    // Set priority color initially
    setPriorityColor(todoItem, task.priority);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'todo-' + task.id;
    checkbox.checked = task.completed;
    checkbox.classList.add('hidden-checkbox');

    const labelForCheckbox = document.createElement('label');
    const emojiSpan = document.createElement('span');
    emojiSpan.textContent = '✓';
    emojiSpan.style.fontSize = '1.2em';
    labelForCheckbox.classList.add('custom_checkbox');
    labelForCheckbox.appendChild(emojiSpan);
    labelForCheckbox.setAttribute('for', checkbox.id);

    const labelForText = document.createElement('label');
    labelForText.setAttribute('for', checkbox.id);
    labelForText.classList.add('todo-text');
    labelForText.textContent = task.title;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener('click', async function () {
        await deleteTask(task.id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.innerHTML = '<i class="fa-solid fa-edit" ></i>';

    const spanContainer = document.createElement('span');
    spanContainer.id = "todo-text-container";

    const spanDatePriority = document.createElement('span');
    spanContainer.classList.add("testcont");

    const spanPriority = document.createElement('span');
    spanPriority.innerHTML = task.priority.at(0).toUpperCase() + task.priority.slice(1);
    spanPriority.classList.add('date-text');

    const spanDate = document.createElement('span');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const dateObj = new Date(task.due_date);
    const taskDate = new Date(task.due_date).toISOString().split('T')[0];

    const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    spanDate.innerHTML = formattedDate;
    spanDate.classList.add('date-text');

    // Handle overdue tasks
    if (task.due_date && taskDate < today) {
        const overdueSpan = document.createElement('span');
        overdueSpan.textContent = "⚠ overdue"
        overdueSpan.classList.add('overdue');
        if (!task.completed) {
            labelForText.appendChild(overdueSpan);
        }
    }

    // Edit button click handler
    editButton.addEventListener('click', async () => {
        const currentText = labelForText.textContent;
        const currentPriority = spanPriority.textContent;
        const currentDate = spanDate.textContent;

        const overdueSpan = labelForText.querySelector('.overdue');
        if (overdueSpan) {
            overdueSpan.remove(); // This prevents overdue from being captured
        }

        const isOverdue = overdueSpan !== null;

        if (labelForText.querySelector('input')) {
            const inputField = labelForText.querySelector('input');
            const selectPriority = spanPriority.querySelector('select');
            const dateInput = spanDate.querySelector('input');

            const newText = inputField.value.trim();
            const newPriority = selectPriority.value;
            const newDate = dateInput.value;

            if (newText !== currentText || newPriority !== currentPriority || newDate !== currentDate) {
                await updateTask(task.id, newText, newPriority, newDate);

                // Update the priority color after editing
                setPriorityColor(todoItem, newPriority);

                if (isOverdue && newDate === new Date().toISOString().split('T')[0]) {
                    overdueSpan.style.display = 'none';
                }

                labelForText.textContent = newText;
                spanPriority.textContent = newPriority.charAt(0).toUpperCase() + newPriority.slice(1);

                const dateObj = new Date(newDate);
                const formattedDate = dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                spanDate.textContent = formattedDate;
            } else {
                labelForText.textContent = currentText;
                spanPriority.textContent = currentPriority;
                spanDate.textContent = currentDate;
            }

            inputField.remove();
            editButton.style.display = 'inline';
        } else {
            // If currently in edit mode
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentText;
            inputField.value = currentText.replace('⚠ overdue', '').trim();
            inputField.classList.add('edit-input');
            labelForText.textContent = '';
            labelForText.appendChild(inputField);
            inputField.focus();

            const selectPriority = document.createElement('select');
            const priorities = ['low', 'medium', 'high'];
            priorities.forEach(priority => {
                const option = document.createElement('option');
                option.value = priority;
                option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
                if (priority === currentPriority) {
                    option.selected = true;
                }
                selectPriority.appendChild(option);
            });

            selectPriority.classList.add('priority-edit-input');
            spanPriority.innerHTML = '';
            spanPriority.appendChild(selectPriority);

            const dateInput = document.createElement('input');
            dateInput.type = 'date';

            const today = new Date();
            const offsetToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
            const todayFormatted = offsetToday.toISOString().split('T')[0];

            dateInput.min = todayFormatted;

            const parsedDate = new Date(currentDate);
            if (isOverdue) {
                dateInput.value = todayFormatted;
            } else if (!isNaN(parsedDate.getTime())) {
                const offsetDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
                dateInput.value = offsetDate.toISOString().split('T')[0];
            } else {
                dateInput.value = "";
            }
            spanDate.innerHTML = '';
            dateInput.classList.add('date-edit-input');
            spanDate.appendChild(dateInput);

            inputField.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    const newText = inputField.value.trim();
                    const newPriority = selectPriority.value;
                    const newDate = dateInput.value;

                    if (newText !== currentText || newPriority !== currentPriority || newDate !== currentDate) {
                        await updateTask(task.id, newText, newPriority, newDate);

                        // Update the priority color after editing
                        setPriorityColor(todoItem, newPriority);

                        labelForText.textContent = newText;
                        spanPriority.textContent = newPriority;
                        spanDate.textContent = newDate;
                    } else {
                        labelForText.textContent = currentText;
                        spanPriority.textContent = currentPriority;
                        spanDate.textContent = currentDate;
                    }

                    inputField.remove();
                    editButton.style.display = 'inline'; // Show the edit button again
                }
            });
        }
    });

    // Check if task is completed
    if (task.completed) {
        checkbox.checked = true;
        labelForText.style.textDecoration = 'line-through';
        todoItem.classList.add('completed');
    }

    // Attach events for the checkbox change
    checkbox.addEventListener('change', async (e) => {
        const completed = e.target.checked;
        const taskId = e.target.closest('li').dataset.id;

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ completed: completed }),
            });

            const data = await response.json();
            if (data.message === 'Task Updated') {
                const label = e.target.closest('li').querySelector('.todo-text');
                if (completed) {
                    label.style.textDecoration = 'line-through';
                } else {
                    label.style.textDecoration = 'none';
                }
            }

        } catch (error) {
            console.error('Error updating task:', error);
        }
    });

    todoItem.appendChild(checkbox);
    todoItem.appendChild(labelForCheckbox);
    todoItem.appendChild(spanContainer);
    spanContainer.appendChild(labelForText);
    spanContainer.appendChild(spanDatePriority);
    spanDatePriority.appendChild(spanPriority);
    spanDatePriority.appendChild(spanDate);
    todoItem.appendChild(editButton);
    todoItem.appendChild(deleteButton);

    todoList.prepend(todoItem);
}

async function deleteTask(taskId) {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No access token found!");
            return;
        }


        const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to delete task:", errorData);
            return;
        }

        const data = await response.json();
        if (data.message === 'Task deleted') {

            const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
            if (taskElement) {
                taskElement.remove();
            }
        } else {
            console.error("Error: Task deletion was not successful.");
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const darkModeButton = document.getElementById("dark-mode");
    const body = document.body;
    const dateInput = document.getElementById("task-date" +
        "");
    dateInput.value = new Date().toISOString().split("T")[0];


    darkButton(body, darkModeButton)
});


async function updateTask(taskId, newTitle, newPriority, newDate) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
                title: newTitle,
                priority: newPriority,
                due_date: newDate
            }),
        });

        const data = await response.json();
        if (data.message === 'Task Updated') {
            console.log('Task updated successfully');
        } else {
            console.error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}



document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM fully loaded! Attaching event listeners...");

    const radioButtons = document.querySelectorAll('input[name="filter-status"]');


    radioButtons.forEach(radio => {
        console.log("Attaching event listener to:", radio.value);
        radio.addEventListener('change', function () {
            console.log(`Radio button selected: ${radio.value}`);
            loadTasks();

        });
    });

     await loadTasks();
});




function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

