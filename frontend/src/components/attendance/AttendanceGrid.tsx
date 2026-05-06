// import React, { useMemo } from "react";

// interface Employee {
//   id: string;
//   name: string;
//   code: string;
// }

// interface AttendanceRecord {
//   date: string;
//   records: {
//     employee: { _id: string; name: string };
//     status: "PRESENT" | "ABSENT" | "HALF_DAY" | "ON_LEAVE" | "WFH";
//   }[];
// }

// interface Props {
//   employees: Employee[];
//   attendanceData: AttendanceRecord[];
//   month: number; // 0-11
//   year: number;
// }

// export default function AttendanceGrid({
//   employees,
//   attendanceData,
//   month,
//   year,
// }: Props) {
// const today = new Date();

// const todayISO = `${today.getFullYear()}-${String(
//   today.getMonth() + 1
// ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
// const formatLocalDate = (date: Date) => {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
// };
//   /* ================= CREATE DAYS ================= */
//  const days = useMemo(() => {
//   const totalDays = new Date(year, month + 1, 0).getDate();

//   return Array.from({ length: totalDays }, (_, i) => {
//     const date = i + 1;
//     const fullDateObj = new Date(year, month, date);

//     return {
//       date,
//       fullDate: formatLocalDate(fullDateObj), // ✅ FIXED
//       day: fullDateObj.toLocaleDateString("en-US", { weekday: "short" }),
//     };
//   });
// }, [month, year]);
//   /* ================= MAP ================= */
//   const attendanceMap = useMemo(() => {
//     const map: Record<string, string> = {};

//     attendanceData.forEach((day) => {
//      const formattedDate = formatLocalDate(new Date(day.date));

//       day.records.forEach((r) => {
//         const empId = r.employee._id;
//         map[`${empId}_${formattedDate}`] = r.status;
//       });
//     });

//     return map;
//   }, [attendanceData]);

//   /* ================= STYLE ================= */
//   const getStatusStyle = (status?: string) => {
//     switch (status) {
//       case "PRESENT":
//         return "bg-green-100 text-green-700";
//       case "ABSENT":
//         return "bg-red-100 text-red-700";
//       case "HALF_DAY":
//         return "bg-orange-100 text-orange-700";
//       case "ON_LEAVE":
//         return "bg-yellow-100 text-yellow-700";
//       case "WFH":
//         return "bg-blue-100 text-blue-700";
//       default:
//         return "text-base-content/30";
//     }
//   };

//   const getLabel = (status?: string) => {
//     if (!status) return "-";
//     if (status === "PRESENT") return "P";
//     if (status === "ABSENT") return "A";
//     if (status === "HALF_DAY") return "H";
//     if (status === "ON_LEAVE") return "L";
//     if (status === "WFH") return "W";
//   };

//   return (
//     <div className="w-full overflow-auto border border-base-300 rounded-xl mt-6">

//       <table className="min-w-max border-collapse">

//         {/* HEADER */}
//         <thead>
//           <tr className="bg-[#0f1b2d] text-white">
//             <th className="sticky left-0 z-10 bg-[#0f1b2d] px-6 py-4 text-left min-w-[250px]">
//               STAFF MEMBER
//             </th>

//           {days.map((d) => {
//   const isToday = d.fullDate === todayISO;
//  console.log("Comparing:", d.fullDate, todayISO, "Is Today?", isToday);
//   return (
//     <th
//       key={d.date}
//       className={`px-3 py-2 text-center
//         ${isToday ? "bg-primary text-white" : ""}
//       `}
//     >
//       <div className="text-sm font-semibold">{d.date}</div>
//       <div className="text-xs opacity-70">{d.day}</div>
//     </th>
//   );
// })}
//           </tr>
//         </thead>

//         {/* BODY */}
//         <tbody>
//           {employees.map((emp) => (
//             <tr key={emp.id} className="hover:bg-base-200/40 transition">

//               {/* LEFT COLUMN */}
//               <td className="sticky left-0 bg-base-100 z-10 border-r border-base-300 px-4 py-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center font-semibold">
//                     {emp.name.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="font-semibold">{emp.name}</p>
//                     <p className="text-xs text-base-content/60">
//                       {emp.code}
//                     </p>
//                   </div>
//                 </div>
//               </td>

//               {/* CELLS */}
//               {days.map((d) => {
//                 const isToday = d.fullDate === todayISO;
//                 const status =
//                   attendanceMap[`${emp.id}_${d.fullDate}`];

//                 const isSunday = d.day === "Sun";

//                 return (
//                 <td
//   key={d.date}
//   className={`w-12 h-12 text-center text-sm border border-base-300
//     ${isSunday ? "bg-red-50" : ""}
//     ${isToday ? "ring-2 ring-primary bg-blue-50 font-bold" : ""}
//     ${getStatusStyle(status)}
//   `}
// >
//   {getLabel(status)}
// </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useMemo } from "react";

interface Employee {
  id: string;
  name: string;
  code: string;
}

interface AttendanceRecord {
  date: string;
  records: {
    employee: { _id: string; name: string };
    status: "PRESENT" | "ABSENT" | "HALF_DAY" | "ON_LEAVE" | "WFH";
  }[];
}

interface Props {
  employees: Employee[];
  attendanceData: AttendanceRecord[];
  month: number;
  year: number;
}

export default function AttendanceGrid({
  employees,
  attendanceData,
  month,
  year,
}: Props) {
  const today = new Date();

  const formatLocalDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const todayISO = formatLocalDate(today);

  /* ================= DAYS ================= */
  const days = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: totalDays }, (_, i) => {
      const date = i + 1;
      const fullDateObj = new Date(year, month, date);

      return {
        date,
        fullDate: formatLocalDate(fullDateObj),
        day: fullDateObj.toLocaleDateString("en-US", {
          weekday: "short",
        }),
      };
    });
  }, [month, year]);

  /* ================= MAP ================= */
  const attendanceMap = useMemo(() => {
    const map: Record<string, string> = {};

    attendanceData.forEach((day) => {
      const formattedDate = formatLocalDate(new Date(day.date));

      day.records.forEach((r) => {
        const empId = r.employee._id;
        map[`${empId}_${formattedDate}`] = r.status;
      });
    });

    return map;
  }, [attendanceData]);

  /* ================= STYLE ================= */
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "PRESENT":
        return " text-green-600";
      case "ABSENT":
        return " text-red-600";
      case "HALF_DAY":
        return "bg-orange-50 text-orange-600";
      case "ON_LEAVE":
        return "bg-yellow-50 text-yellow-600";
      case "WFH":
        return "bg-blue-50 text-blue-600";
      default:
        return "text-base-content/30";
    }
  };

  const getLabel = (status?: string) => {
    if (!status) return "-";
    if (status === "PRESENT") return "P";
    if (status === "ABSENT") return "A";
    if (status === "HALF_DAY") return "H";
    if (status === "ON_LEAVE") return "L";
    if (status === "WFH") return "W";
  };

  return (
    <div className="w-full overflow-auto border border-base-300 rounded-xl mt-6 bg-base-100">
      <table className="min-w-max border-collapse table-fixed">
        {/* HEADER */}
        <thead>
          <tr className="bg-primary text-primary-content ">
            <th className="sticky left-0 z-20 bg-primary px-3 py-4 text-left min-w-[250px] align-middle">
              <div className="flex items-center h-full">
                <span className="font-semibold">STAFF MEMBER</span>
              </div>
            </th>

            {days.map((d) => {
              const isToday = d.fullDate === todayISO;

              return (
                <th
                  key={d.date}
                  className={` text-center min-w-[48px]
            ${isToday ? "bg-red-500 text-white" : ""}
          `}
                >
                  <div className="flex flex-col items-center justify-center h-full"> 
                    <span className="text-sm font-semibold">{d.date}</span>
                    <span className="text-xs opacity-80">{d.day}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="hover:bg-base-200/30 transition-colors duration-200"
            >
              {/* LEFT COLUMN */}
              <td className="sticky left-0 bg-base-100 z-10 border border-base-200 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{emp.name}</p>
                    <p className="text-xs text-base-content/60">{emp.code}</p>
                  </div>
                </div>
              </td>

              {/* CELLS */}
              {days.map((d) => {
                const status = attendanceMap[`${emp.id}_${d.fullDate}`];

                const isSunday = d.day === "Sun";
                const isToday = d.fullDate === todayISO;

                return (
                  <td
                    key={d.date}
                    className={`w-12 h-12 text-center text-sm border border-base-300
                  
                      ${isToday ? "border-2 border-red-400 font-semibold" : ""}
                      ${getStatusStyle(status)}
                    `}
                  >
                    {getLabel(status)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
