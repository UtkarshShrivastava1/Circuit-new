

import { useEffect, useState } from "react";
import MemberCard from "@/components/members/MemberCard";
import type { Member } from "@/type/member";
import { getMembers, deleteMember } from "@/services/memberService";
// import { getOrganizationSlug } from "@/utils/auth";
import { useAuth } from "@/auth/AuthContext";
import Breadcrumbs from "@/components/ui/Breadcrumbs";


// export const dummyMembers: Member[] = [
//   {
//     id: "1",
//     name: "John Watson",
//     email: "john@gmail.com",
//     role: "employee",
//     imgUrl: " ",
//     status: "active",
//     gender:"male",
//     phone:"123456789",
//     address:"maitri nagar,risali"
//   },
//   {
//     id: "2",
//     name: "Jane Doe",
//     email: "jane@gmail.com",
//     role: "admin",
//     imgUrl: "/user1.png",
//     status: "active",
//     gender:"female"
//   },
//   {
//     id: "3",
//     name: "Mike Ross",
//     email: "mike@gmail.com",
//     role: "employee",
//     imgUrl: "/user1.png",
//     status: "inactive",
//     gender:"male"
//   },
// ];

export default function Members() {
  const {auth} = useAuth();
   const slug = auth.slug;
   
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
     

      await deleteMember(slug, id);
      
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
        const members = await getMembers(slug);
        //   backend call
       
       
        setMembers(members.data?.members);

      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);


  

  if (loading) return<div className="flex flex-col justify-center items-center h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-medium text-base-content/70">Loading Member...</p>
      </div>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Breadcrumbs  />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {members.map((member) => (
          <MemberCard key={member._id} member={member} isAdmin={true} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
