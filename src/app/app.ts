import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosStore } from './store/todos.store';
import { JsonPipe } from '@angular/common';
import { TodosList } from './todos-list/todos-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe, TodosList, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('signal-ngrx');

  store = inject(TodosStore);

  ngOnInit(){

    this.loadTodos().then(()=> console.log("Todos Loaded!"));

  }

  async loadTodos(){
    await this.store.loadAll();
  }

}
