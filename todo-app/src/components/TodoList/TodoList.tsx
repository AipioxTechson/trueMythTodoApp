import React, { useEffect, useState } from "react";
import { Result } from "true-myth";

//Types
type Item = {
  title: string;
  description: string;
};

type ItemResponse = {
  items: Item[];
};

//Transformers
const TransformGet = async (res: Response): Promise<Result<Item[], []>> => {
  if (!res.ok) {
    return Result.err([]);
  }
  const result = (await res.json()) as ItemResponse;
  const items: Item[] = result.items;
  return Result.ok(items);
};

const TransformPost = async (
  res: Response
): Promise<Result<Item[], string>> => {
  if (!res.ok) {
    return Result.err("Could not add Item");
  }
  const result = (await res.json()) as ItemResponse;
  const items: Item[] = result.items;
  return Result.ok(items);
};

const TransformDelete = async (
  res: Response
): Promise<Result<boolean, string>> => {
  if (!res.ok) {
    return Result.err("Could not delete item");
  }
  return Result.ok(true);
};

export const TodoList = () => {
  
  //States
  const [todoItems, setTodoItems] = useState<Item[]>([]);
  const [currentTitle, setTitle] = useState<string>("");
  const [currentDescription, setDescription] = useState<string>("");
  const [itemToDelete, setItemToDelete] = useState<string>("");

  //helper functions
  const addNewItem = (title: string, description: string): void => {
    const data = {
      title,
      description,
    };
    fetch(`http://${window.location.hostname}:5000/api/addItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => TransformPost(res))
      .then((resMaybe) => {
        if (resMaybe.isOk()) {
          setTodoItems(resMaybe.value);
        } else {
          alert(resMaybe.error);
        }
      });
  };

  const deleteItem = (title: string): void => {
    const data = {
      title,
    }
    fetch(`http://${window.location.hostname}:5000/api/removeItem`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => TransformDelete(res))
      .then((resMaybe) => {
        if (resMaybe.isOk()) {
          if (resMaybe.value){
            setTodoItems((todoItems) => todoItems.filter(todoItem => todoItem.title !== title) );
          }
        } else {
          alert(resMaybe.error);
        }
      });
  }

  useEffect(() => {
    fetch(`http://${window.location.hostname}:5000/api/getAll`)
      .then(async (res: Response) => TransformGet(res))
      .then((resMaybe) => {
        if (resMaybe.isOk()) {
          setTodoItems(resMaybe.value);
        } else {
          setTodoItems([]);
        }
      });
  }, []);

  return (
    <div>
      <h1>TODO App</h1>
      <div className="add-item">
        <h2>Add New Item:</h2>
        <div>
          Title:{" "}
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={currentTitle}
          />
        </div>
        <br />
        <div>
          Description:{" "}
          <input
            onChange={(e) => setDescription(e.target.value)}
            value={currentDescription}
          />
        </div>
        <button onClick={(e) => addNewItem(currentTitle, currentDescription)}>
          Create New Item
        </button>
      </div>
      <div className="item-list">
        <h2>TodoItems:</h2>
        <ul>
          {todoItems.map((todoItem, index) => (
            <li key={index}>
              Title: {todoItem.title} description: {todoItem.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="delete-item">
        <h2>Delete Item:</h2>
        Title: <input onChange = {(e) => setItemToDelete(e.target.value)} value={itemToDelete}/>
        <br />
        Submit: <button onClick={() => deleteItem(itemToDelete)}>Delete Item</button>
      </div>
    </div>
  );
};
export default TodoList;
