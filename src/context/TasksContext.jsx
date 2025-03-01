import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchTasks } from '../utils/Api'; // Adjust the import path as needed

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {    
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const fetchedTasks = await fetchTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        loadTasks();
    }, [tasks.length]); // Re-fetch whenever tasks length changes

    const addTask = (newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const removeTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };

    return (
        <TasksContext.Provider value={{ tasks, setTasks, addTask, removeTask }}>
            {children}
        </TasksContext.Provider>
    );
}