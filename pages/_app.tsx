import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionConfig } from "framer-motion";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <MotionConfig reducedMotion="user">
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights />
      </MotionConfig>
    </ThemeProvider>
  );
}
