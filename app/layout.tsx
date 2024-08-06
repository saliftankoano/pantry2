import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/fonts.css"; // Adjust the path if necessary
import { TooltipProvider } from "@/components/ui/tooltip";
import "@radix-ui/themes/styles.css";
import logo from "../assets/sensei.png";
const inter = Inter({ subsets: ["latin"] });

const defaultMetadata: Metadata = {
  title: "Food Sensei",
  description:
    "Transform your kitchen experience with Food Sensei! Effortlessly manage your Food contents and discover delicious recipes based on what you have. Say goodbye to mealtime indecision and make every meal a masterpiece.",
};

interface RootLayoutProps {
  pageProps?: any;
  children: React.ReactNode; // Ensure children are explicitly typed
}

export default function RootLayout({
  children,
  pageProps = {},
}: RootLayoutProps) {
  // If pageProps.metadata is defined, use it to override the default metadata
  const pageMetadata = pageProps?.metadata || defaultMetadata;

  return (
    <html lang="en">
      <head>
        <title>{pageMetadata.title}</title>
        <meta name="description" content={pageMetadata.description} />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://ik.imagekit.io/engineerbf24/sensei/1.png?updatedAt=1722908226867"
        />
      </head>
      <body className={inter.className}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
