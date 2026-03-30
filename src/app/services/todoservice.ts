import { Injectable } from '@angular/core';
import { TODOS } from '../model/mock-data';
import { DEFAULT_TODO_CATEGORY, Todo } from '../model/todo.model';

@Injectable({
  providedIn: 'root',
})

export class Todoservice {
  private readonly todos = TODOS.map(todo => this.cloneTodo(todo));

  async getTodos() {
    await sleep(1000);
    return this.todos.map(todo => this.cloneTodo(todo));
  }
  // 🧠 1. Math.random()
  // 👉 Generates a random number between 0 and 1
  // 🔢 2. .toString(36)
  // 👉 Converts number to base-36 string
  // Base 36 uses:
  // 0–9 + a–z
  // Example:
  // (0.834729374).toString(36)
  // // "0.xk29ab3"
  // ✔ Why base 36?
  // Shorter IDs
  // Mix of letters + numbers
  // Looks like real IDs
  // ✂️ 3. .substr(2, 9)
  // 👉 Extracts part of the string
  // "0.xk29ab3".substr(2, 9)
  // // "xk29ab3"
  // Why 2?
  // Skip "0." at start
  // Why 9?
  // Limit ID length to 9 characters
  // 🎯 Final Result
  // "xk29ab3d2"  // random ID

  //used bcause if we add new item than also need some id so we create random id

  async addTodo(todo: Omit<Todo, 'id'>) {
    await sleep(1000);
    const createdTodo = {
      id: Math.random().toString(36).substr(2, 9), ...todo
    } as Todo;

    this.todos.push(this.cloneTodo(createdTodo));

    return this.cloneTodo(createdTodo);
  }

  async deleteTodo(id: string) {
    await sleep(500);

    const todoIndex = this.todos.findIndex(todo => todo.id === id);

    if (todoIndex >= 0) {
      this.todos.splice(todoIndex, 1);
    }
  }

  async updateTodo(id: string, completed: boolean) {
    await sleep(500);

    this.todos.forEach(todo => {
      if (todo.id === id) {
        todo.completed = completed;
      }
    });
  }

  async editTodo(id: string, changes: Partial<Omit<Todo, 'id' | 'completed'>>) {
    await sleep(500);

    this.todos.forEach(todo => {
      if (todo.id === id) {
        todo.title = changes.title ?? todo.title;
        todo.category = changes.category ?? todo.category ?? DEFAULT_TODO_CATEGORY;
        todo.tags = changes.tags ? [...changes.tags] : [...todo.tags];
        todo.attachments = changes.attachments
          ? changes.attachments.map(attachment => ({ ...attachment }))
          : todo.attachments.map(attachment => ({ ...attachment }));
      }
    });
  }

  private cloneTodo(todo: Todo): Todo {
    return {
      ...todo,
      category: todo.category || DEFAULT_TODO_CATEGORY,
      tags: [...(todo.tags ?? [])],
      attachments: (todo.attachments ?? []).map(attachment => ({ ...attachment })),
    };
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
