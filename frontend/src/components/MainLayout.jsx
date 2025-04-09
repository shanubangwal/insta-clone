import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'

export default function MainLayout() {
  return (
    <>
    <LeftSideBar/>
    <Outlet/>
    </>
  )
}
