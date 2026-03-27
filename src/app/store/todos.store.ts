import { inject } from "@angular/core";
import { Todo } from "../model/todo.model";
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Todoservice } from "../services/todoservice";

export type TodosFilter = "all" | "pending" | "completed";

type TodosState = {
    todos: Todo[];
    loading: boolean;
    filter: TodosFilter;
}

const initialState: TodosState = {
    todos: [],
    loading: false,
    filter: "all"
}

export const TodosStore = signalStore(
    {providedIn: 'root'},  //This line means this store is globally accessible service that we can inject anywhere in the application 
    withState(initialState),
    withMethods(
        (store, todosService = inject(Todoservice)) => ({
            async loadAll(){
                patchState(store, {loading: true});  //update part of the state (partial update) without replacing the whole state.

                const todos = await todosService.getTodos();

                patchState(store, {todos, loading: false})
            },

            async addTodo(title:string){
                const todo = await todosService.addTodo({title, completed: false});

                patchState(store, (state) => ({
                    todos: [...state.todos, todo]
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

            setFilter(filter: TodosFilter){
                patchState(store, {filter})
            }
            
        })
    ),

    withComputed(({ todos, filter }) => ({

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
        completedCount: () => todos().filter(data => data.completed).length

    }))
)