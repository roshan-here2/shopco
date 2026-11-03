import React from 'react'
import Announcement from '../../components/announcement/Announcement'
import Navbar from '../../components/navbar/Navbar'
import LastestOffer from '../../components/lastestoffer/LatestOffer'
import Footer from '../../components/footer/Footer'
import ProductDetails from '../../components/productdetails/ProductDetails'
import NewArrivals from '../../components/newarrivals/NewArrivals'
import products from '../../components/carts/products'



export default function ProductDe() {
  return (
    <>
      <Announcement />
      <Navbar />
      <ProductDetails />
      <NewArrivals
            title=""
            products={products}
        />
      <LastestOffer />
      <Footer />
    </>
  )
}
