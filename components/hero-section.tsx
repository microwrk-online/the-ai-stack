"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeedBack from "./feedback";
import clsx from "clsx";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-black from-background via-background to-primary/5 py-20 sm:py-20">
      {/* Grid Background */}
      <div className="absolute inset-0 h-[20rem] bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-foreground/80">
                Placement Isn’t Privilege. It’s Strategy.
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            <span className="block">
              <span
                className="glitch block relative"
                data-text="Redefining What It Means to Get Placed"
              >
                Redefining What It Means to Get Placed
              </span>
            </span>
            <span className="text-4xl bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              No IIT. No Problem
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mb-10 max-w-5xl text-lg text-foreground/70 sm:text-xl"
          >
            This platform is for students who are done watching resumes get
            ghosted because of a college name. This is your{" "}
            <span className="font-semibold text-foreground">unfair edge</span>—
            a roadmap, a wake-up call, and a bold push to build the career you
            *actually* deserve. If you&apos;re lost in a Tier-3 college with no
            placement cell and even less hope—this is for you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mb-10 max-w-5xl text-lg text-foreground/70 sm:text-xl"
          >
            <span className="text-foreground font-medium">Mission:</span> To
            help non-IIT students break barriers, master real skills, and prove
            that your success is about execution—not elitism.
          </motion.p>

          {/* Feedback + Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div className="flex w-fit from-primary to-primary/80 transform transition-transform hover:scale-105 hover:shadow-lg">
              <FeedBack />
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 px-8 text-base transform transition-transform hover:scale-105 hover:shadow-lg"
              onClick={() => {
                setTimeout(() => {
                  const section = document.getElementById("blog-list");
                  if (section) {
                    section.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }, 100);
              }}
            >
              Start Reading
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Glitch CSS */}
      {/* <style jsx>{`
        .glitch {
          position: relative;
          color: white;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          width: 100%;
          overflow: hidden;
        }
        .glitch::before {
          animation: glitchTop 2s infinite linear alternate-reverse;
          top: -1px;
          color: #f0f;
        }
        .glitch::after {
          animation: glitchBottom 1.5s infinite linear alternate-reverse;
          top: 1px;
          color: #0ff;
        }
        @keyframes glitchTop {
          0% {
            clip-path: inset(0 0 80% 0);
            transform: translateX(-2px);
          }
          20% {
            clip-path: inset(0 0 70% 0);
            transform: translateX(2px);
          }
          40% {
            clip-path: inset(0 0 60% 0);
            transform: translateX(-1px);
          }
          100% {
            clip-path: inset(0 0 90% 0);
            transform: translateX(3px);
          }
        }
        @keyframes glitchBottom {
          0% {
            clip-path: inset(80% 0 0 0);
            transform: translateX(2px);
          }
          20% {
            clip-path: inset(70% 0 0 0);
            transform: translateX(-2px);
          }
          40% {
            clip-path: inset(60% 0 0 0);
            transform: translateX(1px);
          }
          100% {
            clip-path: inset(90% 0 0 0);
            transform: translateX(-3px);
          }
        }
      `}</style> */}
    </section>
  );
}
