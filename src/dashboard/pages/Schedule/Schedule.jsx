import React, { useEffect, useState } from "react";
import {
  createRoutine,
  fetchRoutines,
  fetchRoutineById,
  updateRoutineById,
  deleteRoutineById,
} from "../../../utils/Api";
import { tokens } from "../../../theme";
import {Box, Button, Typography, useTheme} from "@mui/material";

const Schedule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: "", description: "" });
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  // Fetch routines on mount
  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const data = await fetchRoutines();
      setRoutines(data);
    } catch (err) {
      console.error("Failed to load routines:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const routine = await createRoutine(newRoutine);
      setRoutines((prev) => [...prev, routine]);
      setNewRoutine({ title: "", description: "" });
    } catch (err) {
      console.error("Failed to create routine:", err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await updateRoutineById(id, { title: "Updated Title" });
      setRoutines((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      console.error("Failed to update routine:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoutineById(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete routine:", err);
    }
  };

  const handleFetchById = async (id) => {
    try {
      const routine = await fetchRoutineById(id);
      setSelectedRoutine(routine);
    } catch (err) {
      console.error("Failed to fetch routine by id:", err);
    }
  };

  return (
    <div className="m-[20px] pt-4">
             <div className="mb-[30px]  w-full justify-between flex">
                        <Typography 
                        variant="h3" 
                        color={colors.text.primary} 
                        fontWeight="bold" 
                        
                        >ROUTINES</Typography>
                        <Button variant="contained">
                          View in Calendar
                        </Button>
                    
                </div>
    
      
      
    


      {/* Create Form */}
      <form onSubmit={handleCreate} className="my-4 flex gap-2">
        <input
          type="text"
          placeholder="Title"
          value={newRoutine.title}
          onChange={(e) =>
            setNewRoutine((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border px-2 py-1"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newRoutine.description}
          onChange={(e) =>
            setNewRoutine((prev) => ({ ...prev, description: e.target.value }))
          }
          className="border px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </form>

      {/* Routines List */}
      {loading ? (
        <p>Loading routines...</p>
      ) : (
        <ul className="space-y-2">
          {routines.map((routine) => (
            <li
              key={routine.id}
              className="border p-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{routine.subtask_template_title}</p>
                <p className="text-sm text-gray-500">{routine.description}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(routine.id)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(routine.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleFetchById(routine.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  View
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Selected Routine */}
      {selectedRoutine && (
        <div className="mt-4 border p-3 bg-gray-50">
          <h3 className="font-bold">Routine Details</h3>
          <p>Routine: {selectedRoutine.name}</p>
          <p>Title: {selectedRoutine.subtask_template_title}</p>
          <p>Description: {selectedRoutine.subtask_template_description}</p>
          <p>Start Date: {selectedRoutine.start_date}</p>
          <p>End Date: {selectedRoutine.end_date}</p>
          <p>Frequency: {selectedRoutine.frequency}</p>

          <p>Reminder Time {selectedRoutine.reminder_time}</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;
