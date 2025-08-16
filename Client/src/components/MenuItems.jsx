import { NavLink } from "react-router-dom"
import { menuItemsData } from "../assets/assets"

const MenuItems = () => {
  return (
    <div className="px-4 mt-4 text-gray-600 space-y-1 font-medium">
     {
        menuItemsData.map(({to, label, Icon})=>(
            <NavLink key={to} to={to} end={to === '/'} 
            className={({ isActive }) => ` py-2 px-4 hover:bg-gray-100 flex items-center gap-3 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-200'}`}>
               <Icon className="inline-block mr-2 w-5 h-5" />
                {label}
            </NavLink>
        ))
     }
    </div>
  )
}

export default MenuItems
