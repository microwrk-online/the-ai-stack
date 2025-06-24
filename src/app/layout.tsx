import Header from "@/components/Header";
import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Your Site Title",
  description: "AI + Side Hustle Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
