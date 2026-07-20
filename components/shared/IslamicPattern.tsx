"use client";

type IslamicPatternTone = "green" | "gold";

type IslamicPatternProps = {
  tone?: IslamicPatternTone;
  opacity?: number;
  patternSize?: number;
  className?: string;
};

const TONE_COLORS: Record<IslamicPatternTone, string> = {
  green: "#4F8A5B",
  gold: "#D4AF37",
};

/**
 * Islamic geometric star-pattern background.
 *
 * The component uses an inline SVG pattern instead of repeating CSS lines,
 * which creates a result much closer to the supplied reference image.
 *
 * Important:
 * The parent element should use `relative` and usually `overflow-hidden`.
 */
export default function IslamicPattern({
  tone = "green",
  opacity = 0.18,
  patternSize = 132,
  className = "",
}: IslamicPatternProps) {
  const strokeColor = TONE_COLORS[tone];

  const patternSvg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="160"
      height="160"
      viewBox="0 0 160 160"
    >
      <g
        fill="none"
        stroke="${strokeColor}"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="miter"
      >
        <!-- Main eight-point star -->
        <path d="
          M80 0
          L96 24
          L120 16
          L128 40
          L160 40
          L136 64
          L152 80
          L136 96
          L160 120
          L128 120
          L120 144
          L96 136
          L80 160
          L64 136
          L40 144
          L32 120
          L0 120
          L24 96
          L8 80
          L24 64
          L0 40
          L32 40
          L40 16
          L64 24
          Z
        " />

        <!-- Inner star -->
        <path d="
          M80 24
          L92 44
          L116 44
          L104 64
          L120 80
          L104 96
          L116 116
          L92 116
          L80 136
          L68 116
          L44 116
          L56 96
          L40 80
          L56 64
          L44 44
          L68 44
          Z
        " />

        <!-- Central octagon -->
        <path d="
          M64 56
          L96 56
          L104 64
          L104 96
          L96 104
          L64 104
          L56 96
          L56 64
          Z
        " />

        <!-- Top-left connecting geometry -->
        <path d="
          M0 0
          L24 0
          L40 16
          L32 40
          L0 40
        " />

        <path d="
          M0 0
          L0 24
          L24 48
        " />

        <!-- Top-right connecting geometry -->
        <path d="
          M160 0
          L136 0
          L120 16
          L128 40
          L160 40
        " />

        <path d="
          M160 0
          L160 24
          L136 48
        " />

        <!-- Bottom-left connecting geometry -->
        <path d="
          M0 160
          L24 160
          L40 144
          L32 120
          L0 120
        " />

        <path d="
          M0 160
          L0 136
          L24 112
        " />

        <!-- Bottom-right connecting geometry -->
        <path d="
          M160 160
          L136 160
          L120 144
          L128 120
          L160 120
        " />

        <path d="
          M160 160
          L160 136
          L136 112
        " />

        <!-- Horizontal extensions -->
        <path d="M0 80 L40 80" />
        <path d="M120 80 L160 80" />

        <!-- Vertical extensions -->
        <path d="M80 0 L80 40" />
        <path d="M80 120 L80 160" />

        <!-- Decorative corner diamonds -->
        <path d="
          M24 48
          L40 40
          L56 56
          L40 64
          Z
        " />

        <path d="
          M136 48
          L120 40
          L104 56
          L120 64
          Z
        " />

        <path d="
          M24 112
          L40 120
          L56 104
          L40 96
          Z
        " />

        <path d="
          M136 112
          L120 120
          L104 104
          L120 96
          Z
        " />
      </g>
    </svg>
  `;

  const encodedPattern = encodeURIComponent(patternSvg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Main geometric pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodedPattern}")`,
          backgroundRepeat: "repeat",
          backgroundPosition: "center top",
          backgroundSize: `${patternSize}px ${patternSize}px`,
        }}
      />

      {/* Soft light variation */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 18% 25%,
              rgba(255, 255, 255, 0.09) 0%,
              transparent 30%
            ),
            radial-gradient(
              circle at 82% 72%,
              rgba(255, 255, 255, 0.07) 0%,
              transparent 32%
            ),
            radial-gradient(
              circle at 52% 45%,
              rgba(255, 255, 255, 0.035) 0%,
              transparent 42%
            )
          `,
        }}
      />

      {/* Subtle dark vignette */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.12) 0%,
              transparent 18%,
              transparent 82%,
              rgba(0, 0, 0, 0.12) 100%
            ),
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.08) 0%,
              transparent 28%,
              transparent 72%,
              rgba(0, 0, 0, 0.12) 100%
            )
          `,
        }}
      />

      {/* Fine texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.025) 0px,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px,
              transparent 3px
            )
          `,
        }}
      />
    </div>
  );
}
