import { inject } from "@angular/core";
import { DEFAULT_TODO_CATEGORY, Todo, TodoAttachment } from "../model/todo.model";
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Todoservice } from "../services/todoservice";

export type TodosFilter = "all" | "pending" | "completed";
export type TodoDraft = {
    title: string;
    category: string;
    tags: string[];
    attachments: TodoAttachment[];
}

type TodosState = {
    todos: Todo[];
    loading: boolean;
    filter: TodosFilter;
    categories: string[];
}

const initialState: TodosState = {
    todos: [],
    loading: false,
    filter: "all",
    categories: [DEFAULT_TODO_CATEGORY],
}

export const TodosStore = signalStore(
    {providedIn: 'root'},  //This line means this store is globally accessible service that we can inject anywhere in the application 
    withState(initialState),
    withMethods(
        (store, todosService = inject(Todoservice)) => ({
            async loadAll(){
                patchState(store, {loading: true});  //update part of the state (partial update) without replacing the whole state.

                const todos = await todosService.getTodos();
                const categories = Array.from(new Set([
                    DEFAULT_TODO_CATEGORY,
                    ...todos.map(todo => todo.category || DEFAULT_TODO_CATEGORY),
                ]));

                patchState(store, {todos, categories, loading: false})
            },

            async addTodo(draft: TodoDraft){
                const todo = await todosService.addTodo({
                    title: draft.title,
                    completed: false,
                    category: draft.category || DEFAULT_TODO_CATEGORY,
                    tags: [...draft.tags],
                    attachments: draft.attachments.map(attachment => ({ ...attachment })),
                });

                patchState(store, (state) => ({
                    todos: [...state.todos, todo],
                    categories: ensureCategory(state.categories, todo.category),
                }))
            },

            async deleteTodo(id: string){
                await todosService.deleteTodo(id);
   
                patchState(store, (state)=> ({
                    todos: state.todos.filter(todo => todo.id !== id)
                }))
            },

            async updateTodo(id:string, completed: boolean){
                await todosService.updateTodo(id, completed);

                patchState(store, (state) => ({
                    todos: state.todos.map(todo => 
                        todo.id == id ? {...todo, completed}: todo
                    )
                }))
            },

            async editTodo(id: string, draft: TodoDraft){
                await todosService.editTodo(id, {
                    title: draft.title,
                    category: draft.category,
                    tags: [...draft.tags],
                    attachments: draft.attachments.map(attachment => ({ ...attachment })),
                });

                patchState(store, (state)=> ({
                    todos: state.todos.map(todo => todo.id == id ? {
                        ...todo,
                        title: draft.title,
                        category: draft.category || DEFAULT_TODO_CATEGORY,
                        tags: [...draft.tags],
                        attachments: draft.attachments.map(attachment => ({ ...attachment })),
                    }: todo),
                    categories: ensureCategory(state.categories, draft.category || DEFAULT_TODO_CATEGORY),
                }))
            },

            setFilter(filter: TodosFilter){
                patchState(store, {filter})
            },

            addCategory(name: string){
                const category = name.trim();

                if (!category) {
                    return;
                }

                patchState(store, (state) => ({
                    categories: ensureCategory(state.categories, category),
                }));
            },

            removeCategory(name: string){
                if (!name || name === DEFAULT_TODO_CATEGORY) {
                    return;
                }

                patchState(store, (state) => ({
                    categories: state.categories.filter(category => category !== name),
                    todos: state.todos.map(todo =>
                        todo.category === name ? { ...todo, category: DEFAULT_TODO_CATEGORY } : todo
                    ),
                }));
            }
            
        })
    ),

    withComputed(({ todos, filter, categories }) => ({

        filteredTodos: () => {
            // console.log("cocc", filter())
            if (filter() === 'all') return todos();

            if (filter() === 'pending') {
                return todos().filter(todo => !todo.completed);
            }

            if (filter() === 'completed') {
                return todos().filter(todo => todo.completed);
            }

            return todos();
        },

        totalCount: () => todos().length,
        pendingCount: () => todos().filter((data)=>{
            return (!data.completed)
        }).length,
        completedCount: () => todos().filter(data => data.completed).length,
        availableCategories: () => categories(),

    }))
)

function ensureCategory(categories: string[], category: string) {
    if (!category) {
        return categories;
    }

    return categories.includes(category) ? categories : [...categories, category];
}
