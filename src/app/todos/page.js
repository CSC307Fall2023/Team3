'use client'

import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddBox from '@mui/icons-material/AddBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function ToDos() {

    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    function inputChangeHandler(e) {
        setNewTodo(e.target.value);
    }

    // const checkboxChangeHandler = (index) => {
    //     const updatedTodos = [...todos];
    //     updatedTodos[index].done = !updatedTodos[index].done;
    //     setTodos(updatedTodos);

    //     const todoToPatch = todos[index];
    //     fetch(`/api/todos/${todoToPatch}`, 
    //         {method: "put", 
    //         body: JSON.stringify({
    //             value: todoToPatch.value, 
    //             done: !todoToPatch.done
    //         })}.then((response) => {
    //             return response.json().then((newTodo) => {
    //                 todos.map((todo, idx) => idx === index ? { ...todo, done: !todo.done } : todo );
    //             });
    //         })
    //     );
    // }

    const checkboxChangeHandler = (index) => {
        // Create a copy of the current todos array
        const updatedTodos = [...todos];
        // Toggle the 'done' property
        updatedTodos[index].done = !updatedTodos[index].done;
      
        // Update the state with the modified array
        setTodos(updatedTodos);
      
        // Prepare the updated todo data
        const todoToPatch = updatedTodos[index];
        const updatedData = {
          value: todoToPatch.value,
          done: todoToPatch.done,
        };
      
        // Send a PUT request to update the todo on the server (assuming you have an API)
        fetch(`/api/todos/${todoToPatch.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to update todo item.");
            }
          })
          .then((newTodo) => {
            // Handle the updated todo item from the server if needed
            // You may update the state again with the server response
          })
          .catch((error) => {
            console.error("Error updating todo:", error);
          });
      };
      


    function addNewTodo() {
        if(newTodo && newTodo.length) {
            fetch("api/todos", { method: "post", body: JSON.stringify({value: newTodo, done: false}) } ).then((response) => {
                return response.json().then((newTodo) => {
                    setTodos([...todos, newTodo]);
                    setNewTodo('');
                });
            });
            
        }
    }

    function removeTodo({ index }) {
        const todoToRemove = todos[index];
        fetch(`/api/todos/${todoToRemove.id}`, {method: "delete"})
        setTodos(todos.filter((v,idx) => idx!==index));
    }

    useEffect(() => {
        fetch("/api/todos", { method: "get" }).then((response) => response.ok && response.json()).then(
            todos => {
                todos && setTodos(todos);
                setIsLoading(false);
            }
        );
    }, []);

    const loadingItems = <CircularProgress/>;

    const toDoItems = isLoading ? loadingItems : todos.map((todo, idx) => {
        return <ListItem key={idx} secondaryAction={
            <IconButton edge="end" onClick={() => removeTodo({index: idx})}><DeleteForever/></IconButton>   
        }>  
            <ListItemButton>
                <ListItemIcon>
                    <Checkbox checked={todo.done} onChange={() => checkboxChangeHandler(idx)}disableRipple/>
                </ListItemIcon>
                <ListItemText primary={todo.value}/>
            </ListItemButton>
        </ListItem>;
    });

    return (
        <>
            <h2>My ToDos</h2>
            <List sx={{ width: '100%', maxWidth: 500 }}>
                { toDoItems }
                {!isLoading && <ListItem key="newItem" secondaryAction={<IconButton edge="end" onClick={addNewTodo}><AddBox/></IconButton>}>
                    <TextField label="New ToDo Item" fullWidth variant="outlined" value={newTodo} onChange={inputChangeHandler}/> 
                </ListItem>}
            </List>
        </>
    );
}