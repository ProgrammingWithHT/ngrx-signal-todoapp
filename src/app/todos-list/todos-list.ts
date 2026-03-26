import { computed, Component, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TodosStore, TodosFilter } from '../store/todos.store';

@Component({
  selector: 'app-todos-list',
  imports: [MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatListModule, MatIconModule],
  templateUrl: './todos-list.html',
  styleUrl: './todos-list.css',
})
export class TodosList {
  store = inject(TodosStore);
  filter = signal<TodosFilter>('all');

  totalCount = computed(() => this.store.todos().length);
  completedCount = computed(() => this.store.todos().filter(todo => todo.completed).length);
  pendingCount = computed(() => this.totalCount() - this.completedCount());
  filteredTodos = computed(() => {
    const selectedFilter = this.filter();
    const todos = this.store.todos();

    if (selectedFilter === 'pending') {
      return todos.filter(todo => !todo.completed);
    }

    if (selectedFilter === 'completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  });

  async onTodoToggled(id: string, completed: boolean) {
    await this.store.updateTodo(id, completed);
  }

  async onDeleteTodo(id: string, event: MouseEvent) {
    event.stopPropagation();
    await this.store.deleteTodo(id);
  }

  async onAddTodo(input: HTMLInputElement) {
    const title = input.value.trim();

    if (!title) {
      return;
    }

    input.value = '';
    await this.store.addTodo(title);
  }
}
