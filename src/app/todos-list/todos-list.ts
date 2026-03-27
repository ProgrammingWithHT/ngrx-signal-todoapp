import { Component, effect, inject, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list'
import { TodosStore } from '../store/todos.store';
import { MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { NgModel } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-todos-list',
  imports: [MatGridListModule,MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatListModule, MatIconModule, NgStyle],
  templateUrl: './todos-list.html',
  styleUrl: './todos-list.css',
})
export class TodosList {

  store = inject(TodosStore);

  async onTodoToggled(id: string, completed: boolean) {
    await this.store.updateTodo(id, completed)
  }
  async onDeleteTodo(id: string, event: MouseEvent) {
    event?.stopPropagation();
    await this.store.deleteTodo(id);
  }
  async onAddTodo(title: string) {
    await this.store.addTodo(title);
  }
}
