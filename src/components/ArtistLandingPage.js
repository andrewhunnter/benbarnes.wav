import React, { useState, useEffect, useRef } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpotify, 
  faSoundcloud, 
  faApple, 
  faInstagram, 
  faTiktok, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import Visualizer from './Visualizer';

const ArtistLandingPage = () => {
  const mockData = {
    artistName: "benbarnes",
    profilePicture: "/benbarnes.png",
    socialMedia: [
      { platform: "Instagram", url: "https://instagram.com/benbarnesmusic", icon: faInstagram },
      { platform: "TikTok", url: "https://tiktok.com/@benbarnesmusic", icon: faTiktok },
      { platform: "YouTube", url: "https://youtube.com/@benbarnesmusic", icon: faYoutube },
    ],
    streamingStats: {
      spotify: 5300,
      soundcloud: 16700,
      appleMusic: 3500,
    },
    latestAlbum: {
      title: "deadweight",
      releaseDate: "2024-10-31",
      imageUrl: "/deadweight.jpg",
    },
    profiles: [
      { platform: "Apple Music", url: "https://music.apple.com/us/artist/benbarnes/1686996493", icon: faApple },
      { platform: "Spotify", url: "https://open.spotify.com/artist/1uqbXPf5vWgMLyT2kRmZWO?si=0Mkiy9NnQCm8EuebV28eiw", icon: faSpotify },
      { platform: "SoundCloud", url: "https://soundcloud.com/auxilio", icon: faSoundcloud },
    ],
    contactEmail: "auxsnh7@gmail.com",
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  // Snippet Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 10; // 10-second snippet
  const [waveform] = useState(
    Array(100).fill(0).map(() => Math.floor(Math.random() * 40) + 30)
  );
  const audioRef = useRef(new Audio('/FullSizeRender.mp3'));
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

        {/* Social Media Links */}
        <div className="flex justify-center gap-4 mb-8">
          {mockData.socialMedia.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur-lg opacity-40 group-hover:opacity-75 transition-all duration-300"></div>
              <div className="relative w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                <FontAwesomeIcon 
                  icon={social.icon} 
                  className="w-6 h-6 text-white opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-0.5" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"></div>
            </a>
          ))}
        </div>

        {/* Streaming Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-0 max-w-sm sm:max-w-none mx-auto w-full">
          {Object.entries(mockData.streamingStats).map(([platform, stat], index) => {
            const icons = { spotify: faSpotify, soundcloud: faSoundcloud, appleMusic: faApple };
            return (
              <div
                key={index}
                className="bg-[#141414] p-4 rounded-lg shadow-md border-[1px] border-white/5 flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-center sm:text-center sm:space-y-2"
              >
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                  <FontAwesomeIcon icon={icons[platform]} className="w-6 h-6 text-white" />
                  <div className="text-sm text-gray-400">{platform}</div>
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {formatNumber(stat)}
                </div>
              </div>
            );
          })}
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
                <h4 className="text-lg font-bold">AL CAPONE | 1/27</h4>
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
                href="https://li.sten.to/deadweight" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white text-sm font-bold mt-2 block hover:text-gray-300 transition-colors"
              >
                STREAM HERE
              </a>
            </div>
          </div>
        </div>

        {/* YouTube Video Section */}
        <div className="bg-[#141414] p-6 rounded-lg shadow-md border-[1px] border-white/5">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Latest Video
          </h3>
          <div className="relative w-full pb-[56.25%]"> {/* 16:9 aspect ratio */}
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/ZP90YYmgrA8"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
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
                {profile.platform}
              </span>
            </a>
          ))}
        </div>

        {/* Contact Section - now moved below platform links */}
        <div className="bg-[#141414] p-6 rounded-lg shadow-md border-[1px] border-white/5 text-center">
          <h4 className="text-lg font-bold mb-2">PRODUCTION & BOOKINGS</h4>
          <a 
            href={`mailto:${mockData.contactEmail}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {mockData.contactEmail}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArtistLandingPage;
