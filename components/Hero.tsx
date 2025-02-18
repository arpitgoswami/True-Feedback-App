"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

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
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold text-center">
        Search for your favorite videos
      </h1>
      <p className="text-lg text-center text-muted-foreground">
        Convert Youtube videos to mp3, mp4, and more with our easy to use
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
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      <div className="w-full max-w-sm space-y-4">
        {formats.length > 0 &&
          (() => {
            const uniqueQualities: { [key: string]: boolean } = {};
            return formats.map((data: VideoFormat, index: number) => {
              if (
                data.mimeType.includes("video/mp4") &&
                !uniqueQualities[data.qualityLabel]
              ) {
                uniqueQualities[data.qualityLabel] = true;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="font-medium">{data.qualityLabel}</p>
                    </div>
                    <Button
                      onClick={() => {
                        window.open(data.url, "_blank");
                      }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </Button>
                  </div>
                );
              }
              return null;
            });
          })()}
      </div>
      <Toaster />
    </div>
  );
}
