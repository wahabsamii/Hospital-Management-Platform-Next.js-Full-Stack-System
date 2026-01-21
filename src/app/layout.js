import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ToastProvider from "@/components/ToastProvider";
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "JHC Clinic",
  description: "A full-stack Next.js healthcare app designed for hospitals and clinics, offering patient management, appointment scheduling, role-based access control, and real-time chat with a secure, scalable architecture.",
   icons: {
    icon:"/favicons.png"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${outfit.variable} font-outfit antialiased`}>
        <Providers>
          {children}
          <ToastProvider />
          </Providers>
      </body>
    </html>
  );
}
