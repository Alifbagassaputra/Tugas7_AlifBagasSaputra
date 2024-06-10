// src/stores/todoStore.js
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    filter: 'all'
  }),
  actions: {
    addTodo(todo) {
      this.todos.push({ text: todo, done: false, editing: false })
      this.saveToLocalStorage() // Simpan data setiap kali menambahkan tugas baru
    },
    remove(index) {
      this.todos.splice(index, 1)
      this.saveToLocalStorage() // Simpan data setiap kali menghapus tugas
    },
    toggleTodo(index) {
      this.todos[index].done = !this.todos[index].done
      this.saveToLocalStorage() // Simpan data setiap kali mengubah status tugas
    },
    edit(index, newText) {
      this.todos[index].text = newText
      this.todos[index].editing = false
      this.saveToLocalStorage() // Simpan data setiap kali mengedit tugas
    },
    setEditing(index, editing) {
      this.todos[index].editing = editing
      this.saveToLocalStorage() // Simpan data setiap kali mengubah status pengeditan tugas
    },
    setFilter(filter) {
      this.filter = filter
    },
    removeCompletedTodos() {
      this.todos = this.todos.filter(todo => !todo.done)
      this.saveToLocalStorage() // Simpan data setiap kali menghapus tugas yang sudah selesai
    },
    saveToLocalStorage() {
      // Simpan data ke Local Storage
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    loadFromLocalStorage() {
      // Ambil data dari Local Storage
      const storedTodos = JSON.parse(localStorage.getItem('todos'))
      if (storedTodos) {
        this.todos = storedTodos
      }
    }
  },
  getters: {
    filteredTodos: (state) => {
      if (state.filter === 'all') {
        return state.todos
      } else if (state.filter === 'completed') {
        return state.todos.filter(todo => todo.done)
      } else if (state.filter === 'active') {
        return state.todos.filter(todo => !todo.done)
      }
    },
    unfinishedTodos: (state) => state.todos.filter(todo => !todo.done).length,
    completedTodos: (state) => state.todos.filter(todo => todo.done).length
  },
  // Saat store diinisialisasi, coba untuk mengambil data dari Local Storage
  // agar data tugas-tugas terakhir yang tersimpan bisa dimuat kembali
  init() {
    this.loadFromLocalStorage()
  }
})
