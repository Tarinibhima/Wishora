"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Sparkles from "./Sparkles";

const words = ["Wish", "Choose", "Surprise"];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const progress = useMemo(() => ((index + 1) / words.length) * 100, [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => Math.min(prev + 1, words.length - 1));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const total = 2700 + 400;
    const fade = setTimeout(() => setVisible(false), total);
    const done = setTimeout(() => onDone(), total + 600);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <Sparkles />
          <div className="relative flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={words[index]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="cinematic-title text-5xl text-[#f5f5f5]"
              >
                {words[index]}
              </motion.h1>
            </AnimatePresence>
          </div>
          <div className="h-[3px] w-full bg-[#111]">
            <motion.div
              className="accent-gradient h-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
