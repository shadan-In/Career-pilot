import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";


const inter = Inter({
  subsets: ["latin"],

});

export const metadata = {
  title: "Career Pilot - AI Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }}>
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}min-h-screen flex flex-col`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
           {/* header */}
           <Header/>
           <main className="min-h-screen pt-24">{children}</main>
           <Toaster richColors/>
           {/* footer */}
           <footer className="bg-muted/50 py-12 mt-20">
           <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>Made by Shadan Ansari</p>
           </div>
           </footer>
          </ThemeProvider>
      </body>
    </html>

    </ClerkProvider>
  );
}
