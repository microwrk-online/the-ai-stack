"use client";
import { motion } from "framer-motion";

const features = [
  "🧠 1 underrated AI tool every week",
  "💰 1 side hustle blueprint using AI",
  "🚀 1 SaaS idea + prompt breakdown",
  "🔧 1 small project or GitHub repo",
  "📈 1 trending meme or viral thread",
];

export default function Features() {
  return (
    <section className="bg-[#13131f] px-6 py-20 text-white text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-cyan-400">
        What You’ll Get
      </h2>
      <ul className="space-y-4 max-w-xl mx-auto text-lg text-gray-300">
        {features.map((feature, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            {feature}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
