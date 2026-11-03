'use client'

import { useState } from 'react'
import {
  AdminScreen,
  CartScreen,
  CheckoutScreen,
  HomeScreen,
  LoginScreen,
  ManageMenuScreen,
  MenuScreen,
  OrdersScreen,
  ProductScreen,
  SignupScreen,
  TrackingScreen,
  WelcomeScreen,
} from '@/components/quickbite-screens'

export function QuickBiteShowcase() {
  const [cartCount, setCartCount] = useState(2)
  const addToCart = () => setCartCount((count) => count + 1)

  return (
    <main className="min-h-screen bg-[#130b07] px-3 py-3 sm:px-5 sm:py-4 lg:px-7">
      <section aria-label="QuickBite mobile app screens" className="mx-auto grid max-w-[1600px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        <WelcomeScreen />
        <LoginScreen />
        <SignupScreen />
        <HomeScreen cartCount={cartCount} onAdd={addToCart} />
        <MenuScreen cartCount={cartCount} onAdd={addToCart} />
        <ProductScreen onAdd={addToCart} />
        <CartScreen cartCount={cartCount} />
        <CheckoutScreen />
        <TrackingScreen />
        <OrdersScreen cartCount={cartCount} onAdd={addToCart} />
        <AdminScreen />
        <ManageMenuScreen />
      </section>
    </main>
  )
}
