import "@fontsource/bebas-neue/400.css";
import "./globals.css";

export const metadata = {
  title: "DECAT Multimedia — Events, Broadcast & Production",
  description:
    "DECAT Multimedia delivers corporate events, livestreaming, LED walls, sound, photography and film.",
  icons: {
    icon: "/decat-mark.png",
    shortcut: "/decat-mark.png",
    apple: "/decat-mark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
