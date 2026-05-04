// import type { Member } from "@/type/member";
// import { useNavigate } from "react-router";

// type MemberCardProps = {
//   member: Member;
//   isAdmin?: boolean;
//    onDelete?: (id: string) => void;
// };




// const MemberCard = ({ member, isAdmin,onDelete }: MemberCardProps) => {
//   const navigate = useNavigate();
//   return (
//     <div className="relative bg-white rounded-xl shadow-md border border-gray-100 w-full overflow-hidden">

//       {/* Header */}
//       <div className="relative h-20 bg-blue-400">
//         <span
//           className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium
//             ${
//               member.status === "active"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-gray-200 text-gray-600"
//             }`}
//         >
//           {member.status}
//         </span>

//         {/* Avatar */}
//         <div className="absolute -bottom-8 left-5">
//           <div className="relative">
//             <img
//              src={member.imgUrl?.trim() ? member.imgUrl : "/user1.png"}

//               className="w-16 h-16 rounded-full border-4 border-white object-cover bg-white"
//             />
//             <span
//               className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white
//                 ${
//                   member.status === "active"
//                     ? "bg-green-500"
//                     : "bg-gray-400"
//                 }`}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="flex items-center gap-6 pt-12 pb-5 px-5">
//         {/* Info */}
//         <div className="flex-1 min-w-0 flex flex-col gap-1">
//           <h2 className="text-base font-semibold truncate text-gray-900">
//             {member.name}
//           </h2>

//           <p className="text-sm text-gray-500 truncate">
//             {member.email}
//           </p>

//           <span
//             className={`w-fit mt-2 px-3 py-1 text-xs rounded-full
//               ${
//                 member.role === "admin"
//                   ? "bg-red-100 text-red-600"
//                   : "bg-gray-100 text-gray-600"
//               }`}
//           >
//             {member.role}
//           </span>
//         </div>

//         {/* Actions */}
//         {isAdmin && (
//           <div className="flex gap-3">
//             <button onClick={()=>navigate(`/members/${member.id}`)} className="cursor-pointer px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
//               Manage
//             </button>
//             <button  onClick={() => onDelete?.(member.id)} className="cursor-pointer px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };





// export default MemberCard;



import type { Member } from "@/type/member";
import { useNavigate } from "react-router";
import { MdOutlineAdminPanelSettings, MdOutlinePersonOutline } from "react-icons/md";


type MemberCardProps = {
  member: Member;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
};

// const MemberCard = ({ member, isAdmin, onDelete }: MemberCardProps) => {
//   const navigate = useNavigate();


//   return (
//     <div className="group relative bg-base-100 rounded-2xl shadow-sm hover:shadow-md border border-base-200 w-full overflow-hidden transition-all duration-200 flex flex-col">

//       {/* Header */}
//         <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
//         <span
//            className={`absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold
//             ${
//               member.status === "active"
//                 ? "bg-success/20 text-success"
//                 : "bg-base-300 text-base-content/60"
//             }`}
//         >
//           {member.status}
//         </span>

//         {/* Avatar */}
//         {/* <div className="absolute -bottom-8 left-5">
//           <div className="relative">
//             <img
//               src={(member.imageUrl || member.imgUrl)?.trim() ? (member.imageUrl || member.imgUrl) : "/user1.png"}
//               className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white object-cover bg-white"
//             />

//             <span
//               className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white
//               ${
//                 member.status === "active"
//                   ? "bg-green-500"
//                   : "bg-gray-400"
//               }`}
//             />
//           </div>
//         </div> */}
//       </div>

//       {/* Body */}
//        {/* Body Content */}
//       <div className="px-5 pb-6 flex flex-col items-center flex-1">
//         {/* Avatar */}
//         <div className="relative -mt-12 mb-3">
//           <img
//             src={(member.imageUrl || member.imgUrl)?.trim() ? (member.imageUrl || member.imgUrl) : "/user1.png"}
//             alt={member.name}
//             className="w-24 h-24 rounded-full border-4 border-base-100 object-cover bg-base-200 shadow-sm"
//           />
//           <span
//             className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-base-100
//               ${
//                 member.status === "active"
//                   ? "bg-success"
//                   : "bg-base-content/40"
//               }`}
//           />
//         </div>

//         {/* Info */}
//         <h2 className="text-lg font-bold truncate w-full text-center text-base-content">
//            {member.name}
//           </h2>

//            <p className="text-sm text-base-content/60 truncate w-full text-center mb-3">
//           {member.email}
//         </p>

//         <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-base-200 text-base-content/70 capitalize mt-auto">
//           {member.role === 'admin' ? (
//             <MdOutlineAdminPanelSettings className="text-error" size={16} />
//           ) : (
//             <MdOutlinePersonOutline className="text-primary" size={16} />
//           )}
//           <span className={member.role === 'admin' ? 'text-error' : 'text-primary'}>
//             {member.role}
//           </span>
//         </div>

//         {/* Actions */}
//         {isAdmin && (
//             <div className="flex gap-2 w-full mt-6">
//             <button
//               onClick={() => navigate(`/members/${member._id}`)}
//                            className="flex-1 py-2 text-sm font-semibold bg-primary text-primary-content rounded-xl hover:bg-primary/90 transition-colors"
            
//             >
//               Manage
//             </button>

//             <button
//               onClick={() => onDelete?.(member._id)}
//               className="flex-1 py-2 text-sm font-semibold bg-error/10 text-error rounded-xl hover:bg-error hover:text-error-content transition-colors"
           
//             >
//               Delete
//             </button>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const MemberCard = ({ member, isAdmin, onDelete }: MemberCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-base-100 rounded-xl shadow-sm hover:shadow-md border border-base-200 w-full overflow-hidden transition-all duration-200 flex flex-col">

      {/* Header */}
      <div className="h-16 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
        <span
          className={`absolute top-2 right-2 text-[9px] uppercase px-2 py-0.5 rounded-full font-semibold
            ${
              member.status === "active"
                ? "bg-success/20 text-success"
                : "bg-base-300 text-base-content/60"
            }`}
        >
          {member.status}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 flex flex-col items-center flex-1">

        {/* Avatar */}
        <div className="relative -mt-8 mb-2">
          <img
            src={(member.imageUrl || member.imgUrl)?.trim() ? (member.imageUrl || member.imgUrl) : "/user1.png"}
            alt={member.name}
            className="w-16 h-16 rounded-full border-2 border-base-100 object-cover bg-base-200 shadow-sm"
          />
          <span
            className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border border-base-100
              ${
                member.status === "active"
                  ? "bg-success"
                  : "bg-base-content/40"
              }`}
          />
        </div>

        {/* Info */}
        <h2 className="text-base-content text-md font-semibold truncate w-full text-center">
          {member.name}
        </h2>

        <p className="text-sm text-base-content/60 truncate w-full text-center mb-2">
          {member.email}
        </p>

        {/* Role */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-base-200 text-base-content/70 capitalize">
          {member.role === 'admin' ? (
            <MdOutlineAdminPanelSettings className="text-error" size={14} />
          ) : (
            <MdOutlinePersonOutline className="text-primary" size={14} />
          )}
          <span className={member.role === 'admin' ? 'text-error' : 'text-primary'}>
            {member.role}
          </span>
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="flex gap-2 w-full mt-3">
            <button
              onClick={() => navigate(`/members/${member._id}`)}
              className="flex-1 py-1.5 text-xs font-medium bg-primary text-primary-content rounded-lg hover:bg-primary/90"
            >
              Manage
            </button>

            <button
              onClick={() => onDelete?.(member._id)}
              className="flex-1 py-1.5 text-xs font-medium bg-error/10 text-error rounded-lg hover:bg-error hover:text-error-content"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MemberCard;