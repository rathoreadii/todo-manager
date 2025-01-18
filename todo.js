let todoList = JSON.parse(localStorage.getItem('todoList')) || [
//   { item: '', dueDate: '', priority: '' },
//   { item: '', dueDate: '', priority: '' }
];

displayItems(); //loads the previous content on load

// adding task handler function
function addTodo()
{
    let inputElement = document.querySelector('#todo-input');
    let todoItem = inputElement.value;
    let priorityElement= document.querySelector('#todo-priority')
    
    let dateElement = document.querySelector('#todo-date');
    let todoDate = dateElement.value;
    let todoPriority = priorityElement.value;

    if (!validInput(inputElement, dateElement, priorityElement))
        return;

    todoList.push({ item: todoItem, dueDate: todoDate, priority: todoPriority});
    inputElement.value = '';
    dateElement.value = '';
    priorityElement.value = 'High';

    displayItems(); //refreshes the display every time a work is added to the list 
}

function displayItems()
{
    let containerElement = document.querySelector('.todo-container');
    let newHtml = '';

    const today = new Date();

    // creating new section for each work as the list is updated/added or removing a deleted section from the display on delete

    for (let{item, dueDate, priority} of todoList)
    {
        let itemDate = new Date(dueDate);
        let today = new Date();
        let color;
        if (itemDate.getFullYear() === today.getFullYear() && itemDate.getMonth() === today.getMonth() && itemDate.getDate() === today.getDate())
        {
            color = 'yellow';
        }
        else if (itemDate < today)
        {
            color = 'red';
        }
        else if(itemDate > today && itemDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7))
        {
            color = 'green';
        }
        newHtml += `<span style= "color: ${color};">${item}</span>
                    <span>${dueDate}</span>
                    <span>${priority}</span>
                    <button class="btn-edit" onclick="editTodo(${item})">✏️</button>
                    <button class="btn-delete" onclick="deleteTodo(${item})">🗑️</button>`;
    }
    containerElement.innerHTML = newHtml;
}


// delete button
function deleteTodo(index)
{
    const actualIndex = todoList.findIndex(task => task.item === todoList[index].item);
    if (actualIndex === -1)
        return;

    if(confirm(`Are you sure you want to delete this task?`))
    {
        todoList.splice(actualIndex, 1);
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

// sort by priority
function sortByPriority()
{
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    todoList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    saveToLocalStorage();
    displayItems();
}

// editing option for each work like changing the content or/and date
function editTodo(index)
{
    const actualIndex = todoList.findIndex(task => task.item === todoList[index].item);
    if (actualIndex === -1)
        return;

    let { item, dueDate, priority } = todoList[actualIndex];

    let inputElement = document.querySelector('#todo-input');
    let dateElement = document.querySelector('#todo-date');
    let priorityElement = document.querySelector('#todo-priority');
    inputElement.value = item;
    dateElement.value = dueDate;
    priorityElement.value = priority;

    document.querySelector('.btn-todo').style.display = 'none';
    document.querySelector('.btn-update').style.display = 'inline';

    document.querySelector('.btn-update').onclick =
        function () {
            let updateItem = inputElement.value.trim();
            let updateDate = dateElement.value;
            let updatePriority = priorityElement.value;

            if (updateItem && updateDate && updatePriority) {
                todoList[actualIndex] = { item: updateItem, dueDate: updateDate, priority: updatePriority };
                saveToLocalStorage();
                inputElement.value = '';
                dateElement.value = '';
                priorityElement.value = 'High';
                displayItems();

                //reset buttons
                document.querySelector('.btn-update').style.display = 'none';
                document.querySelector('.btn-todo').style.display = 'inline';
            }

            else {
                alert(`Please enter all details.`);
            }
        };
}

// input validation
function validInput(inputElement, dateElement, priorityElement)
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

    if (!priorityElement.value)
    {
        priorityElement.style.borderColor = 'red';
        isValid = false;
    }
    else
    {
        priorityElement.style.borderColor = 'green';
    }

    return isValid;
}

// filter options
function handleAction(action)
{
    switch (action)
    {
        case "sortByDate":
            sortByDate();
            break;
        
        case "sortByPriority":
            sortByPriority();
            break;
        
        case "filterOverDue":
            filterTasks("overdue");
            break;
        
        case "filterToday":
            filterTasks("today");
            break;
        
        case "filterWeek":
            filterTasks("week");
            break;
        
        case "clearFilters":
            displayItems();
            break;
    }

    if (action !== "clearFilters") {
        document.querySelector('#todo-actions').value = action;
    }
    else
    {
        document.querySelector('#todo-actions').value = "";
    }// reset dropdown
}

// filter task list creation
function filterTasks(filter)
{
    const today = new Date();
    let filteredList;
    
    if (filter === "overdue")
    {
        filteredList = todoList.filter(item => new Date(item.dueDate) < today);
    }
    else if (filter === "today")
    {
        filteredList = todoList.filter(item => {
            const itemDueDate = new Date(item.dueDate);
            return itemDueDate.getFullYear() === today.getFullYear() &&
                itemDueDate.getMonth() === today.getMonth() &&
                itemDueDate.getDate() === today.getDate();
        });
    }
    else if (filter === "week")
    {
        const endOfWeek = new Date();
        endOfWeek.setDate(today.getDate() + 7);
        filteredList = todoList.filter(item => {
            const itemDueDate = new Date(item.dueDate);
            return itemDueDate >= today && itemDueDate <= endOfWeek;
        });
    }

    // console.log(filteredList);
    displayFilteredItems(filteredList);
}

// search functionality
let debounceTimeout;
function searchItems(query)
{
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        query = query.trim().toLowerCase();

        // if search bar is empty, display the full list
        if (query === '')
        {
            displayItems();
            return;
        }

        const filteredList = todoList.filter(task =>
            task.item.toLowerCase().includes(query)
        );
        displayFilteredItems(filteredList);
    }, 100);
}

// clear search
function clearSearch()
{
    const searchInput = document.querySelector('#search-input');
    searchInput.value = '';
    clearTimeout(debounceTimeout);
    displayItems();
}

// displays the filtered or searched list
function displayFilteredItems(list)
{
    let containerElement = document.querySelector('.todo-container');
    let newHtml = '';

    list.forEach((task, index) => {
        const { item, dueDate, priority } = task;
        newHtml += `<span>${item}</span>
                    <span>${dueDate}</span>
                    <span>${priority}</span>
                    <button class="btn-edit" onclick="editTodo(${index})">✏️</button>
                    <button class="btn-delete" onclick="deleteTodo(${index})">🗑️</button>`
    });

    containerElement.innerHTML = newHtml || `<p>No tasks found</p>`;    // displays message if no items found in the list
}

// local storage
function saveToLocalStorage()
{
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
