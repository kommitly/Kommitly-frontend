import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchTasks } from '../utils/Api'; // Adjust the import path as needed
import { AuthContext } from './AuthContext'; // adjust the path

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {    
    const [tasks, setTasks] = useState([]);
    const { user, loading } = useContext(AuthContext); // get loading + user
    

    const [hiddenTasks, setHiddenTasks] = useState(() => {
        const storedHiddenTasks = localStorage.getItem("hiddenTasks");
        return storedHiddenTasks ? new Set(JSON.parse(storedHiddenTasks)) : new Set();
    });

    const [pinnedTasks, setPinnedTasks] = useState(() => {
        const storedPinnedTasks = localStorage.getItem("pinnedTasks");
        return storedPinnedTasks ? new Set(JSON.parse(storedPinnedTasks)) : new Set();
    });


    useEffect(() => {
        const loadTasks = async () => {
        const token = localStorage.getItem("token");  // Check if token exists
        if (!token || !user) return;

            try {
                const fetchedTasks = await fetchTasks();
                console.log('Fetched tasks:', fetchedTasks);
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks from context:', error);
            }
        };

         if (!loading && user) {
      loadTasks();
    }
  }, [user, loading]); // Run when user or loading changes


    const addTask = (newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const removeTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };

    const removeTaskFromSidebar = (taskId) => {
        setHiddenTasks((prevHidden) => {
            const updatedHidden = new Set([...prevHidden, taskId]);
            localStorage.setItem("hiddenTasks", JSON.stringify([...updatedHidden]));
            return updatedHidden;
        });

        setPinnedTasks((prevPinned) => {
            const updatedPinned = new Set(prevPinned);
            updatedPinned.delete(taskId);
            localStorage.setItem("pinnedTasks", JSON.stringify([...updatedPinned]));
            return updatedPinned;
        });
    };

    const unhideTask = (taskId) => {
        setHiddenTasks((prevHidden) => {
            const updatedHidden = new Set(prevHidden);
            updatedHidden.delete(taskId);
            localStorage.setItem("hiddenTasks", JSON.stringify([...updatedHidden]));
            return updatedHidden;
        });
    };


    const addTaskToSidebar = (taskId) => {
        setPinnedTasks((prevPinned) => {
            const updatedPinned = new Set(prevPinned);
            updatedPinned.add(taskId);
            localStorage.setItem("pinnedTasks", JSON.stringify([...updatedPinned]));
            return updatedPinned;
        });

        setHiddenTasks((prevHidden) => {
            const updatedHidden = new Set(prevHidden);
            updatedHidden.delete(taskId);
            localStorage.setItem("hiddenTasks", JSON.stringify([...updatedHidden]));
            return updatedHidden;
        });
    };

    return (
        <TasksContext.Provider value={{ tasks, setTasks, addTask, removeTask,  removeTaskFromSidebar, hiddenTasks, unhideTask, addTaskToSidebar, pinnedTasks  }}>
            {children}
        </TasksContext.Provider>
    );
}