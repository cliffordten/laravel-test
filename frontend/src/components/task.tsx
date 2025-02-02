/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "@/interface";
import { TaskList } from "./taskList";
import { NewTaskModal } from "./newTask";

const initialTasks: Task[] = [
  {
    id: 1,
    user_id: "user1",
    name: "Complete project",
    description: "Finish the React project by end of week",
    image: undefined,
    completed: false,
    gps_coordinates: "40.7128,-74.0060",
    user_ip: "192.168.1.1",
  },
  // Add more sample tasks here
];

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewTask = (values: any) => {
    const newTask: Task = {
      ...values,
      id: Date.now().toString(),
      image_url: values.image ? URL.createObjectURL(values.image) : "",
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const userTasks = tasks.filter((task) => task.user_id === "user1"); // Replace 'user1' with actual user ID

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <button
        type="submit"
        className="group relative my-4 max-w-md flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        onClick={() => setIsModalOpen(true)}
      >
        New Task
      </button>
      <Tabs defaultValue="user">
        <TabsList>
          <TabsTrigger value="user">My Tasks</TabsTrigger>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <TaskList tasks={userTasks} />
        </TabsContent>
        <TabsContent value="all">
          <TaskList tasks={tasks} />
        </TabsContent>
      </Tabs>
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewTask}
      />
    </div>
  );
};

export default TaskManagement;
