"use client";

export default function VideoSection() {
  return (
    <div className="w-full px-40 py-30">
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
