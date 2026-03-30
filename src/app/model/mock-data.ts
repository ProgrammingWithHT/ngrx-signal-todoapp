import { DEFAULT_TODO_CATEGORY, Todo } from "./todo.model"

export const TODOS: Todo[] = [
    { id: "1", title: "Learn Angular", completed: false, category: "Frontend", tags: ["angular", "signals"], attachments: [] },
    { id: "2", title: "Learn React", completed: false, category: "Frontend", tags: ["react"], attachments: [] },
    { id: "3", title: "Learn Vue", completed: false, category: "Frontend", tags: ["vue"], attachments: [] },
    { id: "4", title: "Learn Svelte", completed: false, category: "Frontend", tags: ["svelte"], attachments: [] },
    { id: "5", title: "Learn Node", completed: false, category: "Backend", tags: ["node"], attachments: [] },
    { id: "6", title: "Learn Nest", completed: false, category: "Backend", tags: ["nestjs"], attachments: [] },
    { id: "7", title: "Learn Next", completed: false, category: "Frontend", tags: ["nextjs"], attachments: [] },
    { id: "8", title: "Learn Express", completed: false, category: "Backend", tags: ["express"], attachments: [] },
    { id: "9", title: "Learn Go", completed: false, category: "Backend", tags: ["go"], attachments: [] },
    { id: "10", title: "Learn DotNet", completed: false, category: "Backend", tags: ["dotnet"], attachments: [] },
    { id: "11", title: "Learn Java", completed: false, category: "Backend", tags: ["java"], attachments: [] },
    { id: "12", title: "Learn C++", completed: false, category: DEFAULT_TODO_CATEGORY, tags: ["cpp"], attachments: [] },
    { id: "13", title: "Learn Python", completed: false, category: DEFAULT_TODO_CATEGORY, tags: ["python"], attachments: [] },
]
