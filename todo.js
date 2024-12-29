let todoList = JSON.parse(localStorage.getItem('todoList')) || [
//   { item: '', dueDate: '' },
//   { item: '', dueDate: '' }
];

displayItems(); //loads the previous content on load

function addTodo()
{
    let inputElement = document.querySelector('#todo-input');
    let todoItem = inputElement.value;
    
    let dateElement = document.querySelector('#todo-date');
    let todoDate = dateElement.value;

    if (!validInput(inputElement, dateElement))
        return;

    todoList.push({ item: todoItem, dueDate: todoDate });
    inputElement.value = '';
    dateElement.value = '';

    displayItems(); //refreshes the display every time a work is added to the list 
}

function displayItems()
{
    let containerElement = document.querySelector('.todo-container');
    let newHtml = '';

    // creating new section for each work as the list is updated/added or removing a deleted section from the display on delete

    for (let i = 0; i < todoList.length; i++)
    {
        let { item, dueDate } = todoList[i];
        newHtml += `<span>${item}</span>
                    <span>${dueDate}</span>
                    <button class="btn-edit" onclick="editTodo(${i})">✏️</button>
                    <button class="btn-delete" onclick="deleteTodo(${i})">🗑️</button>`;
    }
    containerElement.innerHTML = newHtml;
}


// delete button
function deleteTodo(index)
{
    if(confirm(`Are you sure you want to delete this task?`))
    {
        todoList.splice(index, 1);
        saveToLocalStorage();
        displayItems();
    }
}

// sort by date button
function sortByDate()
{
    todoList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    saveToLocalStorage();
    displayItems();
}

// editing option for each work like changing the content or/and date
function editTodo(index)
{
    let { item, dueDate } = todoList[index];

    let inputElement = document.querySelector('#todo-input');
    let dateElement = document.querySelector('#todo-date');
    inputElement.value = item;
    dateElement.value = dueDate;

    document.querySelector('.btn-todo').style.display = 'none';
    document.querySelector('.btn-update').style.display = 'inline';

    document.querySelector('.btn-update').onclick =
        function () {
            let updateItem = inputElement.value.trim();
            let updateDate = dateElement.value;

            if (updateItem && updateDate) {
                todoList[index] = { item: updateItem, dueDate: updateDate };
                saveToLocalStorage();
                inputElement.value = '';
                dateElement.value = '';
                displayItems();

                //reset buttons
                document.querySelector('.btn-update').style.display = 'none';
                document.querySelector('.btn-todo').style.display = 'inline';
            }

            else {
                alert(`Please enter both task and due date.`);
            }
        };
}

// input validation
function validInput(inputElement, dateElement)
{
    let isValid = true;

    if (!inputElement.value.trim())
    {
        inputElement.style.borderColor = 'red';
        isValid = false;
    }
    else
    {
        inputElement.style.borderColor = 'green';
    }

    if (!dateElement.value)
    {
        dateElement.style.borderColor = 'red';
        isValid = false;
    }
    else
    {
        dateElement.style.borderColor = 'green';
    }

    return isValid;
}


// local storage
function saveToLocalStorage()
{
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
