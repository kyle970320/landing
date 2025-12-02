"use client";

export default function VideoSection() {
  return (
    <div className="container mx-auto">
      <video
        className="w-full rounded-2xl"
        src="/d-sket-video.mp4"
        autoPlay
        muted
        playsInline
        controls
      ></video>
      <span></span>
    </div>
  );
}
