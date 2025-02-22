import Navbar from "@/components/Navbar";
import Downloader from "@/components/Downloader";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Youtube Downloader",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <Downloader />
      <Footer />
    </main>
  );
}
