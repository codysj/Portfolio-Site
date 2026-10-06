import Link from "next/link";
import Atmosphere from "@/components/hero/Atmosphere";
import "@/components/hero/hero.css";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={`ah-root ${styles.page}`}>
      <Atmosphere />
      <div className="ah-topbar">
        <Link href="/" className={styles.brand}>Cody Jung</Link>
      </div>
      <div className={styles.content}>
        <p className="ah-eyebrow">404 / Page not found</p>
        <h1 className="ah-h1">Nothing <em>here.</em></h1>
        <p className="ah-sub">The page you’re looking for is unavailable.</p>
        <div className="ah-cta">
          <Link href="/" className="ah-btn ah-btn-primary">
            Back to home <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
