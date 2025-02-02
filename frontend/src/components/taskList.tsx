import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Task } from "@/interface";

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{task.name}</span>
              <Checkbox checked={task.completed} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{task.description}</p>
            {task.image && (
              <div className="mt-2">
                <Image
                  src={task.image.url}
                  alt={task.name}
                  width={200}
                  height={200}
                  objectFit="contain"
                />
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              User ID: {task.user_id}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
