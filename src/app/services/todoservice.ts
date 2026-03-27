import { Injectable } from '@angular/core';
import { TODOS } from '../model/mock-data';
import { Todo } from '../model/todo.model';

@Injectable({
  providedIn: 'root',
})

export class Todoservice {

  async getTodos(){
    await sleep(1000);
    return TODOS;
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

  async addTodo(todo:Partial<Todo>){
    await sleep(1000);
    return {
      id: Math.random().toString(36).substr(2,9),...todo 
    } as Todo
  }

  async deleteTodo(id: string){
    await sleep(500)
  }

  async updateTodo(id: string, completed: boolean) {
    await sleep(500);
  }
}

async function sleep(ms:number){
  return new Promise(resolve => setTimeout(resolve, ms));
}
