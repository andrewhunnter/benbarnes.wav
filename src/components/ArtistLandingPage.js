import React, { useState, useEffect, useRef } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faSoundcloud, faApple } from '@fortawesome/free-brands-svg-icons';
import Visualizer from './Visualizer';

const ArtistLandingPage = () => {
  const mockData = {
    artistName: "benbarnes",
    profilePicture: "/benbarns.jpg",
    streamingStats: {
      spotify: 10000,
      soundcloud: 12000,
      appleMusic: 2000,
    },
    latestAlbum: {
      title: "deadweight",
      releaseDate: "2024-03-15",
      imageUrl: "/deadweight.jpg",
    },
    profiles: [
      { platform: "Spotify", url: "https://open.spotify.com/artist/1uqbXPf5vWgMLyT2kRmZWO?si=0Mkiy9NnQCm8EuebV28eiw", icon: faSpotify },
      { platform: "SoundCloud", url: "#", icon: faSoundcloud },
      { platform: "Apple Music", url: "https://music.apple.com/us/artist/benbarnes/1686996493", icon: faApple },
    ],
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  // Snippet Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 5; // 5-second snippet
  const [waveform] = useState(
    Array(100).fill(0).map(() => Math.floor(Math.random() * 40) + 30)
  );
  const audioRef = useRef(new Audio('/test.mp3'));
  const animationFrameRef = useRef();

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= duration) {
        audio.pause();
        setIsPlaying(false);
        setCurrentTime(0);
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    audio.addEventListener('timeupdate', updateTime);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [duration]);

  const animateWaveform = () => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animateWaveform);
    }
  };

  const handlePlay = () => {
    if (!isPlaying) {
      audioRef.current.currentTime = currentTime; // Ensure playback starts from the current time
      audioRef.current.play();
      setIsPlaying(true);
      animateWaveform();
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8 relative">
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <AnimatedBackground animationName="auroraBorealis" />

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <img
              src={mockData.profilePicture}
              alt="Artist Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white/10 relative z-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <Visualizer />
            <h1 className="text-4xl md:text-6xl font-bold text-center text-white">{mockData.artistName}</h1>
            <Visualizer />
          </div>
        </div>

        {/* Streaming Stats */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(mockData.streamingStats).map(([platform, stat], index) => {
            const icons = { spotify: faSpotify, soundcloud: faSoundcloud, appleMusic: faApple };
            return (
              <div
                key={index}
                className="bg-[#141414] p-6 rounded-lg shadow-md border-[1px] border-white/5 text-center"
              >
                <FontAwesomeIcon icon={icons[platform]} className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {formatNumber(stat)}
                </div>
                <div className="text-sm text-gray-400">{platform}</div>
              </div>
            );
          })}
        </div>

        {/* Latest Album */}
        <div className="bg-[#141414] p-6 rounded-lg shadow-md border-[1px] border-white/5">
          <div className="flex items-center space-x-6">
            <img
              src={mockData.latestAlbum.imageUrl}
              alt="Latest Album"
              className="w-32 h-32 rounded-lg object-cover border-2 border-white/5"
            />
            <div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {mockData.latestAlbum.title}
              </h3>
              <p className="text-gray-400">
                Released: {new Date(mockData.latestAlbum.releaseDate).toLocaleDateString()}
              </p>
              <a 
                href={mockData.profiles[0].url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white text-sm font-bold mt-2 block hover:text-gray-300 transition-colors"
              >
                STREAM HERE
              </a>
            </div>
          </div>
        </div>

        {/* Song Snippet Playback */}
        <div className="bg-[#141414] p-6 rounded-lg shadow-md border-[1px] border-white/5">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlay}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <div>
                <h4 className="text-lg font-bold">Snippet</h4>
                <p className="text-sm text-gray-400">
                  {Math.floor(currentTime)}s / {duration}s
                </p>
              </div>
            </div>

            {/* Waveform Visualization - updated to purple */}
            <div className="h-24 w-full bg-[#1a1a1a] rounded-lg overflow-hidden">
              <div className="flex h-full w-full items-end gap-[1px] p-2">
                {waveform.map((height, index) => (
                  <div
                    key={index}
                    style={{
                      height: `${height}%`,
                      backgroundColor:
                        index < (currentTime / duration) * waveform.length
                          ? '#8B5CF6'
                          : '#4b5563',
                      flex: '1',
                      minWidth: '2px',
                    }}
                    className="rounded-t-sm transition-colors duration-150"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Links */}
        <div className="space-y-4 flex flex-col items-center">
          {mockData.profiles.map((profile, index) => (
            <a
              key={index}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 flex items-center justify-center rounded-lg bg-[#141414] border border-gray-600 text-center hover:shadow-lg transition duration-200"
            >
              <span className={`text-xl font-bold bg-clip-text text-transparent leading-none ${
                profile.platform === "Spotify" 
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : profile.platform === "SoundCloud"
                  ? "bg-gradient-to-r from-orange-400 to-orange-600"
                  : "bg-gradient-to-r from-pink-500 to-pink-600"
              }`}>
                Listen on {profile.platform}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistLandingPage;
