import { MdAdd, MdClose } from "react-icons/md";
import type { ChecklistItem } from "@/type/task";
import { useState } from "react";

interface Props {
  value: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export default function Checklist({ value, onChange }: Props) {
  const [text, setText] = useState("");

  const addItem = () => {
    if (!text.trim()) return;
    onChange([
      ...value,
      { id: crypto.randomUUID(), text, done: false },
    ]);
    setText("");
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-base-content/60">
        Checklist
      </label>

      {value.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 
          bg-base-100 border border-base-300 
          rounded-lg px-3 py-2"
        >
          <input
            type="checkbox"
            checked={item.done}
            onChange={() =>
              onChange(
                value.map((i) =>
                  i.id === item.id
                    ? { ...i, done: !i.done }
                    : i
                )
              )
            }
          />
          <span
            className={`flex-1 text-sm ${
              item.done ? "line-through text-base-content/50" : ""
            }`}
          >
            {item.text}
          </span>

          <button
            onClick={() =>
              onChange(value.filter((i) => i.id !== item.id))
            }
          >
            <MdClose />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add checklist item"
          className="input input-bordered w-full border border-base-300 focus:ring-0"
        />
        <button
          className="btn btn-square btn-primary"
          onClick={addItem}
        >
          <MdAdd />
        </button>
      </div>
    </div>
  );
}
