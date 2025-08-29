import React from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyConnectionsData } from '../assets/assets'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../assets/assets'
import { UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react'

const Connections = () => {
  const [currentTab, setCurrentTab] = React.useState('Followers');
  const navigate = useNavigate();

  const dataArray = [
     {label: 'Followers', value: followers, icon: Users},
     {label: 'Following', value: following, icon: UserCheck},
     {label: 'Pending', value: pendingConnections, icon: UserRoundPen},
     {label: 'Connections', value: connections, icon: UserPlus},
  ]

  return (
    <div className='max-h-screen'>
      <div className='max-w-6xl mx-auto p-6'>
          {/* title  */}
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-slate-800 '>Connections</h1>
          <h6 className='text-lg text-slate-600'>Manage your network and discover new connections</h6>
        </div>

        {/* followers, following etc counts  */}
          <div className='flex mb-8 gap-6 flex-wrap'>
           {
            dataArray.map((item, index) => (
              <div className='flex flex-col items-center justify-center gap-1  border-2  border-gray-200 h-20 w-40 bg-white shadow rounded' key={index}>
                <p>{item.value.length}</p>
                <p className='text-slate-500'>{item.label}</p>
              </div>
            ))
           }
          </div> 


          {/* Tabs  */}
          <div className='inline-flex flex-wrap gap-3  items-center border border-gray-200 rounded p-1 bg-white shadow'>
          {
            dataArray.map((tab, idx) => (
              <button
                key={tab.label}
                className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded  transition-colors ${currentTab === tab.label ? 'bg-white font-medium text-black border-2 border-slate-300' : 'text-gray-500  hover:text-black hover:bg-gray-200'}`}
                onClick={() => setCurrentTab(tab.label)}
              >
                <tab.icon size={14}/>
                <span className='ml-1'>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                    {tab.count}
                  </span>)}
              </button>
            ))
          }
          </div>

          </div>
      </div>

  )
}

export default Connections
