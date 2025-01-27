import { NextRequest, NextResponse } from "next/server";
import { parse } from "node-html-parser";

function rewriteUrl(originalUrl: string, baseUrl: string): string {
  try {
    // Handle empty or invalid URLs
    if (!originalUrl?.trim()) return originalUrl;

    // Don't rewrite data URLs or anchors
    if (originalUrl.startsWith("data:") || originalUrl.startsWith("#")) {
      return originalUrl;
    }

    // Create absolute URL
    const absoluteUrl = new URL(originalUrl, baseUrl);
    // Return proxied URL
    return `/api/proxy?url=${encodeURIComponent(absoluteUrl.toString())}`;
  } catch {
    return originalUrl;
  }
}

async function rewriteHtml(html: string, baseUrl: string): Promise<string> {
  const root = parse(html);

  // Rewrite element attributes
  const elementsToRewrite = {
    // a: ["href"], // don't rewrite href as it's handled by the iframe
    img: ["src", "srcset"],
    script: ["src"],
    link: ["href"],
    video: ["src", "poster"],
    audio: ["src"],
    source: ["src", "srcset"],
    form: ["action"],
    iframe: ["src"],
    embed: ["src"],
    object: ["data"],
  };

  // Process each element type and its attributes
  Object.entries(elementsToRewrite).forEach(([tag, attrs]) => {
    root.querySelectorAll(tag).forEach((element) => {
      attrs.forEach((attr) => {
        const value = element.getAttribute(attr);
        if (value) {
          if (attr === "srcset") {
            // Handle srcset attribute specially
            const rewrittenSrcSet = value
              .split(",")
              .map((src) => {
                const [url, size] = src.trim().split(/\s+/);
                return `${rewriteUrl(url, baseUrl)}${size ? " " + size : ""}`;
              })
              .join(", ");
            element.setAttribute(attr, rewrittenSrcSet);
          } else {
            element.setAttribute(attr, rewriteUrl(value, baseUrl));
          }
        }
      });
    });
  });

  // Rewrite meta refresh
  root.querySelectorAll('meta[http-equiv="refresh"]').forEach((element) => {
    const content = element.getAttribute("content");
    if (content) {
      const match = content.match(/url=(.*)/i);
      if (match) {
        const url = match[1];
        element.setAttribute(
          "content",
          content.replace(url, rewriteUrl(url, baseUrl)),
        );
      }
    }
  });

  // Process all inline styles
  const stylePromises: Promise<void>[] = [];

  // Rewrite inline styles
  root.querySelectorAll("*[style]").forEach((element) => {
    const style = element.getAttribute("style");
    if (style) {
      stylePromises.push(
        rewriteCss(style, baseUrl).then((rewrittenStyle) => {
          element.setAttribute("style", rewrittenStyle);
        }),
      );
    }
  });

  // Rewrite <style> tags
  root.querySelectorAll("style").forEach((element) => {
    stylePromises.push(
      rewriteCss(element.textContent || "", baseUrl).then((rewrittenCss) => {
        element.textContent = rewrittenCss;
      }),
    );
  });

  // Wait for all CSS rewrites to complete
  await Promise.all(stylePromises);

  // Rewrite data-* attributes that might contain URLs
  root.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes)
      .filter(
        (attr) =>
          attr.name.startsWith("data-") &&
          (attr.name.includes("src") || attr.name.includes("url")),
      )
      .forEach((attr) => {
        element.setAttribute(attr.name, rewriteUrl(attr.value, baseUrl));
      });
  });

  // Rewrite inline scripts
  root.querySelectorAll("script:not([src])").forEach((element) => {
    element.textContent = rewriteJs(element.textContent || "", baseUrl);
  });

  return root.toString();
}

async function rewriteCss(css: string, baseUrl: string): Promise<string> {
  try {
    const cssTree = await import("css-tree");
    const ast = cssTree.parse(css);

    cssTree.walk(ast, {
      visit: "Url",
      enter: (node: any) => {
        if (node.value.type === "String") {
          // Remove quotes from the URL
          let url = node.value.value.replace(/['"]/g, "");
          url = rewriteUrl(url, baseUrl);
          node.value.value = `"${url}"`;
        } else if (node.value.type === "Raw") {
          node.value.value = rewriteUrl(node.value.value, baseUrl);
        }
      },
    });

    return cssTree.generate(ast);
  } catch {
    // If parsing fails, do basic URL rewriting
    return css.replace(
      /url\(['"]?([^'"\)]+)['"]?\)/g,
      (match, url) => `url("${rewriteUrl(url, baseUrl)}")`,
    );
  }
}

function rewriteJs(js: string, baseUrl: string): string {
  // Basic string literal URL rewriting - this is a simplified approach
  // For production, consider using a proper JS parser like babel or acorn
  return js.replace(
    /(['"`])((?:\/|https?:\/\/)[\w\d./?=#-]+)\1/g,
    (match, quote, url) => {
      if (url.includes("api/proxy")) return match;
      return `${quote}${rewriteUrl(url, baseUrl)}${quote}`;
    },
  );
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    let body = await response.text();

    // Rewrite content based on content type
    if (contentType.includes("html")) {
      body = await rewriteHtml(body, url);
    } else if (
      contentType.includes("javascript") ||
      contentType.includes("js")
    ) {
      body = rewriteJs(body, url);
    } else if (contentType.includes("css")) {
      body = await rewriteCss(body, url);
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType || "text/html",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}
