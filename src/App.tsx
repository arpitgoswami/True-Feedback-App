import React, { useState } from 'react';
import axios from 'axios';
import { Youtube, Download, AlertCircle, Video, Music, Info } from 'lucide-react';

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

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatFileSize = (bytes: string | undefined) => {
    if (!bytes) return 'Unknown size';
    const size = parseInt(bytes);
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    else return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const processFormats = (adaptiveFormats: any[]) => {
    return adaptiveFormats.map(format => {
      const isVideo = format.mimeType?.includes('video');
      const isAudio = format.mimeType?.includes('audio');
      
      return {
        quality: format.qualityLabel || format.audioQuality || 'Unknown',
        url: format.url,
        mimeType: format.mimeType,
        hasVideo: isVideo,
        hasAudio: isAudio,
        qualityLabel: format.qualityLabel,
        bitrate: format.bitrate,
        contentLength: format.contentLength,
        audioQuality: format.audioQuality
      };
    });
  };

  const fetchVideoData = async () => {
    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const options = {
        method: 'GET',
        url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
        params: { id: videoId },
        headers: {
          'x-rapidapi-key': '5840247a03mshcf7ab0ea76dc5dcp1f8095jsnee78d61a3214',
          'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      
      if (!response.data.title || !response.data.thumbnail || !response.data.adaptiveFormats) {
        throw new Error('Invalid response format from API');
      }

      const processedFormats = processFormats(response.data.adaptiveFormats);

      setVideoData({
        title: response.data.title,
        thumbnail: response.data.thumbnail,
        formats: processedFormats
      });
    } catch (error) {
      setError('Failed to fetch video data. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const FormatButton = ({ format }: { format: VideoFormat }) => {
    const isVideoFormat = format.hasVideo;
    const Icon = isVideoFormat ? Video : Music;
    const formatType = format.mimeType.split(';')[0].split('/')[1].toUpperCase();
    const bitrate = format.bitrate ? `${Math.round(format.bitrate / 1000)} kbps` : '';
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-8">
            <Youtube className="w-10 h-10 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">YouTube Downloader</h1>
          </div>

          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchVideoData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Loading...' : 'Download'}
            </button>
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
                  <h2 className="text-xl font-semibold mb-4">{videoData.title}</h2>
                  
                  {/* Video formats */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Video Formats
                    </h3>
                    <div className="space-y-2">
                      {videoData.formats
                        .filter(format => format.hasVideo)
                        .map((format, index) => (
                          <FormatButton key={`video-${index}`} format={format} />
                        ))}
                    </div>
                  </div>

                  {/* Audio formats */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Audio Only
                    </h3>
                    <div className="space-y-2">
                      {videoData.formats
                        .filter(format => !format.hasVideo && format.hasAudio)
                        .map((format, index) => (
                          <FormatButton key={`audio-${index}`} format={format} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;