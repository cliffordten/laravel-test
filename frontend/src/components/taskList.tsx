import type React from "react";
import { MdDeleteForever } from "react-icons/md";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Task } from "@/interface";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  connectedUserId: number;
  loading?: boolean;
  onUpdated: (taskId: number, newTask: Partial<Task>) => void;
  onDeleted: (taskId: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdated,
  onDeleted,
  connectedUserId,
  loading,
}) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className={cn(task.completed ? "!text-green-700" : "")}>
                {task.name}
              </span>
              {connectedUserId === task.user_id ? (
                loading ? (
                  <span className="font-light">saving...</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={!!task.completed}
                      onClick={() =>
                        onUpdated(task?.id, {
                          completed: task.completed ? 0 : 1,
                        })
                      }
                    />
                    <MdDeleteForever
                      onClick={() => onDeleted(task?.id)}
                      className="text-lg cursor-pointer"
                    />
                  </div>
                )
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{task.description}</p>
            {task.image && (
              <div className="mt-2">
                <Image
                  src={task.image.url}
                  alt={task.name}
                  width={100}
                  height={100}
                  objectFit="contain"
                />
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              User name: {task.user?.name}, Email: {task.user?.email}{" "}
              {connectedUserId === task.user_id ? "(You)" : null}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
