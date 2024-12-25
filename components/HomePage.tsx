import React from 'react'
import Link from 'next/link'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">UMP Pekan AR Navigation</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Find your way around Universiti Malaysia Pahang Pekan Campus using augmented reality. 
        Perfect for students on the go!
      </p>
      <ul className="text-lg mb-8 text-center">
        <li>✓ Easy navigation to key locations</li>
        <li>✓ Real-time AR guidance</li>
        <li>✓ Works while walking around campus</li>
      </ul>
      <Link href="/ar-navigation" passHref>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          Start AR Navigation
        </button>
      </Link>
    </div>
  )
}

export default HomePage

