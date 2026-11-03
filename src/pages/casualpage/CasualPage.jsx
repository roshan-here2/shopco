import React from 'react'
import CasualPage from '../../components/categoryCarts/CategoryCarts'
import Announcement from '../../components/announcement/Announcement'
import Navbar from '../../components/navbar/Navbar'
import LastestOffer from '../../components/lastestoffer/LatestOffer'
import Footer from '../../components/footer/Footer'

export default function Casual() {
  return (
    <>
    <Announcement />
    <Navbar />
      <CasualPage />
      <LastestOffer />
      <Footer />
    </>
  )
}
