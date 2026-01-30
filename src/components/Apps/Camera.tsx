"use client";

import { useRef, useState, useEffect } from "react";
import { useGallery } from "../../hooks/useGallery";
import { SwitchCamera } from "lucide-react";

type PermissionState = "pending" | "granted" | "denied";

type CameraProps = {
  onOpenGallery?: () => void;
};

const Camera = ({ onOpenGallery }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permission, setPermission] = useState<PermissionState>("pending");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [latestImage, setLatestImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTimeRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { addMedia, items } = useGallery();

  useEffect(() => {
    if (items.length > 0) {
      setLatestImage(items[0].url);
    }
  }, [items]);

  useEffect(() => {
    let isMounted = true;

    const requestCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (isMounted) {
          setPermission("denied");
        }
        return;
      }

      try {
        let stream: MediaStream;
        
        // If we have devices and a specific index, use that
        if (devices.length > 0 && devices[currentDeviceIndex]) {
             stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: devices[currentDeviceIndex].deviceId } },
                audio: false,
             });
        } else {
             // Initial load: prefer user facing camera
             stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
             });
        }

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setActiveStreamId(stream.id);
        setPermission("granted");
        
        // Enumerate devices if not done yet
        if (devices.length === 0) {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
            if (isMounted) {
                 setDevices(videoDevices);
                 // Try to find the active device index if possible, otherwise default to 0
                 // This is a simplification; for a perfect sync we'd check track settings
            }
        }
      } catch {
        if (isMounted) {
          setPermission("denied");
        }
      }
    };

    requestCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setActiveStreamId(null);
      }
    };
  }, [currentDeviceIndex]);

  useEffect(() => {
    if (permission === "granted" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((e) => console.error("Error playing video:", e));
    }
  }, [permission, activeStreamId]);

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        addMedia(blob, 'video');
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
        setRecordingProgress(0);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start progress
      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / 100; // 100 steps for 10s (approx 100ms interval)
        setRecordingProgress(Math.min(progress, 100));
      }, 100);

      // Auto stop after 10s
      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 10000);

    } catch (e) {
      console.error("Failed to start recording", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    
    if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const handlePointerDown = () => {
    pressStartTimeRef.current = Date.now();
    // Delay recording start slightly to differentiate tap from hold
    recordingTimeoutRef.current = setTimeout(() => {
      startRecording();
    }, 200); 
  };

  const handlePointerUp = () => {
    const pressDuration = Date.now() - pressStartTimeRef.current;
    
    // Clear the hold timer if released early (tap)
    if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);

    if (isRecording) {
      stopRecording();
    } else if (pressDuration < 200) {
      handleCapture();
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const width = video?.videoWidth || 640;
    const height = video?.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    if (permission === "granted" && video) {
      ctx.drawImage(video, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
            addMedia(blob, 'image');
            setSaved(true);
            window.setTimeout(() => setSaved(false), 1500);
        }
      }, "image/jpeg", 0.92);
    } 
  };

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
      {permission === "granted" ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted
        />
      ) : (
        <div className="w-full h-full bg-black" />
      )}
      <button
        type="button"
        onClick={onOpenGallery}
        className="absolute left-6 bottom-6 w-12 h-12 rounded-xl bg-white/10 border border-white/20 overflow-hidden z-20"
      >
        {latestImage ? (
          <img
            src={latestImage}
            alt="Latest capture"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/5" />
        )}
      </button>
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 z-10">
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${isRecording ? "scale-110" : "scale-100"}`}
        >
          {/* Progress Ring */}
          {isRecording && (
             <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle
                 cx="40"
                 cy="40"
                 r="36"
                 stroke="red"
                 strokeWidth="4"
                 fill="none"
                 strokeDasharray="226"
                 strokeDashoffset={226 - (226 * recordingProgress) / 100}
                 className="transition-all duration-100 ease-linear"
               />
             </svg>
          )}
          
          <div className={`rounded-full transition-all duration-200 ${
              isRecording 
              ? "w-8 h-8 bg-red-500 rounded-sm" 
              : "w-16 h-16 border-4 border-white bg-white/20 backdrop-blur-sm"
          }`} />
        </button>
        {devices.length > 1 && (
            <button
            type="button"
            onClick={() => setCurrentDeviceIndex((prev) => (prev + 1) % devices.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
            >
            <SwitchCamera size={24} />
            </button>
        )}
        {saved && (
          <div className="text-white text-sm bg-black/60 px-3 py-1 rounded-full">
            Saved
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;
