'use client'

import NGOTable from '@/components/support-db/NGOTable'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

const Page = () => {
    const [searchTerm, setSearchTerm] = useState("");
    
  return (
    <div>
      <div className="flex flex-col md:flex-row items-baseline justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            NGO
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            All NGOs who have registed on the platform
          </p>
        </div>
        <div className="relative w-fit mt-7 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 w-[350px] bg-white"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>
      <div>
        <NGOTable searchTerm={searchTerm} />
      </div>
    </div>
  )
}

export default Page
