/* 
keywords by @joncoded (aka @jonchius)
/components/home/Tabs.tsx
tabs for anywhere
*/

'use client'

import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className="w-full">

      {/* tab headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* tab content */}
      <div className="py-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`transition-opacity duration-300 ${
              activeTab === tab.id ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}
