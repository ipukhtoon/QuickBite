'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Crown,
  Heart,
  Home,
  LockKeyhole,
  Mail,
  MapPin,
  Minus,
  MoreHorizontal,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  UserRound,
  Utensils,
  Wifi,
  X,
} from 'lucide-react'

export type QuickBiteScreenProps = {
  cartCount: number
  onAdd: () => void
}

const salesData = [
  { month: 'Jan', sales: 18 }, { month: 'Feb', sales: 28 }, { month: 'Mar', sales: 24 },
  { month: 'Apr', sales: 43 }, { month: 'May', sales: 35 }, { month: 'Jun', sales: 57 },
  { month: 'Jul', sales: 47 }, { month: 'Aug', sales: 66 }, { month: 'Sep', sales: 56 },
  { month: 'Oct', sales: 76 }, { month: 'Nov', sales: 67 }, { month: 'Dec', sales: 92 },
]

const salesChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
} satisfies ChartConfig

const products = [
  { name: 'Classic Burger', price: 450, image: '/images/classic-burger.png', category: 'Burgers' },
  { name: 'Cheese Burger', price: 550, image: '/images/cheese-burger.png', category: 'Burgers' },
  { name: 'Chicken Burger', price: 500, image: '/images/chicken-burger.png', category: 'Burgers' },
  { name: 'Beef Burger', price: 600, image: '/images/beef-burger.png', category: 'Burgers' },
  { name: 'Chicken Pizza', price: 700, image: '/images/pizza.png', category: 'Pizzas' },
  { name: 'French Fries', price: 180, image: '/images/fries.png', category: 'Sides' },
  { name: 'Iced Tea', price: 160, image: '/images/drinks.png', category: 'Drinks' },
]

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-frame relative aspect-[0.42] w-full rounded-[32px] bg-[linear-gradient(145deg,#bca37d,#30251d_18%,#090807_55%,#846a4e)] p-[3px] shadow-[0_8px_24px_rgba(0,0,0,.35)]">
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[29px] border border-white/[0.14] bg-[#100a07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]">
        <PhoneStatus />
        {children}
        <div className="pointer-events-none absolute bottom-[4px] left-1/2 h-[3px] w-[30%] -translate-x-1/2 rounded-full bg-white/35" />
      </div>
    </div>
  )
}

function PhoneStatus() {
  return (
    <div className="flex h-[23px] shrink-0 items-center justify-between px-[12px] text-[8px] font-semibold text-white/90">
      <span>9:41</span>
      <div className="flex items-center gap-[3px]">
        <span className="flex items-end gap-[1px]"><i className="h-[4px] w-[2px] rounded-sm bg-white/90" /><i className="h-[6px] w-[2px] rounded-sm bg-white/90" /><i className="h-[8px] w-[2px] rounded-sm bg-white/90" /></span>
        <Wifi size={9} strokeWidth={2.4} />
        <span className="relative h-[7px] w-[12px] rounded-[2px] border border-white/80"><span className="absolute inset-y-[1px] left-[1px] w-[7px] rounded-[1px] bg-white/90" /><span className="absolute -right-[3px] top-[2px] h-[3px] w-[2px] rounded-r-sm bg-white/80" /></span>
      </div>
    </div>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'flex-col gap-1'}`}>
      <span aria-hidden="true" className={`relative ${compact ? 'size-6' : 'size-8'}`}>
        <span className="absolute left-[18%] top-[6%] h-[27%] w-[64%] rounded-t-full border-x-2 border-t-2 border-[#ff8c1f]" />
        <span className="absolute left-[13%] top-[39%] h-[10%] w-[74%] rounded-full bg-[#ffd375]" />
        <span className="absolute left-[9%] top-[53%] h-[14%] w-[82%] rounded-full bg-[#ff8c1f]" />
        <span className="absolute left-[14%] top-[73%] h-[12%] w-[72%] rounded-full bg-[#ff8c1f]" />
      </span>
      <span className={`${compact ? 'text-[12px]' : 'text-[22px]'} font-bold tracking-[-0.05em] text-white`}>Quick<span className="text-[#ff991d]">Bite</span></span>
    </div>
  )
}

function FoodPhoto({ src = '/images/classic-burger.png', alt, className = '' }: { src?: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`object-cover ${className}`} />
}

function OrangeButton({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffac19] to-[#ff7513] px-4 py-2 text-[10px] font-semibold text-[#211005] shadow-[0_3px_12px_rgba(255,126,18,.15)] transition hover:brightness-110 ${className}`}>{children}</button>
}

function MiniNav({ active, cartCount = 0 }: { active: 'Home' | 'Menu' | 'Orders' | 'Account'; cartCount?: number }) {
  const items = [
    { label: 'Home' as const, icon: Home },
    { label: 'Menu' as const, icon: Utensils },
    { label: 'Orders' as const, icon: ShoppingBag },
    { label: 'Account' as const, icon: UserRound },
  ]
  return (
    <nav aria-label="QuickBite app navigation" className="mt-auto grid h-[37px] shrink-0 grid-cols-4 border-t border-white/[0.08] bg-[#100b08]/95 px-1 pb-1">
      {items.map(({ label, icon: Icon }) => <button key={label} aria-current={active === label ? 'page' : undefined} className={`relative flex flex-col items-center justify-center gap-[2px] text-[7px] ${active === label ? 'text-[#ff9b16]' : 'text-white/45'}`}><Icon size={13} strokeWidth={active === label ? 2.5 : 1.7} />{label}{label === 'Orders' && cartCount > 0 && <span className="absolute right-[11px] top-[3px] size-[5px] rounded-full bg-[#ff7d17]" />}</button>)}
    </nav>
  )
}

function TinyPlus({ onClick }: { onClick: () => void }) {
  return <button aria-label="Add item to cart" onClick={onClick} className="grid size-[19px] shrink-0 place-items-center rounded-md bg-[#ff7c19] text-[#211005] shadow-[0_2px_6px_rgba(255,124,25,.22)]"><Plus size={12} strokeWidth={2.8} /></button>
}

function ProductTile({ item, onAdd, compact = false }: { item: (typeof products)[number]; onAdd: () => void; compact?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[11px] border border-white/[0.1] bg-gradient-to-br from-[#21160e] to-[#110c09] ${compact ? '' : 'flex flex-col'}`}>
      <div className={`${compact ? 'h-[69px]' : 'h-[102px]'} overflow-hidden bg-[#1b1009]`}><FoodPhoto src={item.image} alt={item.name} className="h-full w-full" /></div>
      <div className="flex min-h-[43px] items-center justify-between gap-1 px-2 py-1.5">
        <div className="min-w-0"><p className="truncate text-[8px] font-semibold text-white">{item.name}</p><p className="mt-0.5 text-[8px] font-bold text-[#ffae35]">Rs. {item.price}</p></div>
        <TinyPlus onClick={onAdd} />
      </div>
    </div>
  )
}

export function WelcomeScreen() {
  return (
    <PhoneFrame>
      <div className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_33%,rgba(136,65,23,.3),transparent_56%),linear-gradient(180deg,#100a06,#201007_70%,#110a06)] px-4 pt-3 text-center">
        <div className="absolute inset-x-0 top-[17%] h-[47%] opacity-80"><FoodPhoto src="/images/welcome-burger.png" alt="Juicy cheeseburger with fresh ingredients" className="h-full w-full object-contain" /></div>
        <div className="relative z-[1] mt-2"><Brand /></div>
        <p className="relative z-[1] mt-1 text-[8px] text-white/75">Good Food. Good Mood.</p>
        <div className="relative z-[1] mt-auto w-full pb-4">
          <h1 className="mx-auto max-w-[180px] text-[17px] font-bold leading-[1.15] tracking-[-0.03em] text-white">Delicious Food,<br />Delivered Fresh</h1>
          <p className="mx-auto mt-2 max-w-[190px] text-[8px] leading-[1.5] text-white/70">Experience restaurant-quality meals from the comfort of your home.</p>
          <div className="mt-3 flex justify-center gap-1"><span className="size-1 rounded-full bg-[#ffa51d]" /><span className="size-1 rounded-full bg-white/30" /><span className="size-1 rounded-full bg-white/30" /></div>
          <OrangeButton className="mt-3 w-full">Get Started <ArrowRight size={11} /></OrangeButton>
          <button className="mt-2 w-full rounded-full border border-white/15 bg-white/[0.04] py-2 text-[9px] font-medium text-white">Sign In</button>
          <button className="mt-1.5 w-full rounded-full border border-white/10 bg-white/[0.025] py-2 text-[8px] text-white/85"><UserRound className="mr-1 inline" size={10} /> Continue as Guest</button>
        </div>
      </div>
    </PhoneFrame>
  )
}

function AuthInput({ icon, placeholder, trailing }: { icon: ReactNode; placeholder: string; trailing?: ReactNode }) {
  return <div className="flex h-[34px] items-center gap-2 rounded-[9px] border border-white/[0.12] bg-white/[0.045] px-2.5 text-white/70 shadow-inner shadow-black/20"><span className="shrink-0 text-white/85">{icon}</span><span className="min-w-0 flex-1 truncate text-[9px]">{placeholder}</span>{trailing}</div>
}

function SocialButton({ children }: { children: ReactNode }) {
  return <button className="flex h-[32px] w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] text-[8px] font-medium text-white/90">{children}</button>
}

export function LoginScreen() {
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_80%_35%,rgba(133,62,18,.24),transparent_48%),linear-gradient(180deg,#100a06,#180d07)] px-4 pt-4">
        <div className="mb-7 flex justify-center"><Brand /></div>
        <h1 className="text-[17px] font-bold tracking-[-0.03em]">Welcome Back!</h1><p className="mb-4 mt-1 text-[9px] text-white/70">Sign in to your account</p>
        <div className="flex flex-col gap-2"><AuthInput icon={<Mail size={13} />} placeholder="Email Address" /><AuthInput icon={<LockKeyhole size={13} />} placeholder="Password" trailing={<span className="text-[10px]">◉</span>} /></div>
        <div className="mt-2 flex items-center justify-between text-[7px]"><span className="flex items-center gap-1.5"><span className="grid size-3 place-items-center rounded-[2px] border border-[#ff9324] bg-[#ff9324] text-[#241306]"><Check size={9} /></span>Remember Me</span><button className="text-white/80">Forgot Password?</button></div>
        <OrangeButton className="mt-4 w-full">Sign In</OrangeButton>
        <div className="my-3 flex items-center gap-2 text-[8px] text-white/50"><span className="h-px flex-1 bg-white/10" />or<span className="h-px flex-1 bg-white/10" /></div>
        <div className="flex flex-col gap-1.5"><SocialButton><span className="font-bold text-[#42a5f5]">G</span>Continue with Google</SocialButton><SocialButton><span className="text-[12px]">●</span>Continue with Apple</SocialButton></div>
        <p className="mt-auto pb-5 text-center text-[8px] text-white/70">Don&apos;t have an account? <button className="text-[#ff9a1c]">Sign Up</button></p>
      </div>
    </PhoneFrame>
  )
}

export function SignupScreen() {
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_82%_36%,rgba(133,62,18,.26),transparent_50%),linear-gradient(180deg,#100a06,#180d07)] px-4 pt-4">
        <div className="mb-7 flex justify-center"><Brand /></div>
        <h1 className="text-[17px] font-bold tracking-[-0.03em]">Create Account</h1><p className="mb-4 mt-1 text-[9px] text-white/70">Join QuickBite today</p>
        <div className="flex flex-col gap-2"><AuthInput icon={<UserRound size={13} />} placeholder="Full Name" /><AuthInput icon={<Mail size={13} />} placeholder="Email Address" /><AuthInput icon={<Phone size={13} />} placeholder="Phone Number" /><AuthInput icon={<LockKeyhole size={13} />} placeholder="Password" trailing={<span className="text-[10px]">◉</span>} /></div>
        <OrangeButton className="mt-3 w-full">Create Account</OrangeButton>
        <div className="my-3 flex items-center gap-2 text-[8px] text-white/50"><span className="h-px flex-1 bg-white/10" />or<span className="h-px flex-1 bg-white/10" /></div>
        <div className="flex flex-col gap-1.5"><SocialButton><span className="font-bold text-[#42a5f5]">G</span>Continue with Google</SocialButton><SocialButton><span className="text-[12px]">●</span>Continue with Apple</SocialButton></div>
        <p className="mt-auto pb-5 text-center text-[8px] text-white/70">Already have an account? <button className="text-[#ff9a1c]">Sign In</button></p>
      </div>
    </PhoneFrame>
  )
}

function AppTopbar({ onCart, cartCount }: { onCart?: () => void; cartCount: number }) {
  return <div className="flex h-[35px] shrink-0 items-center justify-between px-3"><button aria-label="Open menu" className="text-white"><MoreHorizontal size={17} /></button><Brand compact /><button aria-label={`Cart, ${cartCount} items`} onClick={onCart} className="relative text-white"><ShoppingCart size={15} />{cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid size-[11px] place-items-center rounded-full bg-[#f24327] text-[6px] font-bold text-white">{cartCount}</span>}</button></div>
}

function SearchBar() {
  return <div className="mx-2.5 mt-2 flex h-[30px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 text-white/60"><Search size={12} /><span className="text-[8px]">Search delicious food...</span></div>
}

function CategoryRow() {
  const categories = [
    { name: 'Burgers', image: '/images/classic-burger.png' },
    { name: 'Pizza', image: '/images/pizza.png' },
    { name: 'Drinks', image: '/images/drinks.png' },
    { name: 'Sides', image: '/images/fries.png' },
  ]
  return <div className="mt-2.5 grid grid-cols-4 gap-1 px-2.5">{categories.map((item) => <button key={item.name} className="flex flex-col items-center gap-1"><span className="grid size-[37px] place-items-center overflow-hidden rounded-full border border-[#ff8421]/50 bg-[#281609] shadow-[0_2px_8px_rgba(255,118,22,.13)]"><FoodPhoto src={item.image} alt="" className="size-full" /></span><span className="text-[7px] text-white/85">{item.name}</span></button>)}</div>
}

export function HomeScreen({ onAdd, cartCount }: QuickBiteScreenProps) {
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_90%_18%,rgba(137,66,19,.25),transparent_35%),#100a06]">
        <AppTopbar cartCount={cartCount} />
        <div className="relative mx-2.5 mt-1 h-[108px] shrink-0 overflow-hidden rounded-[12px] border border-[#ff8a20]/40 bg-[linear-gradient(100deg,#240d06,#612707_72%,#301207)]">
          <div className="relative z-[1] p-3"><p className="text-[8px] font-semibold text-[#ffd332]">Special Offer</p><h2 className="mt-1 text-[16px] font-black leading-none">50% OFF</h2><p className="mt-1 text-[8px]">On All Burgers</p><OrangeButton className="mt-3 px-3 py-1.5 text-[8px]">Order Now <ArrowRight size={9} /></OrangeButton></div>
          <FoodPhoto alt="Double cheeseburger special offer" className="absolute -right-[10px] bottom-0 h-full w-[57%] object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,.6)]" />
        </div>
        <SearchBar /><CategoryRow />
        <div className="mt-3 flex items-center justify-between px-3"><h2 className="text-[11px] font-bold">Popular Items</h2><button className="flex items-center gap-1 text-[8px] text-[#ff9b18]">See All <ArrowRight size={9} /></button></div>
        <div className="mt-2 flex flex-col gap-1.5 px-2.5"><div className="flex h-[69px] items-center gap-2 overflow-hidden rounded-[11px] border border-white/10 bg-gradient-to-r from-[#29170c] to-[#15100c] p-1.5"><div className="size-[54px] shrink-0 overflow-hidden rounded-lg"><FoodPhoto alt="Classic cheeseburger" className="size-full" /></div><div className="min-w-0 flex-1"><p className="truncate text-[9px] font-semibold">Classic Burger</p><p className="mt-1 text-[10px] font-bold text-[#ffae35]">Rs. 450</p></div><TinyPlus onClick={onAdd} /></div><div className="relative h-[56px] overflow-hidden rounded-[10px] border border-[#ff8c24]/25 bg-[#30140a]"><FoodPhoto src="/images/pizza.png" alt="Pepperoni pizza" className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-85" /><div className="relative z-[1] p-2"><p className="text-[9px] font-bold">Pizza Lovers</p><p className="text-[8px]">Get 30% OFF</p></div></div></div>
        <MiniNav active="Home" cartCount={cartCount} />
      </div>
    </PhoneFrame>
  )
}

export function MenuScreen({ onAdd, cartCount }: QuickBiteScreenProps) {
  const [active, setActive] = useState('All')
  const filters = ['All', 'Burgers', 'Pizzas', 'Drinks']
  const shown = active === 'All' ? products.slice(0, 4) : products.filter((item) => item.category === (active === 'Pizzas' ? 'Pizzas' : active))
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_80%_10%,rgba(116,53,16,.2),transparent_38%),#100a06]">
        <div className="flex h-[38px] items-center justify-between px-3 text-white"><button aria-label="Back"><ArrowLeft size={15} /></button><span className="text-[8px] text-white/50">Menu</span><button aria-label="Search"><Search size={14} /></button></div>
        <div className="flex items-center justify-between px-3"><h2 className="text-[14px] font-bold">Our Menu</h2><button aria-label="Search menu" className="grid size-7 place-items-center rounded-full border border-white/10"><Search size={13} /></button></div>
        <div className="mt-3 flex gap-1.5 overflow-hidden px-3">{filters.map((item) => <button onClick={() => setActive(item)} key={item} className={`shrink-0 rounded-full px-2.5 py-1.5 text-[7px] ${active === item ? 'bg-gradient-to-r from-[#ff9d23] to-[#ff6f16] font-bold text-[#241206]' : 'border border-white/[0.09] bg-white/[0.04] text-white/80'}`}>{item}</button>)}</div>
        <div className="mt-3 grid grid-cols-2 gap-2 overflow-auto px-2.5 pb-2">{(shown.length ? shown : products.slice(0, 2)).map((item) => <ProductTile key={item.name} item={item} onAdd={onAdd} />)}</div>
        <MiniNav active="Menu" cartCount={cartCount} />
      </div>
    </PhoneFrame>
  )
}

export function ProductScreen({ onAdd }: Pick<QuickBiteScreenProps, 'onAdd'>) {
  const [quantity, setQuantity] = useState(1)
  const [extraCheese, setExtraCheese] = useState(false)
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-[radial-gradient(ellipse_at_50%_40%,rgba(122,57,20,.25),transparent_60%),#100a06]">
        <div className="absolute right-3 top-9 z-[2] flex gap-3"><button aria-label="Back"><ArrowLeft size={16} /></button><button aria-label="Add to favorites"><Heart size={15} /></button></div>
        <div className="relative h-[190px] shrink-0 overflow-hidden bg-[#190c06]"><FoodPhoto alt="Classic burger with melted cheese and fresh lettuce" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#100a06] via-transparent to-black/15" /></div>
        <div className="px-3 pb-3"><div className="flex items-center justify-between"><h1 className="text-[15px] font-bold">Classic Burger</h1><Heart size={13} /></div><div className="mt-1 flex items-center gap-1 text-[7px] text-white/75"><span className="flex text-[#ffaf24]"><Star size={9} fill="currentColor" /><Star size={9} fill="currentColor" /><Star size={9} fill="currentColor" /><Star size={9} fill="currentColor" /><Star size={9} fill="currentColor" /></span>4.8 (2.5k reviews)</div><p className="mt-3 text-[8px] leading-[1.5] text-white/70">A delicious classic burger with fresh lettuce, tomatoes and special sauce.</p>
          <div className="my-3 border-t border-white/10 pt-3"><h2 className="text-[9px] font-bold">Customize Your Order</h2><div className="mt-2.5 flex items-center justify-between text-[8px]"><span>Quantity</span><div className="flex items-center overflow-hidden rounded-lg border border-white/15 bg-white/[0.04]"><button aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid size-7 place-items-center"><Minus size={11} /></button><span className="w-5 text-center">{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className="grid size-7 place-items-center"><Plus size={11} /></button></div></div><button onClick={() => setExtraCheese((value) => !value)} className="mt-3 flex w-full items-center justify-between text-[8px]"><span>Add Extra Cheese</span><span className="flex items-center gap-2 text-white/70">+Rs. 50<span className={`grid size-3 place-items-center rounded border ${extraCheese ? 'border-[#ff8e22] bg-[#ff8e22] text-[#251306]' : 'border-white/30'}`}>{extraCheese && <Check size={9} />}</span></span></button></div>
          <div className="mt-auto flex items-center justify-between"><span className="text-[14px] font-bold text-[#ffad23]">Rs. {450 * quantity + (extraCheese ? 50 : 0)}</span><OrangeButton onClick={onAdd} className="px-4 py-2.5">Add to Cart <ArrowRight size={10} /></OrangeButton></div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function QuantityControl({ count, onChange }: { count: number; onChange: (count: number) => void }) {
  return <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-1.5 py-1"><button aria-label="Decrease item quantity" onClick={() => onChange(Math.max(1, count - 1))}><Minus size={10} /></button><span className="min-w-3 text-center text-[8px]">{count}</span><button aria-label="Increase item quantity" onClick={() => onChange(count + 1)}><Plus size={10} /></button></div>
}

export function CartScreen({ cartCount }: Pick<QuickBiteScreenProps, 'cartCount'>) {
  const [burgerCount, setBurgerCount] = useState(1)
  const [friesCount, setFriesCount] = useState(1)
  const subtotal = 450 * burgerCount + 180 * friesCount
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_90%_16%,rgba(117,54,18,.2),transparent_38%),#100a06]">
        <div className="flex items-center justify-between px-3 py-3"><h1 className="text-[14px] font-bold">Your Cart</h1><button aria-label="Remove all items" className="text-white/65"><X size={14} /></button></div>
        <div className="mx-2.5 border-t border-white/[0.07]" />
        <div className="flex flex-col gap-2.5 px-2.5 pt-2">
          {[{ item: products[0], count: burgerCount, change: setBurgerCount }, { item: products[5], count: friesCount, change: setFriesCount }].map(({ item, count, change }) => <div key={item.name} className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1.5"><div className="size-[50px] overflow-hidden rounded-lg"><FoodPhoto src={item.image} alt={item.name} className="size-full" /></div><div className="min-w-0 flex-1"><p className="truncate text-[9px] font-semibold">{item.name}</p><p className="mt-0.5 text-[9px] font-bold text-[#ffaf32]">Rs. {item.price}</p></div><QuantityControl count={count} onChange={change} /></div>)}
        </div>
        <div className="mt-auto px-3 pb-3 pt-4 text-[8px]"><div className="flex justify-between py-1"><span>Subtotal</span><span>Rs. {subtotal}</span></div><div className="flex justify-between py-1"><span>Delivery Fee</span><span>Rs. 50</span></div><div className="mt-1 flex justify-between border-t border-white/10 pt-2 text-[10px] font-bold text-[#ffbe54]"><span>Total</span><span>Rs. {subtotal + 50}</span></div><OrangeButton className="mt-3 w-full">Proceed to Checkout <ArrowRight size={10} /></OrangeButton></div>
        <MiniNav active="Orders" cartCount={cartCount} />
      </div>
    </PhoneFrame>
  )
}

export function CheckoutScreen() {
  const [delivery, setDelivery] = useState('Pickup')
  const [payment, setPayment] = useState('Cash on Delivery')
  const methods = ['Cash on Delivery', 'JazzCash / Easypaisa', 'Card Payment']
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-[radial-gradient(ellipse_at_70%_18%,rgba(117,54,18,.2),transparent_38%),#100a06] px-3 pb-4">
        <div className="flex h-[38px] shrink-0 items-center gap-3"><button aria-label="Back"><ArrowLeft size={15} /></button><h1 className="text-[13px] font-bold">Checkout</h1></div>
        <h2 className="mb-2 mt-2 text-[10px] font-bold">Delivery Method</h2><div className="grid grid-cols-2 gap-2">{['Pickup', 'Delivery'].map((method) => <button key={method} onClick={() => setDelivery(method)} className={`rounded-xl border p-2 text-left ${delivery === method ? 'border-[#ff8b20]/50 bg-[#ff8b20]/10' : 'border-white/10 bg-white/[0.03]'}`}><span className="flex items-center gap-1.5 text-[8px] font-semibold"><span className={`grid size-4 place-items-center rounded-full ${delivery === method ? 'bg-[#ff951e] text-[#251306]' : 'border border-white/30'}`}>{method === 'Pickup' ? <MapPin size={9} /> : <Truck size={9} />}</span>{method}</span><span className="ml-5 mt-1 block text-[7px] text-white/55">{method === 'Pickup' ? '(15-20 min)' : '(30-45 min)'}</span></button>)}</div>
        <h2 className="mb-2 mt-4 text-[10px] font-bold">Payment Method</h2><div className="flex flex-col gap-1">{methods.map((method) => <button key={method} onClick={() => setPayment(method)} className={`flex h-[31px] items-center gap-2 rounded-[8px] border px-2 text-[8px] ${payment === method ? 'border-[#ff9a25]/35 bg-[#ff9a25]/[0.08]' : 'border-white/[0.08] bg-white/[0.025]'}`}><span className={`grid size-4 place-items-center rounded-full ${payment === method ? 'bg-[#ff9c1e] text-[#281407]' : 'border border-white/25'}`}>{payment === method && <Check size={10} />}</span>{method}</button>)}</div>
        <label className="mb-1 mt-4 text-[8px] font-semibold" htmlFor="order-notes">Order Notes <span className="font-normal text-white/50">(Optional)</span></label><textarea id="order-notes" placeholder="Add special instructions..." className="h-[44px] resize-none rounded-lg border border-white/10 bg-white/[0.045] p-2 text-[8px] outline-none placeholder:text-white/45 focus:border-[#ff8d21]/50" />
        <OrangeButton className="mt-auto w-full">Place Order <ArrowRight size={10} /></OrangeButton>
      </div>
    </PhoneFrame>
  )
}

export function TrackingScreen() {
  const steps = [
    { title: 'Order Placed', time: '10:24 AM', done: true },
    { title: 'Preparing Your Food', time: '10:26 AM', done: true },
    { title: 'Out for Delivery', time: '10:32 AM', done: false },
  ]
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_80%_16%,rgba(117,54,18,.2),transparent_38%),#100a06]">
        <div className="flex h-[40px] items-center gap-3 px-3"><button aria-label="Back"><ArrowLeft size={15} /></button><h1 className="text-[12px] font-bold">Order Tracking</h1></div>
        <div className="relative mx-4 mt-1 flex flex-col gap-1 pb-2">{steps.map((step, index) => <div key={step.title} className="relative flex min-h-[40px] items-start gap-3">{index < steps.length - 1 && <span className="absolute left-[9px] top-[20px] h-[32px] w-px bg-gradient-to-b from-[#ff9924] to-[#57985a]" />}<span className={`z-[1] grid size-[19px] shrink-0 place-items-center rounded-full ${step.done ? 'bg-[#3b9850] text-white' : 'bg-[#ff9126] text-white'}`}>{step.done ? <Check size={12} /> : <Truck size={12} />}</span><div><p className={`text-[9px] font-semibold ${step.done ? 'text-white' : 'text-[#ffb13a]'}`}>{step.title}</p><p className="mt-0.5 text-[7px] text-white/65">{step.time}</p></div></div>)}</div>
        <div className="relative mx-2.5 h-[178px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#b8b4a5]">
          <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'linear-gradient(28deg, transparent 0 35%, #dad5c5 36% 43%, transparent 44%), linear-gradient(145deg, transparent 0 42%, #e5ddc9 43% 52%, transparent 53%), linear-gradient(90deg, transparent 0 24%, #ded7c5 25% 31%, transparent 32% 67%, #e2dac8 68% 72%, transparent 73%), repeating-linear-gradient(0deg, #c1d1bd 0 12px, #d8ddce 13px 24px)' }} />
          <div className="absolute left-[18%] top-[57%] size-2.5 rounded-full border-2 border-white bg-[#e78224] shadow-[0_1px_4px_rgba(0,0,0,.5)]" /><div className="absolute right-[20%] top-[30%] size-3 rounded-full border-2 border-white bg-[#e78224] shadow-[0_1px_4px_rgba(0,0,0,.5)]" /><span className="absolute left-[26%] top-[45%] h-[3px] w-[46%] rotate-[-29deg] rounded-full bg-[#2288cf] shadow-sm" /><span className="absolute right-[9%] top-[12%] rounded-full bg-white/75 p-1 text-[6px] text-[#435647]">River Rd</span>
        </div>
        <div className="mx-3 mt-auto mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-[#22160d] to-[#15100c] p-2"><div className="grid size-[48px] place-items-center rounded-lg bg-[#25170d] text-[#ff9023]"><Truck size={24} /></div><div><p className="text-[8px] text-white/75">Estimated Arrival</p><p className="mt-0.5 text-[13px] font-bold">10 min</p></div><button aria-label="Call your driver" className="ml-auto grid size-7 place-items-center rounded-full border border-white/10 text-white/65"><Phone size={13} /></button></div>
      </div>
    </PhoneFrame>
  )
}

export function OrdersScreen({ cartCount }: QuickBiteScreenProps) {
  const [filter, setFilter] = useState('All')
  const orders = [
    { id: '#QK-1005', date: 'Oct 22, 2025', price: 'Rs. 680', image: '/images/classic-burger.png' },
    { id: '#QK-1004', date: 'Oct 20, 2025', price: 'Rs. 520', image: '/images/classic-burger.png' },
    { id: '#QK-1003', date: 'Oct 18, 2025', price: 'Rs. 760', image: '/images/pizza.png' },
  ]
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_80%_12%,rgba(117,54,18,.2),transparent_38%),#100a06]">
        <div className="flex h-[41px] items-center gap-3 px-3"><button aria-label="Back"><ArrowLeft size={15} /></button><h1 className="text-[13px] font-bold">My Orders</h1></div>
        <div className="flex gap-1.5 px-3 pb-2">{['All', 'Completed', 'Cancelled'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-2.5 py-1.5 text-[7px] ${filter === item ? 'bg-gradient-to-r from-[#ff9d23] to-[#ff6f16] font-semibold text-[#251306]' : 'border border-white/[0.1] bg-white/[0.025] text-white/75'}`}>{item}</button>)}</div>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto px-2.5">{orders.map((order) => <div key={order.id} className="flex items-center gap-2 border-b border-white/[0.07] py-2"><div className="size-[52px] shrink-0 overflow-hidden rounded-lg border border-white/10"><FoodPhoto src={order.image} alt="Order food" className="size-full" /></div><div className="min-w-0 flex-1"><p className="text-[8px] font-bold">{order.id}</p><p className="mt-1 text-[8px] font-semibold text-[#ffba4e]">{order.price}</p><p className="mt-0.5 flex items-center gap-1 text-[7px] text-[#72d58e]"><span className="size-1.5 rounded-full bg-[#47c877]" />Delivered</p><p className="text-[6px] text-white/55">{order.date}</p></div><button aria-label={`View ${order.id}`}><ChevronRight size={12} className="text-white/40" /></button></div>)}</div>
        <MiniNav active="Orders" cartCount={cartCount} />
      </div>
    </PhoneFrame>
  )
}

export function AdminScreen() {
  const adminNavIcons = [Home, PackageCheck, ShoppingBag, UserRound, Crown, Utensils]

  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_75%_15%,rgba(117,54,18,.2),transparent_40%),#100a06]">
        <nav aria-label="Admin navigation" className="flex w-[31px] shrink-0 flex-col items-center gap-[15px] border-r border-white/[0.08] pt-4 text-white/40">
          {adminNavIcons.map((Icon, index) => <Icon key={index} size={13} className={index === 0 ? 'text-[#ff9b1d]' : ''} />)}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-[43px] shrink-0 items-center justify-between px-2"><div className="flex items-center gap-1.5"><Crown size={14} className="text-[#ffbe22]" /><h1 className="truncate text-[10px] font-bold">Admin Dashboard</h1></div><span className="grid size-5 shrink-0 place-items-center rounded-full border border-white/15 bg-[#554237] text-[7px]">A</span></div>
          <div className="grid grid-cols-2 gap-1.5 px-1.5 pt-2"><div className="rounded-[9px] border border-[#26313c] bg-gradient-to-br from-[#17202a] to-[#101317] p-1.5"><p className="text-[6px] text-[#c7e0e8]">Total Orders</p><p className="mt-1 text-[13px] font-bold">1,248</p></div><div className="rounded-[9px] border border-[#74400e]/55 bg-gradient-to-br from-[#301d0e] to-[#17120d] p-1.5"><p className="text-[6px] text-[#ffd28c]">Total Sales</p><p className="mt-1 text-[12px] font-bold">Rs. 621K</p></div></div>
          <div className="mx-1.5 mt-3 flex items-center justify-between"><h2 className="text-[8px] font-bold">Sales Overview</h2><button className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1 py-1 text-[6px]">This Month <ChevronDown size={7} /></button></div>
          <div className="mx-1.5 mt-2 h-[100px] shrink-0 overflow-hidden rounded-[9px] border border-white/[0.08] bg-[#111014] p-1">
            <ChartContainer config={salesChartConfig} className="h-full w-full" style={{ aspectRatio: 'auto', '--chart-1': '#bb76f5' } as CSSProperties}>
              <LineChart accessibilityLayer data={salesData} margin={{ top: 8, right: 4, left: 4, bottom: 2 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.11)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="month" hide />
                <YAxis domain={[0, 100]} hide />
                <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={false} activeDot={false} />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="mt-3 flex items-center justify-between px-1.5"><h2 className="text-[8px] font-bold">Recent Orders</h2><button className="text-[6px] text-[#ff9b1d]">View All <ArrowRight size={7} className="inline" /></button></div>
          <div className="mx-1.5 mt-2 flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] p-1"><div className="size-8 shrink-0 overflow-hidden rounded-md"><FoodPhoto alt="Burger order" className="size-full" /></div><div className="min-w-0 flex-1"><p className="text-[6px] font-bold">#QK-1005</p><p className="text-[6px] text-[#ffb544]">Rs. 680</p><p className="text-[5px] text-white/55">10:24 AM</p></div><span className="rounded bg-[#f77726] px-1 py-1 text-[5px] font-semibold text-[#241206]">New</span></div>
        </div>
      </div>
    </PhoneFrame>
  )
}

export function ManageMenuScreen() {
  const [tab, setTab] = useState('Items')
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ 'Classic Burger': true, 'Cheese Burger': true, 'Chicken Pizza': true, 'French Fries': true })
  const items = [products[0], products[1], products[4], products[5]]
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_80%_10%,rgba(117,54,18,.2),transparent_38%),#100a06]">
        <div className="flex h-[42px] items-center gap-3 px-3"><button aria-label="Back"><ArrowLeft size={15} /></button><h1 className="text-[13px] font-bold">Manage Menu</h1></div>
        <div className="mx-3 flex rounded-full border border-white/[0.08] bg-white/[0.035] p-0.5">{['Items', 'Categories'].map((item) => <button key={item} onClick={() => setTab(item)} className={`flex-1 rounded-full py-1.5 text-[7px] ${tab === item ? 'border border-[#ff9a1a] bg-[#401f09] text-[#ffae36]' : 'text-white/70'}`}>{item}</button>)}</div>
        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-1.5 overflow-auto px-2.5">{items.map((item) => <div key={item.name} className="flex h-[51px] shrink-0 items-center gap-2 rounded-[10px] border border-white/[0.09] bg-gradient-to-r from-[#21160d] to-[#15100b] px-1.5"><div className="size-[39px] overflow-hidden rounded-lg"><FoodPhoto src={item.image} alt={item.name} className="size-full" /></div><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold">{item.name}</p><p className="mt-0.5 text-[8px] text-[#ffb444]">Rs. {item.price}</p></div><button onClick={() => setEnabled((value) => ({ ...value, [item.name]: !value[item.name] }))} aria-label={`${enabled[item.name] ? 'Disable' : 'Enable'} ${item.name}`} aria-pressed={enabled[item.name]} className={`relative h-[17px] w-[31px] rounded-full transition ${enabled[item.name] ? 'bg-[#38b65d]' : 'bg-white/20'}`}><span className={`absolute top-[2px] size-[13px] rounded-full bg-white transition ${enabled[item.name] ? 'left-[16px]' : 'left-[2px]'}`} /></button></div>)}</div>
        <div className="px-3 pb-4 pt-2"><OrangeButton className="w-full"><Plus size={11} /> Add Item</OrangeButton></div>
      </div>
    </PhoneFrame>
  )
}

