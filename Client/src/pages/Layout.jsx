import { useState } from "react"
import Sidebar from "../components/Sidebar"
import {Outlet} from 'react-router-dom'
import { Menu, X } from "lucide-react"
import Loading from "../components/Loading"
import { dummyUserData } from "../assets/assets"
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = dummyUserData
  return (
    <>
    {
      user ? 
       <div className='w-full h-screen flex'>

    
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1">
        <Outlet />
      </div>

   {sidebarOpen ? 
   <X onClick={() => setSidebarOpen(false)}/>
   :
   <Menu onClick={() => setSidebarOpen(true)}/>}
    </div>

    :
    <Loading />
    } 
    </>
  )
}

export default Layout
