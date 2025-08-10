import { SignIn, SignUp} from '@clerk/clerk-react';

const Login = () => {
  return (
    <>
    <div className='flex  items-center justify-evenly h-screen bg-gray-100'>
     <SignIn/>
    
    </div>
     
     
    </>
  )
}

export default Login
