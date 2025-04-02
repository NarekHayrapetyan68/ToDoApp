export function darkButton(body, darkModeButton) {
    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeButton.addEventListener("click", function () {
        body.classList.toggle("dark-mode");



        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
            darkModeButton.innerHTML = "🌘";

        } else {
            localStorage.setItem("dark-mode", "disabled");
            darkModeButton.innerHTML = "🌖";

        }
    });
}


export function setPriorityColor(todoItem, priority) {
    if (priority === 'low') {
        todoItem.style.borderLeft = '3px solid #15B431FF';
    } else if (priority === 'medium' ) {
        todoItem.style.borderLeft = '3px solid yellow';
    } else if (priority === 'high') {
        todoItem.style.borderLeft = '3px solid red';
    }
}