"use client";

import React, { useState } from "react";
import axios from "axios";
import { Download, AlertCircle, Video, Music } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface VideoFormat {
  quality: string;
  url: string;
  mimeType?: string;
  hasVideo: boolean;
  hasAudio: boolean;
  qualityLabel?: string;
  bitrate?: number;
  contentLength?: string;
  audioQuality?: string;
}

interface VideoData {
  title: string;
  thumbnail: string;
  formats: VideoFormat[];
}

const Downloader: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return "Unknown size";
    const size = parseInt(bytes, 10);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const processFormats = (adaptiveFormats: VideoFormat[]) => {
    return adaptiveFormats.map((format: VideoFormat) => ({
      quality: format.qualityLabel || format.audioQuality || "Unknown",
      url: format.url,
      mimeType: format.mimeType,
      hasVideo: format.mimeType?.includes("video") ?? false,
      hasAudio: format.mimeType?.includes("audio") ?? false,
      qualityLabel: format.qualityLabel,
      bitrate: format.bitrate,
      contentLength: format.contentLength,
      audioQuality: format.audioQuality,
    }));
  };

  const fetchVideoData = async () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setVideoData(null);

    try {
      const response = await axios.get(
        "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
        {
          params: { id: videoId },
          headers: {
            "x-rapidapi-key":
              "5840247a03mshcf7ab0ea76dc5dcp1f8095jsnee78d61a3214",
            "x-rapidapi-host":
              "ytstream-download-youtube-videos.p.rapidapi.com",
          },
        }
      );

      if (
        !response.data.title ||
        !response.data.thumbnail ||
        !response.data.adaptiveFormats
      ) {
        throw new Error("Invalid response format from API");
      }

      setVideoData({
        title: response.data.title,
        thumbnail: response.data.thumbnail,
        formats: processFormats(response.data.adaptiveFormats),
      });
    } catch (error) {
      setError("Failed to fetch video data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const FormatButton: React.FC<{ format: VideoFormat }> = ({ format }) => {
    const isVideoFormat = format.hasVideo;
    const Icon = isVideoFormat ? Video : Music;
    const formatType =
      format.mimeType?.split(";")[0].split("/")[1]?.toUpperCase() || "Unknown";
    const bitrate = format.bitrate
      ? `${Math.round(format.bitrate / 1000)} kbps`
      : "";
    const fileSize = formatFileSize(format.contentLength);

    return (
      <a
        href={format.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
      >
        <div className="flex items-center gap-3 flex-1">
          <Icon className="w-5 h-5 text-gray-600 shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium">{format.quality}</span>
            <span className="text-sm text-gray-500">
              {formatType} • {bitrate} • {fileSize}
            </span>
          </div>
        </div>
        <Download className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </a>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="p-6 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Download YouTube Videos
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Convert YouTube videos to MP3, MP4, and more with our easy-to-use
            converter.
          </p>

          <div className="flex gap-2 mb-8">
            <Input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
            />
            <Button onClick={fetchVideoData} disabled={loading}>
              {loading ? "Loading..." : "Download"}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {videoData && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-64 shrink-0">
                  <img
                    src={videoData.thumbnail}
                    alt={videoData.title}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-4">
                    {videoData.title}
                  </h2>

                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Video className="w-5 h-5" /> Video Formats
                  </h3>
                  <div className="space-y-2">
                    {videoData.formats
                      .filter((f) => f.hasVideo)
                      .map((format, i) => (
                        <FormatButton key={i} format={format} />
                      ))}
                  </div>

                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Music className="w-5 h-5" /> Audio Only
                  </h3>
                  <div className="space-y-2">
                    {videoData.formats
                      .filter((f) => !f.hasVideo && f.hasAudio)
                      .map((format, i) => (
                        <FormatButton key={i} format={format} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Downloader;
