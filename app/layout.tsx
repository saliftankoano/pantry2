import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/fonts.css"; // Adjust the path if necessary
import { TooltipProvider } from "@/components/ui/tooltip";
import "@radix-ui/themes/styles.css";
import logo from "../assets/sensei.png";
const inter = Inter({ subsets: ["latin"] });

const defaultMetadata: Metadata = {
  title: "Fridge Sensei",
  description:
    "Transform your kitchen experience with Fridge Sensei! Effortlessly manage your fridge contents and discover delicious recipes based on what you have. Say goodbye to mealtime indecision and make every meal a masterpiece.",
};

export default function RootLayout({
  children,
  pageProps,
}: Readonly<{
  children: React.ReactNode;
  pageProps: any; // You may want to define a specific type for page props
}>) {
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
          href="https://ik.imagekit.io/engineerbf24/sensei/sensei.png?updatedAt=1722869311627"
        />
      </head>
      <body className={inter.className}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
