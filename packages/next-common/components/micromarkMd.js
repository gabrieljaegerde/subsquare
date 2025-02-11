import React, { useRef } from "react";
import styled from "styled-components";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import sanitizeHtml from "sanitize-html";
import { useEffect } from "react";
import { no_scroll_bar } from "../styles/componentCss";

const Wrapper = styled.div`
  &.markdown-content {
    color: #000;
    max-width: 48.5rem;
    word-break: normal;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: 500;

      :not(:first-child) {
        margin-top: 0.25rem;
      }

      :not(:last-child) {
        margin-bottom: 0.25rem;
      }

      :last-child {
        margin-bottom: 0;
      }
    }

    h1 {
      line-height: 2rem;
      font-size: 1.25rem;
    }

    h2 {
      line-height: 1.875rem;
      font-size: 1.1875rem;
    }

    h3 {
      line-height: 1.75rem;
      font-size: 1.125rem;
    }

    h4 {
      line-height: 1.625rem;
      font-size: 1rem;
    }

    h5 {
      line-height: 1.5rem;
      font-size: 0.9375rem;
    }

    h6 {
      line-height: 1.375rem;
      font-size: 0.875rem;
    }

    p,
    li {
      max-width: 48.5rem;
      font-size: 0.875rem;
      line-height: 1.375rem;
      word-break: break-word;
    }

    ol,
    ul {
      padding-left: 1.25rem;
    }

    ul {
      list-style-type: disc;
    }

    blockquote {
      margin: 0;
      padding-left: 0.75rem;
      border-left: 4px solid #eee;
    }

    pre {
      ${no_scroll_bar};
      * {
        font-family: i-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
          Liberation Mono, monospace !important;
      }
      margin: 8px 0;
      padding: 0 1rem;
      background: #f5f8fa !important;
      border-radius: 0.25rem;
      white-space: pre-wrap !important;
      overflow-x: scroll;

      > code {
        padding: 0 !important;
        background: transparent !important;
        white-space: pre-wrap !important;
        span.identifier {
          white-space: nowrap !important;
        }
      }
    }

    code {
      font-family: i-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
        Liberation Mono, monospace !important;
      ${no_scroll_bar};
      max-width: 100%;
      padding: 0 0.25rem;
      background: #f5f8fa !important;
      border-radius: 0.25rem;
      white-space: nowrap !important;
      word-break: keep-all;
      overflow-x: scroll;
      display: inline-flex;
    }

    a {
      color: #1f70c7;
    }

    a.disabled-link {
      color: #506176;
      pointer-events: none;
    }

    img {
      max-width: 100%;
    }

    p a::selection {
      background-color: transparent !important;
      color: inherit;
    }

    th,
    td {
      border: 1px solid #e0e4eb;
    }

    table {
      margin: 8px 0;
      border-collapse: collapse;
      max-width: 100%;
      overflow: auto;
      display: block;
    }

    th {
      padding: 10px 16px;
      background: ${(props) => props.theme.grey100Bg};
      font-weight: bold;
      font-size: 14px;
      color: #1e2134;
      min-width: 100px;
    }

    td {
      padding: 10px 16px;
      font-size: 14px;
      color: #1e2134;
    }
  }
`;

export default function MicromarkMd({ md = "", contentVersion = "" }) {
  const ref = useRef();

  let displayContent = md;
  if (contentVersion === "2") {
    displayContent = md.replace(/\n+/g, function (ns) {
      if (ns.length === 1) return "  " + ns;
      return ns;
    });
  }
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/prism.min.js";
    document.body.appendChild(script);
  }, []);

  const html = micromark(displayContent, {
    allowDangerousHtml: true,
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });

  const cleanHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "iframe",
      "br",
      "ins",
      "del",
    ]),
    allowedAttributes: {
      img: ["src", "size", "width", "height"],
      iframe: ["src", "width", "height"],
      a: ["href", "rel", "target"],
      "*": ["class"],
      td: ["align"],
      th: ["align"],
    },
  });

  return (
    <Wrapper
      ref={ref}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
