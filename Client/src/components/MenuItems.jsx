import { NavLink } from "react-router-dom"
import { menuItemsData } from "../assets/assets"

const MenuItems = () => {
    const menuItems = menuItemsData
  return (
    <div className=" flex flex-col">
     {
        menuItems.map(({to, label, Icon})=>{
            <NavLink index={to} to={to} className="py-2 px-4 hover:bg-gray-100">
                {Icon && <Icon className="inline-block mr-2" />}
                {label}
                hi
            </NavLink>
        })
     }
    </div>
  )
}

export default MenuItems
