import React, { useState, useEffect, useRef } from 'react';
import { AnimatedBackground } from 'animated-backgrounds';
import Visualizer from './Visualizer'; // Import Visualizer component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faSoundcloud, faApple } from '@fortawesome/free-brands-svg-icons';

const ArtistLandingPage = () => {

  const mockData = {
    artistName: "benbarnes",
    profilePicture: "/benbarns.jpg",
    streamingStats: {
      spotify: 1234567,
      soundcloud: 890123,
      appleMusic: 456789,
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [waveform, setWaveform] = useState(Array(30).fill(0)); // 30 bars for waveform effect
  const audioRef = useRef(new Audio('/path/to/your/audio-file.mp3'));

  useEffect(() => {
    // Reset audio to play a 5-second snippet
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current.currentTime >= 5) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    });
  }, []);

  const handlePlay = () => {
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      setPlayCount((prevCount) => prevCount + 1);

      // Start waveform animation
      const interval = setInterval(() => {
        setWaveform(waveform.map(() => Math.random() * 100)); // Random heights for bars
      }, 100); // Update every 100ms

      // Stop animation after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        setWaveform(Array(30).fill(0)); // Reset waveform
        setIsPlaying(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8 relative">
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
      <AnimatedBackground animationName="auroraBorealis" />
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <img
              src={mockData.profilePicture}
              alt="Artist Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white/10 relative z-10"
            />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Visualizer /> {/* Visualizer on the left */}
            <h1 className="text-4xl md:text-6xl font-bold text-center text-white">
                {mockData.artistName}
            </h1>
            <Visualizer /> {/* Visualizer on the right */}
            </div>
        </div>

        {/* Streaming Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: faSpotify, label: "Spotify", stat: mockData.streamingStats.spotify },
            { icon: faSoundcloud, label: "SoundCloud", stat: mockData.streamingStats.soundcloud },
            { icon: faApple, label: "Apple Music", stat: mockData.streamingStats.appleMusic },
          ].map(({ icon, label, stat }, index) => (
            <div key={index} className="bg-[#141414] p-6 rounded-lg shadow-md border-[1px] border-white/5 text-center">
              <FontAwesomeIcon icon={icon} className="w-8 h-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{formatNumber(stat)}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
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
              <p className="text-gray-400">
                stream here (insert link)
              </p>
            </div>
          </div>
        </div>

        {/* New Song Snippet Section */}
        <div className="bg-[#141414] p-6 rounded-lg shadow-md border-[1px] border-white/5">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePlay} 
              className="bg-blue-500 text-white p-2 rounded-full"
              disabled={isPlaying}
            >
              {isPlaying ? 'Playing...' : 'Play'}
            </button>
            <div>
              <h4 className="text-lg font-bold">Song Title</h4>
              <div className="flex space-x-1 mt-2">
                {waveform.map((height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className="w-1 bg-orange-500"
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-400 mt-2">Play count: {playCount}</p>
        </div>

        {/* Platform Links */}
        <div className="space-y-4 flex flex-col items-center">
          {mockData.profiles.map((profile, index) => {
            let gradientStyle;
            switch (profile.platform.toLowerCase()) {
              case 'spotify':
                gradientStyle = 'from-green-400 to-green-600';
                break;
              case 'soundcloud':
                gradientStyle = 'from-orange-400 to-orange-600';
                break;
              case 'apple music':
                gradientStyle = 'from-pink-500 to-purple-500';
                break;
              default:
                gradientStyle = 'from-purple-400 to-blue-400';
            }

            return (
              <a
                key={index}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 flex items-center justify-center rounded-lg bg-[#141414] border border-gray-600 text-center hover:shadow-lg transition duration-200"
              >
                <span className={`text-xl font-bold bg-gradient-to-r ${gradientStyle} bg-clip-text text-transparent leading-none`}>
                  Listen on {profile.platform}
                </span>
              </a>
            );
          })}
        </div>


        {/* Email Subscription Form */}
        <div className="flex justify-center mt-8">
          <form className="bg-[#141414] p-6 rounded-xl shadow-lg border-[1px] border-white/10 hover:border-blue-500/70 transition-colors w-full">
          <h2 className="text-center text-2xl font-bold mb-4 flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
             get in contact... let's make music
            <i className="fas fa-envelope ml-2 text-white"></i>
          </h2>
            <div className="relative group">
              <input
                type="email"
                placeholder="enter your email"
                className="w-full px-5 py-4 rounded-lg bg-[#0A0A0A] text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-200 transform focus:-translate-y-0.5"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-white transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none group-hover:shadow-lg"
              >
                CONTACT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistLandingPage;
