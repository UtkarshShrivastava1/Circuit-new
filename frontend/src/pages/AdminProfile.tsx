import AdminRightSection from '@/components/admin/AdminRightSection';
import ProfileSidebar from '@/components/members/ProfileSidebar'
import { useParams } from 'react-router-dom';



const AdminProfile = () => {
  const {id}=useParams();
  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <ProfileSidebar  member={{
          id: id || '1',
          name:'John Watson',
          email: 'john.watson@example.com',
          role: 'admin',
          imgUrl: '',
          status: 'active',
          joinedAt: '2023-01-15',
          gender: 'male',
          phone: '1234567890',
          address:'104/5A Maitri Nagar Bhilai,CG'
        }}/>


        <AdminRightSection adminId={id || '1'}/>
    </div>
  )
}

export default AdminProfile