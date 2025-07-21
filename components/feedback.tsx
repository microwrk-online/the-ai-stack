"use client";

import React, { useState, useEffect } from "react";
import { Heart, ThumbsDown } from "lucide-react";

export default function FeedBack({ itemId = "default-item" }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null); // 'like', 'dislike', or null
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get or create session ID for tracking user votes
  const getOrCreateSessionId = () => {
    if (typeof window === "undefined") return null;

    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId =
        "user_" + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  };

  // Fetch initial counts and user's previous vote
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);

        // Get feedback counts
        const countsResponse = await fetch(`/api/feedback?itemId=${itemId}`);
        if (!countsResponse.ok) throw new Error("Failed to fetch counts");
        const countsData = await countsResponse.json();

        setLikes(countsData.likes);
        setDislikes(countsData.dislikes);

        // Get user's previous vote
        const sessionId = getOrCreateSessionId();
        if (sessionId) {
          const userVoteResponse = await fetch(
            `/api/feedback/user?itemId=${itemId}&sessionId=${sessionId}`
          );
          if (userVoteResponse.ok) {
            const userData = await userVoteResponse.json();
            setUserVote(userData.vote);
          }
        }
      } catch (error) {
        console.error("Failed to fetch feedback data:", error);
        setError("Failed to load feedback data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  const handleVote = async (voteType: string) => {
    setError(null);

    // Optimistic updates - update UI immediately
    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevUserVote = userVote;

    let newLikes = likes;
    let newDislikes = dislikes;
    let newUserVote = null;

    // Calculate new values optimistically
    if (prevUserVote === "like") newLikes--;
    if (prevUserVote === "dislike") newDislikes--;

    if (voteType !== prevUserVote) {
      if (voteType === "like") newLikes++;
      if (voteType === "dislike") newDislikes++;
      newUserVote = voteType;
    }

    // Update UI immediately
    setLikes(newLikes);
    setDislikes(newDislikes);
    if (
      newUserVote === "like" ||
      newUserVote === "dislike" ||
      newUserVote === null
    ) {
      setUserVote(newUserVote);
    }

    try {
      const sessionId = getOrCreateSessionId();
      if (!sessionId) throw new Error("Unable to create session");

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          sessionId,
          voteType,
          previousVote: prevUserVote,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit vote");

      const data = await response.json();

      // Sync with server response (in case of discrepancy)
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserVote(data.userVote);
    } catch (error) {
      console.error("Failed to submit vote:", error);
      setError("Failed to submit vote");

      // Revert optimistic updates on error
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserVote(prevUserVote);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-10 items-center gap-4 bg-neutral-100 p-6 rounded-lg shadow-sm border">
        <div className="text-base font-medium text-black">
          Was this helpful?
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-gray-100">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-400">-</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-gray-100">
            <ThumbsDown className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-400">-</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4 p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-red-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-10 items-center gap-4 bg-neutral-100 pl-6 pt-6 pb-6 pr-2 rounded-lg shadow-sm border">
      <div className="text-base font-medium text-black">Was this helpful?</div>

      <div className="flex gap-2">
        <button
          onClick={() => handleVote("like")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-150 ${
            userVote === "like"
              ? "bg-red-500 text-white border-red-500"
              : "bg-white text-gray-600 border-gray-300 hover:bg-red-50 hover:border-red-300"
          } cursor-pointer`}
        >
          <Heart
            className={`w-5 h-5 ${userVote === "like" ? "fill-current" : ""}`}
          />
          <span className="font-medium">{likes}</span>
        </button>

        <button
          onClick={() => handleVote("dislike")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-150 ${
            userVote === "dislike"
              ? "bg-gray-500 text-white border-gray-500"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          } cursor-pointer`}
        >
          <ThumbsDown
            className={`w-5 h-5 ${userVote === "dislike" ? "fill-current" : ""}`}
          />
          <span className="font-medium">{dislikes}</span>
        </button>
      </div>
    </div>
  );
}
