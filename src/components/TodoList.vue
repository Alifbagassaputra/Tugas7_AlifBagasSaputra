<template>
  <div class="todo-app">
    <h1>Todo List</h1>
    <div class="input-container">
      <input
        v-model="newTodo"
        @keyup.enter="addNewTodo"
        placeholder="Add a new task"
      />
      <button @click="addNewTodo">Add</button>
    </div>
    <div class="filters">
      <button @click="showAll" :class="{ active: filter === 'all' }">All</button>
      <button @click="showActive" :class="{ active: filter === 'active' }">Active</button>
      <button @click="showCompleted" :class="{ active: filter === 'completed' }">Completed</button>
      <button @click="removeCompleted">Remove Completed</button>
    </div>
    <transition-group name="list" tag="ul" class="todo-list">
      <li v-for="(todo, index) in filteredTodos" :key="index" class="todo-item">
        <span v-if="!todo.editing" :class="{ done: todo.done }" @click="toggleTodoDone(index)">
          {{ todo.text }}
        </span>
        <input v-else v-model="todo.text" @keyup.enter="editTodoItem(index, todo.text)" @blur="editTodoItem(index, todo.text)" />
        <div class="buttons">
          <button @click="setEditing(index, true)" class="edit-button">Edit</button>
          <button @click="removeTodoItem(index)" class="remove-button">Remove</button>
        </div>
      </li>
    </transition-group>
    <p class="footer">
      Total unfinished tasks: {{ unfinishedTodos }} |
      Total completed tasks: {{ completedTodos }}
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

export default {
  setup() {
    const newTodo = ref('')
    const todoStore = useTodoStore()

    const addNewTodo = () => {
      if (newTodo.value.trim()) {
        todoStore.addTodo(newTodo.value)
        newTodo.value = ''
      }
    }

    const toggleTodoDone = (index) => {
      todoStore.toggleTodo(index)
    }

    const removeTodoItem = (index) => {
      todoStore.remove(index)
    }

    const editTodoItem = (index, newText) => {
      todoStore.edit(index, newText)
    }

    const setEditing = (index, editing) => {
      todoStore.setEditing(index, editing)
    }

    const showAll = () => {
      todoStore.setFilter('all')
    }

    const showActive = () => {
      todoStore.setFilter('active')
    }

    const showCompleted = () => {
      todoStore.setFilter('completed')
    }

    const removeCompleted = () => {
      todoStore.removeCompletedTodos()
    }

    // Memuat data dari Local Storage saat komponen diinisialisasi
    onMounted(() => {
      todoStore.loadFromLocalStorage()
    })

    return {
      newTodo,
      filteredTodos: todoStore.filteredTodos,
      addNewTodo,
      toggleTodoDone,
      removeTodoItem,
      editTodoItem,
      setEditing,
      showAll,
      showActive,
      showCompleted,
      removeCompleted,
      filter: todoStore.filter,
      unfinishedTodos: todoStore.unfinishedTodos,
      completedTodos: todoStore.completedTodos
    }
  }
}
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

input {
  width: 70%;
  padding: 12px;
  border: 2px solid #ced4da;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 12px 24px;
  margin-left: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.filters {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filters button {
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  background-color: #ddd;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filters button.active {
  background-color: #007bff;
  color: white;
}

.filters button:hover {
  background-color: #ccc;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ced4da;
  transition: background-color 0.3s;
}

.todo-item:hover {
  background-color: #e9ecef;
}

.todo-item:last-child {
  border-bottom: none;
}

span {
  cursor: pointer;
  flex-grow: 1;
  text-align: left;
  transition: color 0.3s;
}

.done {
  text-decoration: line-through;
  color: #6c757d;
}

.buttons {
  display: flex;
  gap: 10px;
}

.edit-button, .remove-button {
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s;
}

.edit-button {
  color: #007bff;
}

.edit-button:hover {
  color: #0056b3;
}

.remove-button {
  color: #dc3545;
}

.remove-button:hover {
  color: #bd2130;
}

.footer {
  margin-top: 20px;
  color: #6c757d;
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}

.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>