"use client";

const points = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${4 + Math.random() * 4}s`
}));

export default function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {points.map((point) => (
        <span
          key={point.id}
          className="absolute h-[2px] w-[2px] rounded-full bg-[#c8dcf2] opacity-40"
          style={{
            left: point.left,
            top: point.top,
            animation: `twinkle ${point.duration} ease-in-out ${point.delay} infinite`
          }}
        />
      ))}
    </div>
  );
}
