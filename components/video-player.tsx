"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, Smartphone } from "lucide-react"
import { formatTime } from "@/lib/format-time"
import { toast } from "@/components/ui/use-toast"

interface VideoPlayerProps {
  src: string
  title: string
  onToggleFullscreen: () => void
  isFullscreen: boolean
}

export function VideoPlayer({ src, title, onToggleFullscreen, isFullscreen }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add gyroscope support
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false)
  const [deviceOrientation, setDeviceOrientation] = useState<DeviceOrientationEvent | null>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuteState = !isMuted
      setIsMuted(newMuteState)
      videoRef.current.muted = newMuteState
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const handleMouseMove = () => {
    setIsHovering(true)
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setShowControls(false)
        }
      }, 3000)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 1000)
    }
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  // Handle device orientation change
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (gyroscopeEnabled) {
      setDeviceOrientation(event)
    }
  }

  // Request device orientation permission and enable gyroscope
  const enableGyroscope = async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        try {
          // For iOS 13+ devices
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleDeviceOrientation)
            setGyroscopeEnabled(true)
            toast({
              title: "Gyroscope enabled",
              description: "Tilt your device to control playback.",
            })
          }
        } catch (error) {
          console.error("Error requesting gyroscope permission:", error)
        }
      } else {
        // For other devices
        window.addEventListener("deviceorientation", handleDeviceOrientation)
        setGyroscopeEnabled(true)
        toast({
          title: "Gyroscope enabled",
          description: "Tilt your device to control playback.",
        })
      }
    } catch (error) {
      console.error("Error enabling gyroscope:", error)
    }
  }

  // Disable gyroscope
  const disableGyroscope = () => {
    window.removeEventListener("deviceorientation", handleDeviceOrientation)
    setGyroscopeEnabled(false)
    setDeviceOrientation(null)
  }

  // Clean up event listener on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation)
    }
  }, [])

  // Process gyroscope data to control video playback
  useEffect(() => {
    if (gyroscopeEnabled && deviceOrientation && videoRef.current && isPlaying) {
      // Use beta (front-to-back tilt) for seeking
      const beta = deviceOrientation.beta || 0

      // If device is tilted forward/backward significantly
      if (Math.abs(beta - 45) > 15) {
        const tiltFactor = (beta - 45) / 45 // Normalize around 45 degrees
        const seekAmount = tiltFactor * 5 // 5 seconds per 45 degrees of tilt

        if (videoRef.current) {
          const newTime = Math.max(0, Math.min(duration, currentTime + seekAmount))
          if (Math.abs(newTime - currentTime) > 1) {
            videoRef.current.currentTime = newTime
          }
        }
      }
    }
  }, [gyroscopeEnabled, deviceOrientation, isPlaying, currentTime, duration])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Toggle native fullscreen
  const toggleNativeFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? "h-full" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full rounded-md bg-black"
        onClick={handleVideoClick}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-white w-12 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-sm text-white w-12">{formatTime(duration)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, currentTime - 10)
                  }
                }}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                onClick={togglePlay}
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(duration, currentTime + 10)
                  }
                }}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={onToggleFullscreen} className="text-white hover:bg-white/20">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNativeFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              {typeof window !== "undefined" && typeof DeviceOrientationEvent !== "undefined" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={gyroscopeEnabled ? disableGyroscope : enableGyroscope}
                  className="text-white hover:bg-white/20"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
