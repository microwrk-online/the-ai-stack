"use client";
import { motion } from "framer-motion";
import SubscribeForm from "./SubscribeForm";

export default function Hero() {
  return (
    <section className="h-auto py-48 flex flex-col justify-center items-center px-6 text-center transition-colors duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent"
      >
        The AI Stack
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl"
      >
        Each week, we drop the sharpest AI tools, killer SaaS ideas, and
        high-leverage side hustles. Built for indie hackers, solo devs, and
        builders who move fast. No clickbait. No fluff. Just raw, usable stuff
        that makes you smarter. Subscribe once — and let the juice come to you.
      </motion.p>
      <div className="mt-8 w-full max-w-md">
        <SubscribeForm />
      </div>
    </section>
  );
}
