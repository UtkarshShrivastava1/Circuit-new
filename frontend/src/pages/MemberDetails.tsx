

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileSidebar from "@/components/members/ProfileSidebar";
import MemberRightSection from "@/components/members/MemberRightSection";
import { dummyMembers } from "./Members";
import type { Member } from "@/type/member";

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const foundMember = dummyMembers.find((m) => m.id === id);
    if (foundMember) {
      setMember(foundMember);
    }
  }, [id]);

  if (!member) return <p>Member not found</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <ProfileSidebar member={member} />

      <div className="flex-1">
        <MemberRightSection memberId={member.id} />
      </div>
    </div>
  );
};

export default MemberDetails;
