import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import About from './About';
import { useNavigate } from 'react-router-dom';

// Main component
const LandingPage: FC = () => {
  const navigate = useNavigate();
  return (

    <div className="min-h-screen bg-white flex flex-col justify-between items-center">
      <header>
          <ul className='flex text-center font-semibold text-[20px] mt-16 text-gray-700'>
            <Link to='#'><li className='mr-12'>ʜᴏᴍᴇ</li></Link>
            <button onClick={()=> navigate('/About')}><li className='mr-12'>ᴀʙᴏᴜᴛ ᴜꜱ</li></button> 
            <button onClick={()=> navigate('/FAQ')}><li>ꜰᴀQ</li></button> 
           
          </ul>
      </header>
      <div className="text-center mt-10">
        <h1 className="text-6xl font-bold mb-3">ㄒ卂ㄥҜ ㄒㄖ <br /> </h1> 
        <span className="text-6xl font-bold text-green-500">丂ㄒ尺卂几Ꮆ乇尺丂</span>
        <p className="mt-4 text-xl font-semibold text-gray-600">Use Varta to get paired randomly with another person <br /> <span className='text-black'>online</span> to talk <span className='text-black'>one-on-one.</span></p>
      </div>

      {/* Main button section */}
      <section className="flex gap-4 mt-8">
        <button className="px-6 py-3 bg-black text-white rounded-md font-bold"  onClick={() => navigate('/chat')}>Text</button>
          <button className="px-6 py-3 bg-black text-white rounded-md font-bold"  onClick={() => navigate('/chat')}>
          Video</button>
      </section>

      {/* Information section */}
      <section className="flex flex-wrap justify-center gap-10 mt-12 text-center text-gray-600">
        <div className='bg-gray-100 flex w-[200px] h-[55px]'>
          <img className='w-[50px]' src="user-male-circle.png " alt="" />
          <p className='font-bold text-black text-left mr-2 ml-2 text-md'>Chat anonymously</p>
        </div>
        <div className='bg-gray-100 flex w-[200px] h-[55px]'>
          <img className='w-[50px]' src="i.png " alt="" />
          <p className='font-bold text-black text-left mr-2 ml-2 text-md'>Must be <br />18+</p>
        </div>
        <div className='bg-gray-100 flex w-[200px] h-[55px]'>
          <img className='w-[50px]' src="web.png " alt="" />
          <p className='font-bold text-black text-left mr-2 ml-2 text-md'>30,000+ online now</p>
        </div>
        <div className='bg-gray-100 flex w-[200px] h-[55px]'>
          <img className='w-[50px]' src="video.png " alt="" />
          <p className='font-bold text-black text-left mr-2 ml-2 text-md'>Videos are monitored.</p>
        </div>
        
      </section>

      {/* Footer section */}
      <footer className="w-full py-6 border-t mt-10 text-center text-sm text-gray-500">
        <p>© Varta.com LLC • <a href="#" className="underline">Terms of Service</a> • <a href="#" className="underline">Privacy Policy</a> • <a href="#" className="underline">Community Guidelines</a></p>
      </footer>
    </div>
  );
};

export default LandingPage;




