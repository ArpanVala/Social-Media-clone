import { NavLink } from "react-router-dom"
import { menuItemsData } from "../assets/assets"

const MenuItems = () => {
  return (
    <div className="px-4 mt-4 text-text-secondary space-y-1 font-medium">
     {
        menuItemsData.map(({to, label, Icon})=>(
            <NavLink key={to} to={to} end={to === '/'} 
            className={({ isActive }) => ` py-2 px-4 hover:bg-background flex items-center gap-3 rounded-lg ${isActive ? 'bg-accent/10 text-gradient-start-hover/80' : 'hover:bg-muted'}`}>
               <Icon className="inline-block mr-2 w-5 h-5" />
                {label}
            </NavLink>
        ))
     }
    </div>
  )
}

export default MenuItems
