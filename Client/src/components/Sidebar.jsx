import { assets } from "../assets/assets"
import MenuItems from "./MenuItems"

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="w-60 xl:w-70 bg-white border-r border-gray-200 h-full p-4">
     <div className="flex flex-col justify-between items-center">
        <div className="w-full flex items-center gap-3 border-b border-gray-200">
            <img src={assets.logo} alt="atom logo" width={40} height={40} />
            <h1 className="text-xl font-semibold">Atom.</h1>
        </div>

        <MenuItems/>

     </div>
    </div>
  )
}

export default Sidebar
