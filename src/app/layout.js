
import ContextProvider from "@/components/helper/Context";
import "./globals.css";
import ToastProvider from "@/components/helper/ToastProvider";


export const metadata = {
  title: {
    default: "Baby Mart",
    template: "%s | Baby Mart",
  },
  description: "Baby Mart app",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full overflow-x-hidden relative bg-slate-100">
       <ContextProvider>
       <ToastProvider>
         <main>{children}</main>
       </ToastProvider>
       </ContextProvider>
      </body>
    </html>
  );
}