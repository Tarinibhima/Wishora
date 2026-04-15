"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Sparkles from "@/components/Sparkles";
import { api } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (mode === "signup" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const payload =
        mode === "signup"
          ? { name: form.name, email: form.email, password: form.password }
          : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("wishora_token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showLoader && <LoadingScreen onDone={() => setShowLoader(false)} />}
      <main className="relative min-h-screen overflow-x-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 h-full w-full object-cover"
          src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4"
        />
        <Sparkles />

        <nav className="fixed inset-x-0 top-0 z-20 mx-auto flex max-w-6xl items-center justify-end gap-8 p-6 text-sm">
          {["Login", "Signup", "Contact"].map((item) => (
            <button
              key={item}
              className="transition hover:text-[#89AACC]"
              onClick={() => {
                if (item === "Contact") return;
                setMode(item.toLowerCase() as "login" | "signup");
                setShowAuthPopup(true);
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pb-16 pt-24">
          <div className="mb-10 text-center">
            <h1 className="cinematic-title text-6xl sm:text-8xl">Wishora</h1>
          </div>
        </section>

        <AnimatePresence>
          {showAuthPopup && (
            <motion.div
              className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthPopup(false)}
            >
              <motion.form
                onSubmit={handleAuth}
                onClick={(event) => event.stopPropagation()}
                className="glass w-full max-w-lg rounded-2xl p-6 sm:p-8"
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-medium capitalize">{mode}</h2>
                  <button
                    type="button"
                    className="text-xl text-[#a5bcd5] transition hover:text-white"
                    onClick={() => setShowAuthPopup(false)}
                  >
                    ×
                  </button>
                </div>
                {mode === "signup" && (
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Full Name"
                    className="mb-3 w-full rounded-lg border border-[#1f1f1f] bg-[#0f0f0f]/80 p-3 outline-none transition focus:border-[#89AACC]"
                  />
                )}
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="Email"
                  className="mb-3 w-full rounded-lg border border-[#1f1f1f] bg-[#0f0f0f]/80 p-3 outline-none transition focus:border-[#89AACC]"
                />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="Password"
                  className="mb-2 w-full rounded-lg border border-[#1f1f1f] bg-[#0f0f0f]/80 p-3 outline-none transition focus:border-[#89AACC]"
                />
                {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(137,170,204,0.35)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="accent-gradient w-full rounded-lg py-3 font-medium text-black"
                >
                  {loading ? "Please wait..." : mode === "login" ? "Login" : "Signup"}
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="relative z-10 min-h-screen px-6 py-20 sm:px-10">
          <motion.section
            className="mx-auto max-w-6xl"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <h3 className="cinematic-title mb-10 text-center text-4xl text-[#e3edf8] sm:text-6xl">How to use</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { step: "Step 1", title: "Sign up or log in", detail: "Open Login or Signup from the top bar to enter Wishora." },
                { step: "Step 2", title: "Create your wishlist", detail: "Add an occasion, then include gifts with links and descriptions." },
                { step: "Step 3", title: "Share your link", detail: "Copy your unique wishlist URL and send it to friends." },
                { step: "Step 4", title: "Friends reserve gifts", detail: "Each item can be reserved only once, so no duplicate gifts." }
              ].map((item) => (
                <motion.article
                  key={item.step}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="glass rounded-2xl p-6"
                >
                  <p className="mb-2 text-sm text-[#89AACC]">{item.step}</p>
                  <h4 className="mb-2 text-2xl">{item.title}</h4>
                  <p className="text-[#d9d9d9]">{item.detail}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </section>
      </main>
    </>
  );
}
