import { socialLinks } from "@/data/portfolio";

function SocialIcon({ id }) {
  if (id === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 5.5h18v13H3z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (id === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M5.34 7.43a2.06 2.06 0 1 0 0-4.12 2.06 2.06 0 0 0 0 4.12ZM3.86 20.45h2.95V9H3.86v11.45ZM9.35 9v11.45h3.55v-5.67c0-1.49.28-2.94 2.14-2.94 1.82 0 1.85 1.71 1.85 3.04v5.57h3.55v-6.29c0-3.08-.66-5.45-4.27-5.45-1.73 0-2.89.95-3.37 1.85h-.04V9H9.35Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7A11.5 11.5 0 0 0 8.36 23.1c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

export default function HeroSocials() {
  return (
    <nav
      className="ah-socials reveal"
      style={{ animationDelay: ".52s" }}
      aria-label="Contact and social links"
    >
      {socialLinks.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <a
            key={link.id}
            className="ah-social-link"
            href={link.href}
            aria-label={link.label}
            title={link.label}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            <SocialIcon id={link.id} />
          </a>
        );
      })}
    </nav>
  );
}
