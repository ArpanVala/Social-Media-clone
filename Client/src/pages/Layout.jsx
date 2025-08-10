import {  UserProfile,SignOutButton} from '@clerk/clerk-react'
import React from 'react'

const Layout = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-5 h-full p-10 bg-gray-50'>
      
      <UserProfile/>
      <SignOutButton/>
  
    </div>
  )
}

export default Layout
