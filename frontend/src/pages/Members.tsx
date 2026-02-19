

import { useEffect, useState } from "react";
import MemberCard from "@/components/members/MemberCard";
import type { Member } from "@/type/member";
export const dummyMembers: Member[] = [
  {
    id: "1",
    name: "John Watson",
    email: "john@gmail.com",
    role: "employee",
    imgUrl: " ",
    status: "active",
    gender:"male",
    phone:"123456789",
    address:"maitri nagar,risali"
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@gmail.com",
    role: "admin",
    imgUrl: "/user1.png",
    status: "active",
    gender:"female"
  },
  {
    id: "3",
    name: "Mike Ross",
    email: "mike@gmail.com",
    role: "employee",
    imgUrl: "/user1.png",
    status: "inactive",
    gender:"male"
  },
];
export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    setMembers(prev => prev.filter(member => member.id !== id));
  };
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        //   backend call
       
       
        setMembers(dummyMembers);

      } catch (err) {
        setError("Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} isAdmin={true} onDelete={handleDelete} />
      ))}
    </div>
  );
}
