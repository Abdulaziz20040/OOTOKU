import RootLayout from "@/layouts/Rotlayout";
import "./globals.css";

export const metadata = {
  title: "Otaku",
  description: "Anime & Manga Social Network",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
