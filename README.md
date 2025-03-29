# 📝 To-Do Manager

A feature-rich task management web application built with **HTML, CSS, and JavaScript**, with persistent storage using `localStorage`.

## ✨ Features
- **Add tasks** with due dates and priorities (High/Medium/Low)
- **Edit/Delete** existing tasks
- **Color-coded tasks** based on due date:
  - 🔴 Red: Overdue
  - 🟡 Yellow: Due today
  - 🟢 Green: Due within next 7 days
- **Advanced filtering**:
  - Sort by due date or priority
  - Filter by overdue, today, or upcoming week
- **Search functionality** with debounce
- **Persistent storage** using localStorage
- **Responsive design** works on all devices

## 🚀 Live Demo
https://rathoreadii.github.io/todo-manager/

## 🛠️ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-manager.git
2. Open index.html in your browser.

💻 Usage Guide
Add a task:
Enter task description
Select due date
Choose priority level
Click "Add" button

Manage tasks:
✏️ Edit: Click the edit button
🗑️ Delete: Click the delete button
🔍 Search: Type in the search bar
🗂️ Filter: Use the dropdown to filter/sort tasks

🔧 Key Technical Highlights
Debounced search for better performance
LocalStorage integration
Dynamic task coloring based on due date
