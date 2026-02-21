import { DragDropContext,type DropResult } from "@hello-pangea/dnd";
import  KanbanColumn  from "./KanbanColumn";
import type { Task, TaskStatus } from "@/type/task";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
];


interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskSelect: (task: Task) => void;
}

export default function TaskKanban({
  tasks,
  setTasks,
  onTaskSelect,
}: Props) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // same column + same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId
          ? { ...task, status: destination.droppableId as TaskStatus }
          : task
      )
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 ">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            columnId={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onTaskClick={onTaskSelect}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
