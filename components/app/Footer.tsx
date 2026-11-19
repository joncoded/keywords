'use client'

import Link from 'next/link'

export function Footer() {  

  return (
    <footer className=" bg-black dark:bg-gray-900/80 backdrop-blur-md border-t   border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">


        <p className="text-md text-white">made by <a href="https://joncoded.com" className="text-green-600 hover:text-white hover:underline font-bold" target="_blank" rel="noopener noreferrer">joncoded</a> (aka <a href="https://jonchius.com" className="text-gray-400 hover:text-white hover:underline font-bold" target="_blank" rel="noopener noreferrer">jonchius</a>) with <a href="https://console.groq.com/docs/model/openai/gpt-oss-120b" className="hover:underline" target="_blank" rel="noopener noreferrer"><span className="text-orange-600 font-bold">groq</span> / <span className="text-blue-600 font-bold">llama</span></a></p>
        
      </nav>
    </footer>
  )
}
