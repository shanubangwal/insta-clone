import React from 'react'
import Feed from './Feed'
import Rightsidebar from './Rightsidebar'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

export default function Home() {
  useGetAllPost();
  useGetSuggestedUsers();
  
  return (
    <>
    <div className="flex">
      <div className="flex-grow">
        <Feed/>
        <Outlet/>
      </div>
      <Rightsidebar/>
    </div>
    </>
  )
}
