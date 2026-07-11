import "./globals.css";

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
    <html className="no-js" lang="en">
      <body>{children}</body>
    </html>
  );
}
