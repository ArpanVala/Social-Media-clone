import { Calendar, Edit, MapPin, PenBox, PenIcon, Verified } from 'lucide-react'
import moment from 'moment'

const UserProfileinfo = ({ posts, user, profileId, setShowEdit }) => {
  return (
    <div className="relative py-4 px-6 md:px-8 bg-white rounded-b-2xl">
      <div className='flex flex-col md:flex-row items-start gap-6'>

        {/* profile_picture */}
        <div className="w-24 h-24 rounded-full  border-7 border-white absolute -top-14">
          {user.profile_picture && <img src={user.profile_picture} alt="Profile" className="absolute rounded-full z-2 object-center" />}
        </div>  

        {/* profile content  */}
        <div className='w-full pt-10 md:pt-0 md:pl-36'>
          <div className='flex flex-col md:flex-row items-start justify-between'>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                <Verified className='text-blue-500 w-5'/>
              </div>
              <p className=' text-gray-500'>@{user.username ? user.username : 'No Username'}</p>
            </div>

            {/* Display Edit button only if the profileId matches the logged in user id */}
            {
              !profileId &&  <button onClick={() => setShowEdit(true)} className='flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0 text-gray-700'><PenBox size={16}/>Edit</button>
            } 
          </div>

          <p className='text-gray-500  max-w-md mt-4 text-sm '>{user.bio ? user.bio : 'No Bio Available'}</p>


          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mt-4 text-gray-500'>
            <span  className='flex items-center gap-1.5'>
              <MapPin className='w-4 h-4'/>
              {user.location ? user.location : 'No Location'}
            </span>

             <span  className='flex items-center gap-1.5'>
              <Calendar className='w-4 h-4'/>
              Joined {moment(user.createdAt).fromNow()}
            </span>
          </div>

          <div className='flex items-center gap-6 mt-6 border-t  border-gray-200 pt-4'>
            <div >
              <span className='text-xl font-bold text-gray-900 '> {posts.length}</span>
              <span className='text-xs  sm:text-sm ml-1.5  text-gray-500 '>Posts</span>
            </div>

             <div >
              <span className='text-xl font-bold text-gray-900 '> {user.followers.length}</span>
              <span className='text-xs  sm:text-sm ml-1.5  text-gray-500 '>Followers</span>
            </div>

            <div >
              <span className='text-xl font-bold text-gray-900 '> {user.following.length}</span>
              <span className='text-xs  sm:text-sm ml-1.5  text-gray-500 '>Following</span>
            </div>


          </div>
 
        </div>

    
      </div>
    </div>
  )
}

export default UserProfileinfo
