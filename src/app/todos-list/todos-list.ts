import { Component, computed, effect, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TODO_CATEGORY, Todo, TodoAttachment } from '../model/todo.model';
import { TodoDraft, TodosStore } from '../store/todos.store';

@Component({
  selector: 'app-todos-list',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    NgStyle,
  ],
  templateUrl: './todos-list.html',
  styleUrl: './todos-list.css',
})
export class TodosList {
  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('composer') composerRef!: ElementRef<HTMLElement>;

  store = inject(TodosStore);

  truncate(text: string, limit: number = 30): string {
  return text.length > limit ? text.slice(0, limit) + '...' : text;
}

  editingId: string | null = null;
  draftTitle = '';
  draftCategory = DEFAULT_TODO_CATEGORY;
  draftTags: string[] = [];
  draftAttachments: TodoAttachment[] = [];
  tagDraft = '';
  categoryDraft = '';

  page = signal(1);
  pageSize = signal(5);
  searchTerm = signal('');

  filteredAndSearchedTodos = computed(() => {
    const todos = this.store.filteredTodos();
    const search = this.searchTerm().toLowerCase().trim();

    if (!search) {
      return todos;
    }

    return todos.filter(todo =>
      todo.title.toLowerCase().includes(search) ||
      todo.category.toLowerCase().includes(search) ||
      todo.tags.some(tag => tag.toLowerCase().includes(search))
    );
  });

  paginatedTodos = computed(() => {
    const todos = this.filteredAndSearchedTodos();
    const start = (this.page() - 1) * this.pageSize();

    return todos.slice(start, start + this.pageSize());
  });

  totalPages = computed(() => {
    const total = Math.ceil(this.filteredAndSearchedTodos().length / this.pageSize());
    return total || 1;
  });

  constructor() {
    effect(() => {
      this.searchTerm();
      this.store.filter();
      this.filteredAndSearchedTodos().length;
      this.page.set(1);
    });
  }

  get isEditing() {
    return !!this.editingId;
  }

  unfocus() {
    this.inputRef?.nativeElement.blur();
  }

  @HostListener('document:mouseup', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.isEditing) {
      return;
    }

    const target = event.target as Node | null;
    const composer = this.composerRef?.nativeElement;
    const clickedInside = !!composer && !!target && composer.contains(target);

    if (!clickedInside) {
      this.unfocus();
      this.resetDraft();
    }
  }

  onStartTodo(todo: Todo, event: MouseEvent) {
    event.stopPropagation();

    this.editingId = todo.id;
    this.draftTitle = todo.title;
    this.draftCategory = todo.category || DEFAULT_TODO_CATEGORY;
    this.draftTags = [...todo.tags];
    this.draftAttachments = todo.attachments.map(attachment => ({ ...attachment }));
    this.tagDraft = '';

    queueMicrotask(() => {
      this.inputRef?.nativeElement.focus();
      this.inputRef?.nativeElement.select();
    });
  }

  onInputChange(value: string) {
    this.draftTitle = value;
  }

  onTagDraftKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.addTag();
  }

  addTag() {
    const tag = this.tagDraft.trim();

    if (!tag || this.draftTags.includes(tag)) {
      this.tagDraft = '';
      return;
    }

    this.draftTags = [...this.draftTags, tag];
    this.tagDraft = '';
  }

  removeTag(tag: string) {
    this.draftTags = this.draftTags.filter(existingTag => existingTag !== tag);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (!files.length) {
      return;
    }

    const nextAttachments = files.map(file => this.createAttachment(file));
    this.draftAttachments = [...this.draftAttachments, ...nextAttachments];
    input.value = '';
  }

  removeAttachment(attachmentId: string) {
    this.draftAttachments = this.draftAttachments.filter(attachment => attachment.id !== attachmentId);
  }

  onAddCategory() {
    const category = this.categoryDraft.trim();

    if (!category) {
      return;
    }

    this.store.addCategory(category);
    this.draftCategory = category;
    this.categoryDraft = '';
  }

  onRemoveCategory(category: string, event?: MouseEvent) {
    event?.stopPropagation();
    this.store.removeCategory(category);

    if (this.draftCategory === category) {
      this.draftCategory = DEFAULT_TODO_CATEGORY;
    }
  }

  async onSubmit() {
    const draft = this.buildDraft();
    const addedTitle = draft.title;

    if (!draft.title) {
      return;
    }

    if (this.editingId) {
      await this.store.editTodo(this.editingId, draft);
    } else {
      await this.store.addTodo(draft);
      window.alert(`"${addedTitle}" added successfully.`);
    }

    this.resetDraft();
    this.unfocus();
  }

  resetDraft() {
    this.editingId = null;
    this.draftTitle = '';
    this.draftCategory = DEFAULT_TODO_CATEGORY;
    this.draftTags = [];
    this.draftAttachments = [];
    this.tagDraft = '';
  }

  async onTodoToggled(id: string, completed: boolean) {
    await this.store.updateTodo(id, completed);
  }

  async onDeleteTodo(id: string, event: MouseEvent) {
    event.stopPropagation();
    await this.store.deleteTodo(id);
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update(page => page + 1);
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(page => page - 1);
    }
  }

  attachmentLabel(attachment: TodoAttachment) {
    const sizeInKb = Math.max(1, Math.round(attachment.size / 1024));
    return `${attachment.name} (${sizeInKb} KB)`;
  }

  private buildDraft(): TodoDraft {
    return {
      title: this.draftTitle.trim(),
      category: this.draftCategory || DEFAULT_TODO_CATEGORY,
      tags: [...this.draftTags],
      attachments: this.draftAttachments.map(attachment => ({ ...attachment })),
    };
  }

  private createAttachment(file: File): TodoAttachment {
    return {
      id: Math.random().toString(36).slice(2, 10),
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      url: URL.createObjectURL(file),
      kind: file.type.startsWith('image/') ? 'image' : 'file',
    };
  }
}
