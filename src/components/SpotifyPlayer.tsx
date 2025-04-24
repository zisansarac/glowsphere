import React from 'react';

// SpotifyPlayerProps türü, iframe parametrelerini doğru şekilde tipler
interface SpotifyPlayerProps {
  src: string;
  width?: string | number;
  height?: string | number;
  title: string;
  style?: React.CSSProperties;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  title,
}) => {
  return (
    <div className="fixed top-85 bottom-24 right-10 z-50">
      <iframe
  src="https://open.spotify.com/embed/playlist/2fjqCmPe2Nom3tSDKNmeal?utm_source=generator"
  width="350"  // Sabit genişlik
  height="80"  // Sabit yükseklik
  frameBorder="0"
  allow="encrypted-media"
  title={title}
  style={{
    border: 'none',
    padding: '0',
    margin: '0',
    overflow: 'hidden',
  }}
  className="rounded-lg shadow-lg"
/>

    </div>
  );
};

export default SpotifyPlayer;



//src="https://open.spotify.com/embed/playlist/2fjqCmPe2Nom3tSDKNmeal?utm_source=generator" 
