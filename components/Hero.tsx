import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { FiVideo, FiDownload } from "react-icons/fi";

// Add this interface near the top of the file, after the imports
interface VideoFormat {
  mimeType: string;
  qualityLabel: string;
  url: string;
}

export default function Hero() {
  const [formats, setFormats] = useState<VideoFormat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post("/api/info", { url })
      .then((res) => {
        console.log(res.data);
        setFormats(res.data);
        toast.success("Search completed successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch video information");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col gap-4 items-center justify-center px-4 z-10"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="z-10 text-lg md:text-6xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Download Youtube Videos
          </h1>
          <p className="text-center text-muted-foreground">
            Convert Youtube videos to mp3, mp4, and more with our{" "}
            <span className="text-white">easy to use </span>
            converter.
          </p>
          <form
            className="flex w-full max-w-sm items-center space-x-2"
            onSubmit={handleSubmit}
          >
            <Input
              type="text"
              placeholder="Search for your favorite videos"
              disabled={isLoading}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        <div className="w-full space-y-4 text-white">
          {formats.length > 0 &&
            (() => {
              const uniqueQualities: { [key: string]: boolean } = {};
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  {formats.map((data: VideoFormat, index: number) => {
                    if (
                      data.mimeType.includes("video/mp4") &&
                      !uniqueQualities[data.qualityLabel]
                    ) {
                      uniqueQualities[data.qualityLabel] = true;
                      return (
                        <div
                          key={index}
                          className="relative group flex items-center justify-between p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl hover:shadow-2xl hover:shadow-green-500/20 hover:border-white/20 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-green-500/20 transition-colors">
                              <FiVideo className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {data.qualityLabel}
                              </p>
                              <p className="text-sm text-white/60">
                                MP4 Format
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              window.open(data.url, "_blank");
                            }}
                            className="bg-white/10 hover:bg-green-500/50 backdrop-blur-sm text-white transition-colors duration-300 flex items-center gap-2"
                          >
                            <FiDownload className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })()}
        </div>
        <Toaster />
      </motion.div>
    </AuroraBackground>
  );
}
