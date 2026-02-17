import type { Member } from "@/type/member";
import { useNavigate } from "react-router";

type MemberCardProps = {
  member: Member;
  isAdmin?: boolean;
};




const MemberCard = ({ member, isAdmin }: MemberCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-white rounded-xl shadow-md border border-gray-100 w-full overflow-hidden">

      {/* Header */}
      <div className="relative h-20 bg-gradient-to-r from-sky-700 to-indigo-500">
        <span
          className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium
            ${
              member.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
        >
          {member.status}
        </span>

        {/* Avatar */}
        <div className="absolute -bottom-8 left-5">
          <div className="relative">
            <img
              src={member.imgUrl || "/avatar.png"}
              className="w-16 h-16 rounded-full border-4 border-white object-cover bg-white"
            />
            <span
              className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white
                ${
                  member.status === "active"
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center gap-6 pt-12 pb-5 px-5">
        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h2 className="text-base font-semibold truncate text-gray-900">
            {member.name}
          </h2>

          <p className="text-sm text-gray-500 truncate">
            {member.email}
          </p>

          <span
            className={`w-fit mt-2 px-3 py-1 text-xs rounded-full
              ${
                member.role === "admin"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {member.role}
          </span>
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="flex gap-3">
            <button onClick={()=>navigate(`/members/${member.id}`)} className="cursor-pointer px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
              Manage
            </button>
            <button className="cursor-pointer px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};





export default MemberCard;
