import { useState, useEffect } from "react";
import apiService from "@/lib/request";
import { Task } from "@/interface";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTask, setUserTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getTasks();
      if (response.data?.length) {
        setTasks(response.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getMyTasks();
      if (response.data?.length) {
        setUserTasks(response.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Task) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createTask(taskData);
      if (response.data) {
        setTasks((prevTasks) => [response.data as Task, ...prevTasks]);
        setUserTasks((prevTasks) => [response.data as Task, ...prevTasks]);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    setLoading(true);
    setError(null);
    console.log(taskData);
    try {
      const response = await apiService.updateTask(id, taskData);
      if (response.data) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? (response.data as Task) : task
          )
        );
        setUserTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? (response.data as Task) : task
          )
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setUserTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserTasks();
  }, []);

  return {
    tasks,
    userTask,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

export default useTasks;
