import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "Universal Design Duo - Digital Marketing & SEO Agency",
  description:
    "Universal Design Duo is a digital agency crafting brand, product, and web experiences that move businesses forward.",
  icons: {
    icon: "/assets/img/favicon.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
