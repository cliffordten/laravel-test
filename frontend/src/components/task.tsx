/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "@/interface";
import { TaskList } from "./taskList";
import { NewTaskModal } from "./newTask";
import useTasks from "@/hooks/useTask";

const TaskManagement: React.FC = () => {
  const {
    tasks,
    userTask,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewTask = async (values: any) => {
    const newTask: Task = {
      ...values,
      id: Date.now().toString(),
      image_url: values.image ? URL.createObjectURL(values.image) : "",
    };
    await createTask(newTask);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {loading && !tasks.length ? (
        <div>Loading ...</div>
      ) : (
        <>
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
              <TaskList
                connectedUserId={userTask?.[0]?.user_id}
                onUpdated={updateTask}
                onDeleted={deleteTask}
                tasks={userTask}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="all">
              <TaskList
                connectedUserId={userTask?.[0]?.user_id}
                onUpdated={updateTask}
                onDeleted={deleteTask}
                tasks={tasks}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
          <NewTaskModal
            error={error}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleNewTask}
          />
        </>
      )}
    </div>
  );
};

export default TaskManagement;
