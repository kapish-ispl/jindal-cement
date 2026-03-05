import { Suspense } from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from '@/components/Layout/ThemeProvider';
import AppContextProvider from '@/context/AppContext';
import "@/styles/globals.scss";
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import SmoothScrollProvider from "@/components/Layout/SmoothScrollProvider";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import "lenis/dist/lenis.css";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});


export const metadata: Metadata = {
  title: "Jindal Steel",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable}`}
      >
        <Suspense fallback={null}>
          <AccessibilityProvider>
            <AppContextProvider>
              <SmoothScrollProvider>
                <Header />
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <main>
                    {children}
                  </main>
                  <Footer />
                </ThemeProvider>
              </SmoothScrollProvider>
            </AppContextProvider>
          </AccessibilityProvider>
        </Suspense>
      </body>
    </html>
  );
}
