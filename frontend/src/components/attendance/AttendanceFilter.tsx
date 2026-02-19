import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface Props {
  name?: string;
  fromDate?: string;
  toDate?: string;
  onChange: (filters: {
    name?: string;
    fromDate?: string;
    toDate?: string;
  }) => void;
  isAdmin?: boolean;
}

export default function AttendanceFilters({
  name,
  fromDate,
  toDate,
  onChange,
  isAdmin = false,
}: Props) {
  return (
    <div className="hidden md:flex bg-base-100 border border-base-300 rounded-lg p-4  flex-col md:flex-row gap-4 items-end">
      {/* Name search (Admin only) */}
      {isAdmin && (
        <div className="flex flex-col gap-1 w-full md:w-1/3">
          <label className="text-xs text-base-content/60">
           Employee Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) =>
              onChange({
                name: e.target.value,
                fromDate,
                toDate,
              })
            }
            placeholder=" Search by name"
            className="w-full px-4 py-3 rounded-xl bg-[#ecf0f3]
                shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]
                focus:outline-none"
          />
        </div>
      )}

      {/* From date */}
      <div className="flex flex-col gap-1 w-full md:w-1/4">
        <label className="text-xs text-base-content/60">
          From
        </label>
        <input
          
          type="date"
          value={fromDate}
          onChange={(e) =>
            onChange({
              name,
              fromDate: e.target.value,
              toDate,
            })
          }
          className="w-full px-4 py-3 rounded-xl bg-[#ecf0f3]
                shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]
                focus:outline-none"
        />
      </div>

      {/* To date */}
      <div className="flex flex-col gap-1 w-full md:w-1/4">
       <label className="text-xs text-base-content/60">
          To
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            onChange({
              name,
              fromDate,
              toDate: e.target.value,
            })
          }
          className="w-full px-4 py-3 rounded-xl bg-[#ecf0f3]
                shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]
                focus:outline-none"
        />
      </div>

      {/* Clear */}
      <Button
        // className="btn btn-ghost border border-base-300      shadow-[inset_4px_4px_8px_#c8ccd1,inset_-4px_-4px_8px_#ffffff]
        //         focus:outline-none"
        onClick={() => onChange({})}
      >
        Reset
      </Button>
    </div>
  );
}
