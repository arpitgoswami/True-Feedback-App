import Downloader from "@/components/Downloader";
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
      <Downloader />
    </main>
  );
}
