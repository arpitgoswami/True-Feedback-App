"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Download,
  AlertCircle,
  Video,
  Music,
  Youtube,
  Github,
  Search,
  Shield,
  Lock,
  Zap,
} from "lucide-react";

interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
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

export default function Downloader() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url: string) => {
    let match = url.match(/(?:v=|\/|shorts\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const formatFileSize = (bytes: string | undefined) => {
    if (!bytes) return "Unknown size";
    const size = parseInt(bytes);
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    else if (size < 1024 * 1024 * 1024)
      return (size / (1024 * 1024)).toFixed(1) + " MB";
    else return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const processFormats = (adaptiveFormats: VideoFormat[]) => {
    return adaptiveFormats.map((format: VideoFormat) => {
      const isVideo = format.mimeType?.includes("video");
      const isAudio = format.mimeType?.includes("audio");

      return {
        quality: format.qualityLabel || format.audioQuality || "Unknown",
        url: format.url,
        mimeType: format.mimeType,
        hasVideo: isVideo,
        hasAudio: isAudio,
        qualityLabel: format.qualityLabel,
        bitrate: format.bitrate,
        contentLength: format.contentLength,
        audioQuality: format.audioQuality,
      };
    });
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
      const options = {
        method: "GET",
        url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
        params: { id: videoId },
        headers: {
          "x-rapidapi-key":
            "5840247a03mshcf7ab0ea76dc5dcp1f8095jsnee78d61a3214",
          "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);

      if (
        !response.data.title ||
        !response.data.thumbnail ||
        !response.data.adaptiveFormats
      ) {
        throw new Error("Invalid response format from API");
      }

      const processedFormats = processFormats(response.data.adaptiveFormats);

      setVideoData({
        title: response.data.title,
        thumbnail: response.data.thumbnail,
        formats: processedFormats,
      });
    } catch (error) {
      setError("Failed to fetch video data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchVideoData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-mono">
      {/* Neon grid background */}
      <div className="fixed inset-0 bg-[#000000] z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#08001A_1px,transparent_1px),linear-gradient(to_bottom,#08001A_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00F0FF_0%,#000000_100%)] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[url('/noise.png')] opacity-5"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-[#00F0FF]/20 backdrop-blur-md bg-black/80 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-[#00F0FF] rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-black">
                  <Youtube className="h-5 w-5 text-[#00F0FF]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#00F0FF] uppercase">
                  <span className="text-white">TUBE</span>XPLOIT
                </h1>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00F0FF] to-[#FC00FF] rounded-full opacity-75 blur"></div>
                  <span className="relative text-xs font-bold px-2 py-0.5 rounded-full bg-black border border-[#00F0FF]/50 tracking-wider">
                    3.0
                  </span>
                </div>
              </div>
            </div>
            <button className="group relative px-4 py-2 overflow-hidden">
              <div className="absolute inset-0 w-3 bg-gradient-to-r from-[#00F0FF] to-[#FC00FF] transition-all duration-[400ms] ease-out group-hover:w-full opacity-30"></div>
              <div className="relative flex items-center gap-2 text-[#00F0FF] group-hover:text-white">
                <Github className="w-4 h-4" />
                <span className="font-medium text-sm uppercase tracking-wider">
                  Connect Wallet
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#00F0FF] rounded-full blur-[80px] opacity-30"></div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 uppercase relative">
                <span className="tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#FC00FF]">
                  Tube<span className="text-white">Xploit</span>
                </span>
              </h1>
              <p className="text-[#888888] text-lg max-w-2xl mx-auto leading-relaxed">
                <span className="text-[#00F0FF]">Secure</span> •{" "}
                <span className="text-[#FC00FF]">Decentralized</span> •{" "}
                <span className="text-[#00F0FF]">Anonymous</span>
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-xs text-[#888888]">
                  <Lock className="w-3 h-3 text-[#00F0FF]" />
                  <span>ENCRYPTED</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#00F0FF]"></div>
                <div className="flex items-center gap-1 text-xs text-[#888888]">
                  <Shield className="w-3 h-3 text-[#FC00FF]" />
                  <span>ANONYMOUS</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#00F0FF]"></div>
                <div className="flex items-center gap-1 text-xs text-[#888888]">
                  <Zap className="w-3 h-3 text-[#00F0FF]" />
                  <span>WEB3</span>
                </div>
              </div>
            </div>

            {/* Search input */}
            <div className="bg-black border border-[#00F0FF]/30 rounded-lg mb-10 overflow-hidden transition-all hover:border-[#00F0FF]/70 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-[#FC00FF]/5"></div>
              <div className="relative p-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow group">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Paste YouTube URL here (regular, youtu.be, or Shorts)..."
                      className="w-full px-4 py-3 pl-10 bg-[#080808] border border-[#00F0FF]/20 group-hover:border-[#00F0FF]/40 rounded-md text-white placeholder-[#444444] focus:outline-none focus:border-[#00F0FF] transition-all"
                    />
                    <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#00F0FF]" />
                  </div>
                  <button
                    onClick={fetchVideoData}
                    disabled={loading}
                    className={`group relative px-6 py-3 rounded-md font-semibold uppercase tracking-wider text-sm overflow-hidden ${
                      loading
                        ? "bg-[#222222] text-[#666666] cursor-not-allowed"
                        : "bg-black text-white border border-[#00F0FF]/30 hover:border-[#00F0FF]"
                    }`}
                  >
                    {!loading && (
                      <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#00F0FF]/20 to-[#FC00FF]/20 group-hover:w-full transition-all duration-300"></div>
                    )}
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing</span>
                        </div>
                      ) : (
                        <>
                          <Search className="w-4 h-4 text-[#00F0FF]" />
                          <span>Decrypt</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-[#FF0050] mt-4 p-4 bg-[#FF0050]/5 rounded-md border border-[#FF0050]/20">
                    <AlertCircle className="w-5 h-5 text-[#FF0050]" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Video data */}
            {videoData && (
              <div className="bg-black border border-[#00F0FF]/20 rounded-lg overflow-hidden transition-all hover:border-[#00F0FF]/40 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-[#FC00FF]/5"></div>
                <div className="relative border-b border-[#00F0FF]/20 p-5">
                  <span className="text-xs text-[#00F0FF] uppercase tracking-wider">
                    Decrypted Content
                  </span>
                  <h2 className="text-lg font-bold mt-1 line-clamp-1">
                    {videoData.title}
                  </h2>
                </div>
                <div className="relative p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Thumbnail with cyber effect */}
                    <div className="md:w-1/3">
                      <div className="rounded-md overflow-hidden border border-[#00F0FF]/20 mb-4 relative group">
                        <div className="absolute inset-0 bg-[url('/glitch.png')] mix-blend-screen opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00F0FF]/10 to-[#FC00FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#00F0FF] to-[#FC00FF] opacity-0 group-hover:opacity-30 blur-sm transition-opacity"></div>
                        <img
                          src={videoData.thumbnail}
                          alt={videoData.title}
                          className="w-full h-auto object-cover relative"
                        />
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-1 bg-black/60 backdrop-blur-sm text-xs text-white">
                          <div className="flex items-center justify-between">
                            <span>SECURED CONTENT</span>
                            <div className="flex gap-1 items-center">
                              <span className="w-1 h-1 rounded-full animate-ping bg-[#00F0FF]"></span>
                              <span className="w-1 h-1 rounded-full bg-[#00F0FF]"></span>
                              <span className="w-1 h-1 rounded-full bg-[#00F0FF]"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download options */}
                    <div className="md:w-2/3 space-y-8">
                      {/* Video formats */}
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-1 h-5 bg-[#00F0FF] mr-3"></div>
                          <h3 className="uppercase tracking-wider text-sm font-bold flex items-center gap-2 text-white">
                            <Video className="w-4 h-4 text-[#00F0FF]" />
                            Video Protocol
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {videoData.formats
                            .filter((format) => format.hasVideo)
                            .map((format, index) => {
                              const formatType = format.mimeType
                                .split(";")[0]
                                .split("/")[1]
                                .toUpperCase();
                              const bitrate = format.bitrate
                                ? `${Math.round(format.bitrate / 1000)} kbps`
                                : "";
                              const fileSize = formatFileSize(
                                format.contentLength
                              );

                              return (
                                <a
                                  key={`video-${index}`}
                                  href={format.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block bg-[#080808] hover:bg-[#0A0A0A] border border-[#00F0FF]/20 hover:border-[#00F0FF] rounded-md transition-all duration-200 relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 w-1 bg-[#00F0FF] group-hover:w-full opacity-0 group-hover:opacity-5 transition-all duration-500"></div>
                                  <div className="flex items-center justify-between px-4 py-3 relative">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="relative">
                                        <div className="absolute -inset-1 bg-[#00F0FF] opacity-20 blur-sm rounded-full group-hover:opacity-30 transition-opacity"></div>
                                        <div className="w-8 h-8 rounded-full bg-black border border-[#00F0FF]/50 flex items-center justify-center shrink-0 relative">
                                          <Video className="w-4 h-4 text-[#00F0FF]" />
                                        </div>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-medium text-white">
                                          {format.quality}
                                        </span>
                                        <div className="text-xs text-[#666666] flex items-center gap-2">
                                          <span className="text-[#00F0FF]">
                                            {formatType}
                                          </span>
                                          <span className="w-1 h-1 rounded-full bg-[#00F0FF]/50"></span>
                                          <span>{bitrate}</span>
                                          <span className="w-1 h-1 rounded-full bg-[#00F0FF]/50"></span>
                                          <span>{fileSize}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <div className="absolute -inset-1 bg-[#00F0FF] opacity-0 group-hover:opacity-20 blur-sm rounded-full transition-opacity"></div>
                                      <div className="relative w-8 h-8 rounded-full bg-black border border-[#00F0FF]/0 group-hover:border-[#00F0FF]/50 flex items-center justify-center">
                                        <Download className="w-4 h-4 text-[#00F0FF]" />
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                        </div>
                      </div>

                      {/* Audio formats */}
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-1 h-5 bg-[#FC00FF] mr-3"></div>
                          <h3 className="uppercase tracking-wider text-sm font-bold flex items-center gap-2 text-white">
                            <Music className="w-4 h-4 text-[#FC00FF]" />
                            Audio Protocol
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {videoData.formats
                            .filter(
                              (format) => !format.hasVideo && format.hasAudio
                            )
                            .map((format, index) => {
                              const formatType = format.mimeType
                                .split(";")[0]
                                .split("/")[1]
                                .toUpperCase();
                              const bitrate = format.bitrate
                                ? `${Math.round(format.bitrate / 1000)} kbps`
                                : "";
                              const fileSize = formatFileSize(
                                format.contentLength
                              );

                              return (
                                <a
                                  key={`audio-${index}`}
                                  href={format.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block bg-[#080808] hover:bg-[#0A0A0A] border border-[#FC00FF]/20 hover:border-[#FC00FF] rounded-md transition-all duration-200 relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 w-1 bg-[#FC00FF] group-hover:w-full opacity-0 group-hover:opacity-5 transition-all duration-500"></div>
                                  <div className="flex items-center justify-between px-4 py-3 relative">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="relative">
                                        <div className="absolute -inset-1 bg-[#FC00FF] opacity-20 blur-sm rounded-full group-hover:opacity-30 transition-opacity"></div>
                                        <div className="w-8 h-8 rounded-full bg-black border border-[#FC00FF]/50 flex items-center justify-center shrink-0 relative">
                                          <Music className="w-4 h-4 text-[#FC00FF]" />
                                        </div>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-medium text-white">
                                          {format.quality}
                                        </span>
                                        <div className="text-xs text-[#666666] flex items-center gap-2">
                                          <span className="text-[#FC00FF]">
                                            {formatType}
                                          </span>
                                          <span className="w-1 h-1 rounded-full bg-[#FC00FF]/50"></span>
                                          <span>{bitrate}</span>
                                          <span className="w-1 h-1 rounded-full bg-[#FC00FF]/50"></span>
                                          <span>{fileSize}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <div className="absolute -inset-1 bg-[#FC00FF] opacity-0 group-hover:opacity-20 blur-sm rounded-full transition-opacity"></div>
                                      <div className="relative w-8 h-8 rounded-full bg-black border border-[#FC00FF]/0 group-hover:border-[#FC00FF]/50 flex items-center justify-center">
                                        <Download className="w-4 h-4 text-[#FC00FF]" />
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            {!videoData && (
              <div className="mt-16">
                <div className="flex items-center justify-center mb-10">
                  <div className="w-1 h-6 bg-[#00F0FF] mr-3"></div>
                  <h2 className="uppercase tracking-wider text-xl font-bold text-white">
                    DECENTRALIZED PROTOCOL
                  </h2>
                  <div className="w-1 h-6 bg-[#FC00FF] ml-3"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "MAXIMUM SECURITY",
                      description:
                        "End-to-end encrypted data transfer with zero traces.",
                      icon: <Shield className="w-6 h-6 text-[#00F0FF]" />,
                      color: "#00F0FF",
                    },
                    {
                      title: "ANONYMOUS ACCESS",
                      description:
                        "Complete anonymity with our zero-knowledge protocol.",
                      icon: <Lock className="w-6 h-6 text-[#FC00FF]" />,
                      color: "#FC00FF",
                    },
                    {
                      title: "WEB3 POWERED",
                      description:
                        "Decentralized architecture prevents censorship and tracking.",
                      icon: <Zap className="w-6 h-6 text-[#00F0FF]" />,
                      color: "#00F0FF",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-black border border-[#333333] hover:border-[#00F0FF]/50 rounded-md p-5 transition-all relative overflow-hidden"
                    >
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-[#00F0FF] to-[#FC00FF] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-[${feature.color}] opacity-20 blur-sm group-hover:opacity-40 rounded-full transition-opacity"></div>
                            <div className="w-10 h-10 rounded-full bg-black border border-[${feature.color}]/40 group-hover:border-[${feature.color}] flex items-center justify-center relative transition-all duration-300">
                              {feature.icon}
                            </div>
                          </div>
                          <h3 className="text-sm font-bold tracking-wider">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm text-[#888888] ml-12">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#00F0FF]/10 py-6 relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#444444]">
                <span className="text-[#00F0FF]">TUBEXPLOIT</span>
                <div className="w-1 h-1 rounded-full bg-[#00F0FF]"></div>
                <span>EST. 2025</span>
                <div className="w-1 h-1 rounded-full bg-[#00F0FF]"></div>
                <span>Web3 Protocol v2.4.7</span>
              </div>
              <div className="flex gap-6 text-[#444444] text-xs uppercase tracking-wider">
                {["Terms", "Privacy", "Contact"].map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="relative hover:text-[#00F0FF] transition-colors group"
                  >
                    {item}
                    <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-[#00F0FF] scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
