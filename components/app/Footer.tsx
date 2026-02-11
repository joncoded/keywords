'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Footer() {  

  return (
    <footer className=" bg-black dark:bg-gray-900/80 backdrop-blur-md border-t   border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between py-10">
          <div>
            <p>
              <Link 
                href="/" 
                className="text-2xl text-white hover:text-red-600 dark:hover:text-red-400 font-bold transition-colors"
              >
                Keywords            
              </Link>
            </p>
            <p className="text-md text-white">
              Understand phrases, analyze writing, and learn more about interesting words!
            </p>
            
          </div>
          <div>
            <p className="text-md text-white">a <a href="https://joncoded.com" className="text-green-600 hover:text-white hover:underline font-bold" target="_blank" rel="noopener noreferrer">joncoded.com</a> and <a href="https://console.groq.com/docs/model/llama-3.3-70b-versatile" className="hover:underline" target="_blank" rel="noopener noreferrer"><span className="text-orange-600 font-bold">groq</span>/<span className="text-blue-600 font-bold">llama</span></a> project</p>
          </div>
        </div>
        
      </nav>
    </footer>
  )
}
