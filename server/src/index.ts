import express, { Request, Response } from 'express';
import { Maybe } from 'true-myth';
import bodyParser from 'body-parser';
import TodoList, { TodoItem } from './TodoListModel';

const app = express();
const TodoListModel = new TodoList();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/getAll',(req: Request, res: Response) => {
    const items = TodoListModel.getAllItems();
    if (items.isJust()){
        res.send({items: items.value});
    }else{
        res.sendStatus(404);
    }
});

app.post('/api/addItem',(req:Request, res: Response) => {
    if (!req.body.title || !req.body.description){
        res.sendStatus(400);
    }else{
        const newListMaybe: Maybe<TodoItem[]> = TodoListModel.addNewItem({title: req.body.title,description: req.body.description});
        if (newListMaybe.isJust()){
            res.status(200).send({items: newListMaybe.value});
        }else{
            res.sendStatus(400);
        }
    }
})

app.delete('/api/removeItem',(req:Request, res: Response) => {
    if (!req.body.title){
        res.sendStatus(400);
    }else{
        const didRemove: boolean = TodoListModel.removeItem(req.body.title);
        if (didRemove){
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }
    }
})

app.listen(5000,() => console.debug("LISTENING"));