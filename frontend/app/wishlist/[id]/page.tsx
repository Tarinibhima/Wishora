"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Sparkles from "@/components/Sparkles";
import { api } from "@/lib/api";
import { Wishlist } from "@/types";

export default function SharedWishlistPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/wishlists/${params.id}`);
      setWishlist(data.wishlist);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load wishlist");
    }
  }, [params.id]);

  useEffect(() => {
    const token = localStorage.getItem("wishora_token");
    if (!token) {
      router.push("/");
      return;
    }
    load();
  }, [load, router]);

  const reserve = async (itemId: string) => {
    try {
      const { data } = await api.patch(`/wishlists/${params.id}/items/${itemId}/reserve`);
      setWishlist(data.wishlist);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reservation failed");
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] px-4 py-8">
      <Sparkles />
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="cinematic-title text-4xl">Shared Wishlist</h1>
          <button className="rounded-md border border-[#1f1f1f] px-4 py-2" onClick={() => router.push("/dashboard")}>
            Dashboard
          </button>
        </div>

        {error && <p className="mb-4 text-red-300">{error}</p>}
        {wishlist && (
          <>
            <h2 className="mb-5 text-2xl text-[#c7daf0]">{wishlist.occasion}</h2>
            <div className="grid gap-4">
              {wishlist.items.map((item) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="glass flex flex-col gap-3 rounded-xl border border-[#1f1f1f] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-lg">{item.name}</h3>
                    <p className="muted">{item.description || "No description"}</p>
                    {item.productLink && (
                      <a href={item.productLink} target="_blank" className="mt-1 block text-sm text-[#89AACC]" rel="noreferrer">
                        View Product
                      </a>
                    )}
                  </div>
                  {item.status === "Available" ? (
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 0 18px rgba(137,170,204,0.35)" }}
                      whileTap={{ scale: 0.98 }}
                      className="accent-gradient rounded-md px-4 py-2 font-medium text-black"
                      onClick={() => reserve(item.id)}
                    >
                      Reserve
                    </motion.button>
                  ) : (
                    <span className="rounded-md border border-[#1f1f1f] px-4 py-2 text-[#d8b8b8]">Reserved</span>
                  )}
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
