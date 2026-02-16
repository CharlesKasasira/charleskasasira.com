import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { initGA, logPageView } from '../utils/analytics'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  );
}
