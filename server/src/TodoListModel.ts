import { Maybe } from 'true-myth';

export type TodoItem = {
    title: string;
    description: string;
}
class TodoList {
    TodoList: TodoItem[] = [];
    addNewItem({title,description}:TodoItem): Maybe<TodoItem[]> {
        if (this.TodoList.find((item => item.title === title))){
            return Maybe.nothing();
        }
        this.TodoList.push({title,description});
        return Maybe.just(this.TodoList);
    }
    removeItem(title: string): boolean {
        if (!this.TodoList.find((item => item.title === title))){
            return false;
        }
        const titleIndex = this.TodoList.map(item => item.title).indexOf(title);
        this.TodoList.splice(titleIndex,1);
        return true;
        
    }
    getAllItems(): Maybe<TodoItem[]> {
        return this.TodoList.length === 0 ? Maybe.nothing() : Maybe.just(this.TodoList)
    }
}

export default TodoList;