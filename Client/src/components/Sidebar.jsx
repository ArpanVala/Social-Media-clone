import { Link } from "react-router-dom"
import { assets } from "../assets/assets"
import MenuItems from "./MenuItems"
import { CirclePlus, LogOut, SunIcon, MoonIcon } from "lucide-react"
import {UserButton, useClerk} from '@clerk/clerk-react'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user =  useSelector((state) => state.user.value);
  const [isDark, setIsDark] = useState(false);

  const {signOut} = useClerk();

  // Load saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`w-65 xl:w-70 bg-sidebar-bg border-r border-mute flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20
    ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out
    `}>
     <div className="w-full">
        <header >
          <Link to="/" className="py-3 px-4 w-fit flex items-center gap-3 cursor-pointer">
                <img src={assets.logo} alt="atom logo" width={24} height={24} />
                <h1 className="text-xl font-semibold">Atom.</h1>
            </Link>
            <hr className="border-mute" />
        </header> 
       
        <MenuItems />
        
        <div>
            <Link to="/create-post" className="flex items-center justify-center gap-2 my-2 mx-4 p-2 rounded-lg bg-gradient-to-r from-accent to-gradient-end hover:from-gradient-start-hover hover:to-gradient-end-hover hover:shadow-lg text-plain hover:scale-98 cursor-pointer transition">
                <CirclePlus className="w=5 h-5"/> Create Post 
            </Link>
        </div>
     </div>

     <div className="w-full border-t border-mute p-4 px-7 flex items-center justify-between">
          <div className="flex gap-2 items-center cursor-pointer">
            <UserButton/>
            <div>
              <h1 className="text-sm">{user.full_name}</h1>
              <p className="text-xs text-mute-2 ">@{user.username}</p>
            </div>
          </div>

          <LogOut onClick={signOut} className="w-5 h-5 text-mute-2 cursor-pointer hover:mute-3 transition"
           />

          <button onClick={()=>
          {
            setIsDark(!isDark)
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            document.documentElement.classList.toggle('dark')}}
          >

          {isDark ? 
          <SunIcon className="w-5 h-5 text-mute-2 cursor-pointer hover:mute-3 transition"/>
          :
          <MoonIcon className="w-5 h-5 text-mute-2 cursor-pointer hover:mute-3 transition"/>  
          
          }
            
          </button>

          
      


     </div>


    </div>
  )
}

export default Sidebar
