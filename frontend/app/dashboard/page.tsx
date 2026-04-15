"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Sparkles from "@/components/Sparkles";
import { api } from "@/lib/api";
import { Wishlist } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [occasion, setOccasion] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [origin, setOrigin] = useState("");
  const [item, setItem] = useState({ name: "", productLink: "", description: "" });

  const loadWishlists = useCallback(async () => {
    const { data } = await api.get("/wishlists/me");
    setWishlists(data.wishlists);
    if (!currentId && data.wishlists[0]) {
      setCurrentId(data.wishlists[0].id);
    }
  }, [currentId]);

  useEffect(() => {
    setOrigin(window.location.origin);
    const token = localStorage.getItem("wishora_token");
    if (!token) {
      router.push("/");
      return;
    }
    loadWishlists().catch(() => router.push("/"));
  }, [loadWishlists, router]);

  const createWishlist = async (e: FormEvent) => {
    e.preventDefault();
    if (!occasion.trim()) return;
    await api.post("/wishlists", { occasion });
    setOccasion("");
    await loadWishlists();
  };

  const addItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentId || !item.name.trim()) return;
    await api.post(`/wishlists/${currentId}/items`, item);
    setItem({ name: "", productLink: "", description: "" });
    await loadWishlists();
  };

  const selectedWishlist = wishlists.find((wishlist) => wishlist.id === currentId);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] px-4 py-6 sm:px-8">
      <Sparkles />
      <nav className="relative z-10 mx-auto mb-10 flex max-w-6xl items-center justify-between border-b border-[#1f1f1f] pb-5">
        <p className="cinematic-title text-3xl">Wishora</p>
        <div className="flex items-center gap-4 text-sm">
          <span>Profile</span>
          <button
            className="rounded-md border border-[#1f1f1f] px-4 py-2 transition hover:text-[#89AACC]"
            onClick={() => {
              localStorage.removeItem("wishora_token");
              router.push("/");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="relative z-10 mx-auto mb-8 flex max-w-6xl justify-end">
        <button
          className="rounded-md border border-[#3a1e1e] px-4 py-2 text-sm text-[#f0b6b6] transition hover:border-[#7e3333] hover:text-[#ffd0d0]"
          onClick={async () => {
            const confirmed = window.confirm(
              "Delete your account permanently? This will remove your account and wishlists."
            );
            if (!confirmed) return;
            try {
              await api.delete("/auth/delete-account");
              localStorage.removeItem("wishora_token");
              router.push("/");
            } catch (_error) {
              window.alert("Could not delete account. Please try again.");
            }
          }}
        >
          Delete account
        </button>
      </section>

      <section className="relative z-10 mx-auto mb-10 max-w-6xl">
        <h1 className="cinematic-title text-4xl">Welcome back</h1>
        <p className="mt-2 text-xl text-[#c7daf0]">Create something worth remembering</p>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl">Create Wishlist</h2>
          <form onSubmit={createWishlist} className="flex gap-3">
            <input
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Occasion name"
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0d0d0d] p-3 outline-none focus:border-[#89AACC]"
            />
            <button className="accent-gradient rounded-md px-4 font-medium text-black">Create</button>
          </form>
          <div className="mt-4 space-y-2">
            {wishlists.map((wishlist) => (
              <button
                key={wishlist.id}
                onClick={() => setCurrentId(wishlist.id)}
                className={`w-full rounded-md border p-3 text-left transition ${
                  currentId === wishlist.id
                    ? "border-[#89AACC] bg-[#111820]"
                    : "border-[#1f1f1f] hover:border-[#89AACC]"
                }`}
              >
                {wishlist.occasion}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-xl">Add Item</h2>
          <form onSubmit={addItem} className="space-y-3">
            <input
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              placeholder="Item name"
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0d0d0d] p-3 outline-none focus:border-[#89AACC]"
            />
            <input
              value={item.productLink}
              onChange={(e) => setItem({ ...item, productLink: e.target.value })}
              placeholder="Product link"
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0d0d0d] p-3 outline-none focus:border-[#89AACC]"
            />
            <textarea
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              placeholder="Description"
              className="h-24 w-full rounded-md border border-[#1f1f1f] bg-[#0d0d0d] p-3 outline-none focus:border-[#89AACC]"
            />
            <button className="accent-gradient rounded-md px-5 py-2 font-medium text-black">Add</button>
          </form>
        </motion.div>
      </section>

      {selectedWishlist && (
        <section className="relative z-10 mx-auto mt-10 max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl">{selectedWishlist.occasion}</h3>
            <div className="flex items-center gap-2">
              <span className="muted text-sm">{`${origin}/wishlist/${selectedWishlist.id}`}</span>
              <button
                className="rounded-md border border-[#1f1f1f] px-3 py-2 text-sm"
                onClick={async () => navigator.clipboard.writeText(`${origin}/wishlist/${selectedWishlist.id}`)}
              >
                Copy
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {selectedWishlist.items.map((entry) => (
              <motion.article
                whileHover={{ y: -4, scale: 1.01 }}
                key={entry.id}
                className="glass rounded-xl border border-[#1f1f1f] p-5"
              >
                <h4 className="text-lg">{entry.name}</h4>
                <p className="mt-2 muted">{entry.description || "No description provided."}</p>
                <p className="mt-3 text-sm">
                  Status: <span className={entry.status === "Taken" ? "text-red-300" : "text-green-300"}>{entry.status}</span>
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
