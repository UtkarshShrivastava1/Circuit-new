import type { Task } from "@/type/task";
import StatusBadge from "../ui/StatusBadge";
import React from "react";

interface Props {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}
 function TaskTable({ tasks, onOpenTask }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="bg-base-100 border border-base-300 rounded-lg p-6 text-center text-sm text-base-content/60">
        No tasks found
      </div>
    );
  }

  return (
    <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Due</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="cursor-pointer hover:bg-base-200 text-base-content"
              onClick={() => onOpenTask(task)}
            >
              <td className="font-medium">{task.title}</td>
              <td>{task.assignee}</td>
              <td>
                <StatusBadge
                  status={
                    task.status === "completed"
                      ? "approved"
                      : task.status === "in-progress"
                      ? "pending"
                      : "pending"
                  }
                />
              </td>
              <td>{task.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(TaskTable);
