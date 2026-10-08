import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export interface AudioPlayerProps {
  src: string;
  title?: string;
  stale?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, stale }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const changeSpeed = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      aria-label="Ses Çalar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '14px 18px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {title}
          </span>
          {stale && (
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', fontWeight: 700 }}>
              STALE (Revizyon Uyumsuz)
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Durdur' : 'Oynat'}
          style={{
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            color: '#FFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Ses İlerleme Çubuğu"
            style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{formatTime(duration)}</span>
        </div>

        <button
          type="button"
          onClick={changeSpeed}
          aria-label="Oynatma Hızı"
          style={{
            fontSize: 'var(--font-xs)',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            minWidth: '44px',
            minHeight: '44px',
            cursor: 'pointer',
          }}
        >
          {playbackRate}x
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Sesi Aç' : 'Sesi Kapat'}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            minWidth: '44px',
            minHeight: '44px',
            cursor: 'pointer',
          }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
};
