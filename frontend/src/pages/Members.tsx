

import { useEffect, useState } from "react";
import MemberCard from "@/components/members/MemberCard";
import type { Member } from "@/type/member";
import { getMembers, deleteMember } from "@/services/memberService";

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

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      let organizationId = "";
      const userData = sessionStorage.getItem("user");
      organizationId = userData ? JSON.parse(userData).organization : "";

      await deleteMember(organizationId, id);
      
      setMembers(prev => prev.filter(member => member._id !== id && member.id !== id));
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Failed to delete member");
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        let organizationId = "";
        const userData =  sessionStorage.getItem("user")  ;
         organizationId = userData ? JSON.parse(userData).organization : "";
         const members = await getMembers(organizationId);
         console.log(members.data?.members,"members");
       

        //   backend call
       
       
        setMembers(members.data?.members);

      } catch (err) {
        console.log(err)
        console.error("Error fetching members:", err);
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
        <MemberCard key={member._id} member={member} isAdmin={true} onDelete={handleDelete} />
      ))}
    </div>
  );
}
