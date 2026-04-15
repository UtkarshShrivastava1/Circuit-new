import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileSidebar from "@/components/members/ProfileSidebar";
import MemberRightSection from "@/components/members/MemberRightSection";
import type { Member } from "@/type/member";
import { getMemberById } from "@/services/memberService";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useAuth } from "@/auth/AuthContext";

const MemberDetails = () => {
  const { id } = useParams();
  const {auth} = useAuth();
  const slug = auth.slug;
  const [member, setMember] = useState<Member | null>(null);
 

  useEffect(() => {
    const fetchMember = async () => {
      
      try {
        const response = await getMemberById(slug, id);
        // Note: Depending on your API, the member data might be nested inside response.data
        const foundMember = response?.data?.member || response?.data || response;
        
        if (foundMember) {
          setMember(foundMember?.user || foundMember); // Adjust based on actual API response structure
        }
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMember();
  }, [id]);



  if (!member) return <p>Member not found</p>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Breadcrumbs />
      <div className="flex flex-col md:flex-row gap-6">
        <ProfileSidebar member={member} />
  
        <div className="flex-1">
          <MemberRightSection memberId={member._id} />
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
