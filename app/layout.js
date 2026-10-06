import "./globals.css";
import localFont from "next/font/local";
import Header from "./components/header";
import Footer from "./components/footer";
import Intro from "./components/intro";

const ppMori = localFont({
  src: [
    { path: "../public/font/pp-mori-font-family/ppmori-regular.otf", weight: "400", style: "normal" },
    { path: "../public/font/pp-mori-font-family/ppmori-semibold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-pp-mori",
  display: "swap",
});

export const metadata = {
  title: {
    default: "DECAT Multimedia — Events, Broadcast & Production",
    template: "%s | DECAT Multimedia",
  },
  description:
    "DECAT Multimedia delivers corporate events, livestreaming, LED walls, sound, photography and videography.",
  icons: {
    icon: "/decat-mark.png",
    shortcut: "/decat-mark.png",
    apple: "/decat-mark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ppMori.variable}>
      <body>
        <Intro />
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
