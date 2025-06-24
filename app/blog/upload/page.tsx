"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mdxTemplate = `---
title: "Your Blog Title"
description: "A short summary of the blog."
date: "2025-06-24"
tags: ["AI", "Next.js", "Tech"]
---

## Welcome to my blog

Start writing your blog content here using **Markdown** and <React />!
`;

export default function BlogUploadPage() {
  const [status, setStatus] = useState("");
  const [uploadedFile, setUploadedFile] = useState("");

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Uploading...");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Uploaded as: ${data.filename}`);
        setUploadedFile(data.filename);
        toast.success(`✅ '${data.filename}' uploaded successfully!`);
      } else {
        setStatus(`❌ Error: ${data.error}`);
        toast.error(`❌ Upload failed: ${data.error}`);
      }
    } catch (err) {
      setStatus(`❌ Upload failed. Try again.`);
      toast.error("❌ Upload failed. Server error.");
    }
  };

  const handleTemplateClick = async () => {
    try {
      await navigator.clipboard.writeText(mdxTemplate);
      toast.success("📋 MDX template copied to clipboard!");
    } catch (err) {
      toast.error("❌ Failed to copy template.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e1a] via-[#141421] to-[#0e0e1a] text-white px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-xl shadow-xl"
      >
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Upload Blog Post (.mdx)
        </h1>

        <form onSubmit={handleUpload} className="space-y-6">
          <input
            type="file"
            name="file"
            accept=".mdx"
            required
            className="w-full px-4 py-3 bg-white/10 text-white rounded-lg backdrop-blur border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
          >
            Upload
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-green-400">{status}</p>
        

        <div
          className="mt-10 p-6 bg-white/5 rounded-lg border border-white/10 cursor-pointer transition hover:bg-white/10"
          onClick={handleTemplateClick}
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            💡 MDX Template
          </h2>
          <pre className="bg-black/30 text-sm text-green-200 p-4 rounded-lg whitespace-pre-wrap font-mono overflow-auto">
            {mdxTemplate}
          </pre>
          <p className="mt-2 text-sm text-gray-400">
            📋 Click above to copy template to clipboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
