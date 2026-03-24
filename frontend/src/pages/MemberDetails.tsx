import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileSidebar from "@/components/members/ProfileSidebar";
import MemberRightSection from "@/components/members/MemberRightSection";
import type { Member } from "@/type/member";
import { getMemberById } from "@/services/memberService";

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);
 

  useEffect(() => {
    const fetchMember = async () => {
      let organizationId = "";
      const userData = sessionStorage.getItem("user");
      organizationId = userData ? JSON.parse(userData).organization : "";
      
      try {
        const response = await getMemberById(organizationId, id);
        // Note: Depending on your API, the member data might be nested inside response.data
        console.log("API Response:", response);
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
    <div className="flex flex-col md:flex-row gap-6">
      <ProfileSidebar member={member} />

      <div className="flex-1">
        <MemberRightSection memberId={member._id} />
      </div>
    </div>
  );
};

export default MemberDetails;
