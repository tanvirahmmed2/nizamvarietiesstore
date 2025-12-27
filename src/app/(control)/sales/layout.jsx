
import { CartProvider } from "@/components/context/CartContext"
import SalesCart from "@/components/page/SalesCart"
import SalesNavbar from "@/components/ui/SalesNavbar"
import SalesSidebar from "@/components/ui/SalesSidebar"
import { isSales } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Sales | Restaurant',
  description: 'Sales site'
}


const PosLayout = async ({ children }) => {
  const auth = await isSales()
  if (!auth.success) {
    return redirect('/login')
  }
  return (
    <div className='w-full flex flex-col'>
      <SalesNavbar />
      <CartProvider>
        <div className=" flex flex-row w-full  justify-between">
          <SalesSidebar />
          {children}
          <SalesCart />
        </div>
      </CartProvider>

    </div>
  )
}

export default PosLayout
