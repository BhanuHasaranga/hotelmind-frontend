interface LogoProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * HotelMind brand mark — five bars reading as a bar chart that also resolves
 * into an "HM" ligature: bar 1 is H's left stem, bar 2 its crossbar, the wide
 * centre bar is the stem shared by H and M, and bars 4-5 close the M.
 *
 * Drawn in currentColor so a single component serves every variant: the green
 * mark inherits `text-primary`, the knockout inherits `text-primary-foreground`
 * on a dark fill, and single-colour print inherits the surrounding ink. The
 * static files in /public exist for favicons and external embeds only.
 */
export function Logo({ className, size = 24, title }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
    >
      {title && <title>{title}</title>}
      <rect x="0" y="0" width="2" height="24" />
      <rect x="3" y="12" width="6" height="12" />
      <rect x="10" y="0" width="4" height="24" />
      <rect x="17" y="12" width="2" height="12" />
      <rect x="22" y="0" width="2" height="24" />
    </svg>
  );
}
