import React from 'react'
import { ProfileContext } from '../../../context/ProfileContext';

const Settings = () => {
    const { profile } = React.useContext(ProfileContext);
  return (
    <div className='w-full    text-black  flex flex-col min-h-screen '>
       <p className='text-lg font-medium mb-4'> Profile</p>
       {profile.user && (
       <div className='w-full  flex flex-col  gap-4'>

        <div className='w-full flex  gap-4'>
        <h1 className='w-28'>First Name</h1>
        <h1>{profile.user.first_name}</h1>
        

        </div>
        <div className='w-full flex  gap-4'>
        <h1 className='w-28'>Last Name</h1>
        <h1>{profile.user.last_name}</h1>
        

        </div>
        <div className='w-full flex  gap-4'>
        <h1 className='w-28'>Email</h1>
        <h1>{profile.user.email}</h1>
        

        </div>
      

    


       </div>
         )}
        
        
        </div>
        
  )
};

export default Settings;