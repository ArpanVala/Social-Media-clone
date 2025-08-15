import { Link } from "react-router-dom"
import { assets, dummyUserData } from "../assets/assets"
import MenuItems from "./MenuItems"
import { CirclePlus, LogOut } from "lucide-react"
import {UserButton, useClerk} from '@clerk/clerk-react'


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = dummyUserData;
  const {signOut} = useClerk();
  return (
    <div className={`w-60 xl:w-70 bg-gray-50 border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20
    ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out
    `}>
     <div className="w-full">
        <header >
          <Link to="/" className="py-3 px-4 w-fit flex items-center gap-3 cursor-pointer">
                <img src={assets.logo} alt="atom logo" width={24} height={24} />
                <h1 className="text-xl font-semibold">Atom.</h1>
            </Link>
            <hr className="border-gray-200" />
        </header> 
       
        <MenuItems />
        
        <div>
            <Link to="/create-post" className="flex items-center justify-center gap-2 my-2 mx-4 p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg text-white hover:scale-98 cursor-pointer transition">
                <CirclePlus className="w=5 h-5"/> Create Post 
            </Link>
        </div>
     </div>

     <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
          <div className="flex gap-2 items-center cursor-pointer">
            <UserButton/>
            <div>
              <h1 className="text-sm">{user.full_name}</h1>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>

          <LogOut onClick={signOut} className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition"
           />
      


     </div>


    </div>
  )
}

export default Sidebar
