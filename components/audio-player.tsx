"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, Music } from "lucide-react"
import { formatTime } from "@/lib/format-time"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AudioPlayerProps {
  src: string
  title: string
  albumArt?: string
  lyrics?: string
  onToggleFullscreen: () => void
  isFullscreen: boolean
}

export function AudioPlayer({ src, title, albumArt, lyrics, onToggleFullscreen, isFullscreen }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [hasLyrics, setHasLyrics] = useState(!!lyrics)
  const [albumArtError, setAlbumArtError] = useState(false)

  // Check if the audio file has embedded lyrics
  useEffect(() => {
    // In a real app, you would check the audio metadata for lyrics
    // For now, we'll just use the lyrics prop
    setHasLyrics(!!lyrics)
  }, [lyrics])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted
      setIsMuted(newMuteState)
      audioRef.current.muted = newMuteState
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? "h-full" : ""}`}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-shrink-0 w-full md:w-48 h-48 bg-muted rounded-md overflow-hidden">
          {albumArt && !albumArtError ? (
            <img
              src={albumArt || "/placeholder.svg"}
              alt="Album cover"
              className="w-full h-full object-cover"
              onError={() => setAlbumArtError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Music className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">{title}</h3>

          {hasLyrics && (
            <Tabs defaultValue="player" className="w-full">
              <TabsList>
                <TabsTrigger value="player">Player</TabsTrigger>
                <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
              </TabsList>
              <TabsContent value="player" className="mt-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-12 text-right">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{formatTime(duration)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-24"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = Math.max(0, currentTime - 10)
                          }
                        }}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>

                      <Button onClick={togglePlay} variant="outline" size="icon" className="h-10 w-10">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = Math.min(duration, currentTime + 10)
                          }
                        }}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="lyrics" className="mt-2">
                <div className="bg-muted/30 p-4 rounded-md max-h-[200px] overflow-y-auto whitespace-pre-line">
                  {lyrics || "No lyrics available for this track."}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!hasLyrics && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm w-12 text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-sm w-12">{formatTime(duration)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.max(0, currentTime - 10)
                      }
                    }}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button onClick={togglePlay} variant="outline" size="icon" className="h-10 w-10">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.min(duration, currentTime + 10)
                      }
                    }}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
