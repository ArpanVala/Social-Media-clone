import { useState } from "react"
import Sidebar from "../components/Sidebar"
import {Outlet} from 'react-router-dom'
import { Menu, X } from "lucide-react"
import Loading from "../components/Loading"
import { dummyUserData } from "../assets/assets"
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user =  dummyUserData
  return (
    <>
    {
      user ? 
       <div className='w-full h-screen flex'>

    
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 bg-gray-100">
        <Outlet />
      </div>

   {sidebarOpen ? 
   <X onClick={() => setSidebarOpen(false)} 
   className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden" />
   :
   <Menu onClick={() => setSidebarOpen(true)} 
   className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden" />}
    </div>

    :
    <Loading />
    } 
    </>
  )
}

export default Layout
