

import MemberRightSection from '@/components/members/MemberRightSection';
import ProfileSidebar from '@/components/members/ProfileSidebar';

import { useParams } from 'react-router-dom';

const MemberDetails = () => {
  const { id } = useParams();

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      {/* Sidebar */}
      <ProfileSidebar
        member={{
          id: id || '1',
          name:'John Watson',
          email: 'john.watson@example.com',
          role: 'admin',
          imgUrl: '',
          status: 'active',
          joinedAt: '2023-01-15',
          gender: 'male',
          phone: '1234567890',
        }}
       
      />

      {/* Right Section */}
      <div className='flex-1'>
        <MemberRightSection memberId={id || '1'} />
      </div>
    </div>
  );
}

export default MemberDetails;
