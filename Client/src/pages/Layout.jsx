import { useState } from "react"
import Sidebar from "../components/Sidebar"
import {Outlet} from 'react-router-dom'
import { Menu, X } from "lucide-react"
import Loading from "../components/Loading"
import { useSelector } from "react-redux"
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user =  useSelector((state) => state.user.value);
  return (
    <>
    {
      user ? 
       <div className='w-full h-screen flex overflow-hidden'>

    
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 bg-background overflow-hidden">
        <Outlet />
      </div>

   {sidebarOpen ? 
   <X onClick={() => setSidebarOpen(false)} 
   className="absolute top-3 right-3 p-2 z-100 bg-plain rounded-md shadow w-10 h-10 text-text-secondary sm:hidden" />
   :
   <Menu onClick={() => setSidebarOpen(true)} 
   className="absolute top-3 right-3 p-2 z-100 bg-plain rounded-md shadow w-10 h-10 text-text-secondary sm:hidden" />}
    </div>

    :
    <Loading />
    } 
    </>
  )
}

export default Layout
