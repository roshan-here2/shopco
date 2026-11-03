import React from 'react'
import Announcement from '../../components/announcement/Announcement'
import Navbar from '../../components/navbar/Navbar'
import Hero from '../../components/herosection/Hero'
import NewArrivals from '../../components/newarrivals/NewArrivals'
import CartBtn from '../../components/cartbtn/CartBtn'
import DressStyle from '../../components/dressStyle/DressStyle'
import HappyCustomers from '../../components/customer/Customer'
import LastestOffer from '../../components/lastestoffer/LatestOffer'
import Footer from '../../components/footer/Footer'
import { useProducts } from '../../hooks/useProducts'

export default function Home() {
  const { products: newArrivals, loading: loadingNew } = useProducts('new-arrivals');
  const { products: topSelling, loading: loadingTop } = useProducts('top-selling');
  // Also show any products without those categories under new arrivals if empty
  const { products: allProducts } = useProducts();

  const newList = newArrivals.length
    ? newArrivals
    : allProducts.filter((p) => p.category === 'new-arrivals' || !['top-selling'].includes(p.category)).slice(0, 8);

  const topList = topSelling.length
    ? topSelling
    : allProducts.filter((p) => p.category === 'top-selling').slice(0, 8);

  return (
    <>
      <Announcement />
      <Navbar />
      <Hero />
      <NewArrivals
        title="NEW ARRIVALS"
        products={loadingNew && !newList.length ? [] : (newList.length ? newList : allProducts.slice(0, 4))}
      />
      <CartBtn />
      <NewArrivals
        title="TOP SELLING"
        products={loadingTop && !topList.length ? [] : (topList.length ? topList : allProducts.slice(4, 8))}
      />
      <DressStyle />
      <HappyCustomers />
      <LastestOffer />
      <Footer />
    </>
  )
}
