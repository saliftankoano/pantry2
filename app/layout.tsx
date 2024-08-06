import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/fonts.css"; // Adjust the path if necessary
import { TooltipProvider } from "@/components/ui/tooltip";
import "@radix-ui/themes/styles.css";

const inter = Inter({ subsets: ["latin"] });
import Hotjar from "@hotjar/browser";

const siteId = 5085010;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

const defaultMetadata: Metadata = {
  title: "Food Sensei",
  description:
    "Transform your kitchen experience with Food Sensei! Effortlessly manage your Food contents and discover delicious recipes based on what you have. Say goodbye to mealtime indecision and make every meal a masterpiece.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Ensure title is a string
  const pageMetadata = defaultMetadata;

  return (
    <html lang="en">
      <head>
        <title>{String(pageMetadata.title)}</title>{" "}
        {/* Ensure title is a string */}
        <meta
          name="description"
          content={pageMetadata.description ?? "Default description"}
        />
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
