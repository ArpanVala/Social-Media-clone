import React from 'react'
import { assets } from '../assets/assets'

const Loading = ({ height = '100vh' }) => {
  return (
    <>
        <div className='flex justify-center items-center w-full' style={{ height }}>
            <div className='w-20 h-20 border-5  rounded-full animate-spin border-indigo-500 border-t-transparent '>
           

            </div>


        </div>
    </>
  )
}

export default Loading
