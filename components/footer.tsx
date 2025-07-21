"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Brain, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function Footer() {
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Successfully subscribed to newsletter!");
    form.reset();
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full dark:border-gray-700 bg-gray-200 text-black dark:bg-[#0e0e1a] dark:text-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left section */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="hidden font-bold sm:block">
                <span className="text-2xl text-foreground">
                  Unplaced University
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Because your college ain’t placing you, we bring weekly roadmaps,
              job hacks, and AI tools straight to your inbox.
            </p>
          </div>

          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Unplaced University. All rights
            reserved.
          </p>
        </div>

        {/* Right section */}
        <div className="flex flex-col justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          {...field}
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 bg-gradient-to-r from-primary to-primary/80 px-8 text-base transition-all hover:scale-105 hover:shadow-lg sm:w-auto"
                >
                  Subscribe
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </form>
          </Form>
          <hr />
          <p
            className="mt-16 text-xs"
            style={{ fontStyle: "italic", color: "gray" }}
          >
            ✍️ Written by <strong>Joshua Daniel</strong>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
