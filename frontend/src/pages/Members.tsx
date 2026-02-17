import MemberCard from "@/components/members/MemberCard";

import type { Member } from "@/type/member";

export const dummyMembers: Member[] = [
  {
    id: "1",
    name: "John Watson",
    email: "john@gmail.com",
    role: "employee",
    imgUrl: "user1.png",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@gmail.com",
    role: "admin",
    imgUrl: "user1.png",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Ross",
    email: "mike@gmail.com",
    role: "employee",
    imgUrl: "user1.png",
    status: "inactive",
  },
];


export default function Members() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
   {dummyMembers.map((member) => (
        <MemberCard key={member.id} member={member} isAdmin={true} />
      ))}
    </div>
  );
}
