import Navbar from 'components/Header/Navbar';
import React from 'react'
import Header from "../../components/Header/header";
import MyProvider from '../../components/Header/MyProvider';


export default function LayoutHeaderFooter ({children}: {
  children: React.ReactNode
}) {

  return (
    <MyProvider>
        <Header />
        <Navbar/>
          {children}
    </MyProvider>
  )
}