"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

// 1️⃣  Supabase client (add to your repo)
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [preview, setPreview] = useState("");
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Uploading...");

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file.name.endsWith(".mdx")) {
      toast.error("Only .mdx files allowed");
      return;
    }

    // 2️⃣  Upload straight to Supabase Storage
    const { data, error } = await supabase.storage
      .from("letters") // bucket name
      .upload(file.name, file, {
        cacheControl: "3600",
        upsert: true, // overwrite if exists
      });

    if (error) {
      setStatus(`❌ ${error.message}`);
      toast.error(`Upload failed: ${error.message}`);
      return;
    }

    setStatus(`✅ Uploaded: ${data.path}`);
    setUploadedFile(data.path);
    toast.success(`📝 Blog uploaded: ${data.path}`);

    // Preview
    setPreview(await file.text());
  };

  const handleTemplateClick = async () => {
    await navigator.clipboard.writeText(mdxTemplate);
    toast.success("📋 MDX template copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e1a] via-[#141421] to-[#0e0e1a] text-white px-6 py-10">
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">📤 Upload Blog</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
        >
          🏠 Back to Home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-xl shadow-xl"
      >
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
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-lg transition hover:scale-105 hover:shadow-lg"
          >
            Upload
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-green-400">{status}</p>
        )}
        {uploadedFile && (
          <p className="text-center text-sm text-gray-300 mt-2">
            🎉 Your blog file{" "}
            <span className="font-semibold">{uploadedFile}</span> has been
            uploaded successfully.
          </p>
        )}

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

        {preview && (
          <div className="mt-10 bg-black/40 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">📄 Live Preview</h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
              {preview}
            </pre>
          </div>
        )}
      </motion.div>
    </div>
  );
}
