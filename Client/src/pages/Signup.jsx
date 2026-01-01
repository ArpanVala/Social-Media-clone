import { SignUp} from '@clerk/clerk-react';
import { assets } from '../assets/assets';
import { Atom } from 'lucide-react';

const Signup = () => {
  return (
    <>
    <div className='p-5 md:p-7 max-w-[1248px] mx-auto'>
     <img src={assets.bgImage} alt="background image" className='absolute  object-cover w-full h-full -z-10 top-0 left-0' />

    {/* logo  */}
   <header >
      <div className='flex items-center gap-4'>
        <img src={assets.logo} alt="Logo" className='w-10 h-10' />
        <h1 className='font-bold text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-tl from-gradient-end to-bold'>Atom.</h1>
    </div>
   </header>
   
    {/* main  */}
    <main className='flex flex-col md:flex-row items-center justify-center gap-15 md:gap-5 mt-20 md:mt-10'>
      <section className='flex-1  space-y-3'>
        <h1 className='font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-title to-orange-800'>ATOM — Where Connections Spark.</h1>
        <p className='text-title font-medium text-xl md:text-2xl'>connect with global community on Atom.</p>
      </section>
      
      <section className=' flex-1 flex justify-center'>

        <SignUp signInUrl='/'/>
      </section>

    </main>
   

     
  </div>
     
     
    </>
  )
}

export default Signup
