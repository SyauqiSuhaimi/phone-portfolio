"use client";

import { useEffect, useRef, useState } from "react";
import { loadGalleryImages, saveGalleryImage } from "../../lib/galleryStorage";

type PermissionState = "pending" | "granted" | "denied";

type CameraProps = {
  onOpenGallery?: () => void;
};

const Camera = ({ onOpenGallery }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permission, setPermission] = useState<PermissionState>("pending");
  const [saved, setSaved] = useState(false);
  const [latestImage, setLatestImage] = useState<string | null>(null);

  useEffect(() => {
    setLatestImage(loadGalleryImages()[0] ?? null);
  }, []);

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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setPermission("granted");
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
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
      }
    };
  }, []);

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
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    saveGalleryImage(dataUrl);
    setLatestImage(dataUrl);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
      {permission === "granted" ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
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
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm"
        />
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
