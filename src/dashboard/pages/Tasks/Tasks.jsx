import React, { useContext, useEffect, useState } from "react";
import { TasksContext } from '../../../context/TasksContext';
import { fetchTasks } from '../../../utils/Api';
import { motion } from 'framer-motion';
import TaskItem  from '../../components/TaskItem';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#8B5CF6', '#E5E7EB']; // Purple and gray


const Tasks = () => {
  const { tasks, setTasks } = useContext(TasksContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    refreshTasks();
  }, [tasks.length]); // Run only on mount

  // Calculating dynamic values
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overdueTasks = tasks.filter(task => new Date(task.due_date) < new Date() && task.status !== 'completed').length;

  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Remaining', value: totalTasks - completedTasks },
  ];


  if (loading) {
    return (
      <div className='w-full mt-8 flex min-h-screen'>
        <div className="w-11/12 p-8 mt-8 py-8 flex-1 flex justify-center items-center overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
          <motion.div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#65558F] rounded-full"
                initial={{ y: -10 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen p-6">
    
      <div className="w-1/2 pr-2">
        <h1 className="text-xl font-bold mb-4 pl-6">
          Hi Marie. <br />
          <span className="text-sm font-bold text-gray-500 mt-1 inline-block">
            Here are your tasks, go get 'em!'
          </span>
        </h1>
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id} >
                <TaskItem task={task} />
              </li>
            ))                 
        
          ) : (
            <p>No tasks available.</p>
          )}
        </ul>
      </div>

      {/* right side*/}
      <div className="w-1/2 flex flex-col items-center gap-6 pt-10">
       {/* Pie Chart */}
       <div className="w-64 h-64">
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

         {/* Overdue Tasks Box */}
         <div className="bg-red-100 text-red-700 p-6 rounded-xl shadow w-full max-w-xs text-center">
          <h2 className="text-lg font-semibold">Overdue Tasks</h2>
          <p className="text-3xl font-bold mt-1">{overdueTasks}</p>
        </div>

      </div>

    </div>  

    
  );
};

export default Tasks;
