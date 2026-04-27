import DashboardSidebar from "@/components/bar/DashboardSidebar"
import DashboardTopbar from "@/components/bar/DashboardTopbar"
import FooterTagline from "@/components/bar/FooterTagline"
import MainContentWrapper from "@/components/bar/MainContentWrapper"
import { isManager } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Manage',
  description: 'Management site'
}

const PosLayout = async ({ children, }) => {
  const auth = await isManager()
  if (!auth.success) return redirect('/access')
  return (
    <div className="w-full flex min-h-screen bg-slate-50 relative overflow-x-hidden">
      <DashboardSidebar />
      <MainContentWrapper>
        <DashboardTopbar />
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
        <div className="py-6 border-t border-slate-200 px-4 md:px-8">
          <FooterTagline />
        </div>
      </MainContentWrapper>
    </div>
  )
}

export default PosLayout
