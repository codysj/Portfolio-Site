import Link from "next/link";
import { Albert_Sans } from "next/font/google";
import "@/components/home-v2/home-v2.css";
import styles from "./not-found.module.css";

const albert = Albert_Sans({ subsets: ["latin"], variable: "--hv-font", display: "swap" });

/* White Relief 404: same topbar, headline and button as the home hero. The
   status sits in the topbar (where / shows its own) so nothing kicks the h1. */
export default function NotFound() {
  return (
    <div className={`${albert.variable} hv-root ${styles.page}`}>
      <div className="hv-topbar hv-reveal" style={{ animationDelay: ".05s" }}>
        <Link href="/" className={styles.brand}>Cody Jung</Link>
        <span><span className="hv-dot" />404 / Page not found</span>
      </div>
      <main className={styles.content}>
        <h1 className="hv-h1 hv-reveal" style={{ animationDelay: ".15s" }}>Nothing <em>here.</em></h1>
        <p className="hv-sub hv-reveal" style={{ animationDelay: ".28s" }}>The page you’re looking for is unavailable.</p>
        <div className="hv-cta hv-reveal" style={{ animationDelay: ".4s" }}>
          <Link href="/" className="hv-btn hv-btn-primary">
            Back to home
            <svg className="hv-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
