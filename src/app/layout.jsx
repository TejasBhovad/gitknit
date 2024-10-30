import localFont from "next/font/local";
import "./globals.css";
import NavbarWrapper from "./components/navbar";
import { AuthProvider } from "@/providers/auth";
import { ReactQueryClientProvider } from "@/providers/react-query";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "GitKnit",
  description: "from Discord threads to the web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryClientProvider>
          <AuthProvider>
            <NavbarWrapper>{children}</NavbarWrapper>
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
