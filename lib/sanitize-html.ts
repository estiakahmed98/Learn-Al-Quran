import sanitizeHtml from "sanitize-html";

/**
 * Allowlist sanitizer for rich-text HTML (blog posts, newsletters) that is
 * stored in the database and later rendered with dangerouslySetInnerHTML.
 * Apply this both when saving admin-submitted content and again at render
 * time as defense-in-depth.
 */
export function sanitizeRichHtml(html: string): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "b", "em", "i", "u", "s", "sub", "sup", "mark",
      "ul", "ol", "li",
      "blockquote", "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
      "span", "div", "code", "pre"
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      "*": ["class", "style"]
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        color: [/^#[0-9a-fA-F]{3,8}$/],
        "background-color": [/^#[0-9a-fA-F]{3,8}$/]
      }
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"]
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank"
      })
    }
  });
}
