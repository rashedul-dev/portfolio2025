"use client";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useImperativeHandle, forwardRef, useRef } from "react";

export type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (html: string) => void;
};

interface RichTextEditorProps {
  initialHtml?: string;
  height?: number;
}

// Custom line height blot
const LineHeightStyle: any = Quill.import("attributors/style/size");
LineHeightStyle.whitelist = ["1", "1.2", "1.4", "1.6", "1.8", "2", "2.5", "3"];
Quill.register(LineHeightStyle, true);

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ initialHtml = "", height = 400 }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
      if (!editorContainerRef.current || quillRef.current) return;

      const container = editorContainerRef.current;
      container.innerHTML = "";

      const editor = document.createElement("div");
      container.appendChild(editor);

      quillRef.current = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "blockquote", "code-block"],
              [{ "line-height": ["1", "1.2", "1.4", "1.6", "1.8", "2", "2.5", "3"] }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["clean"],
            ],
          },
        },
        placeholder:
          "Start writing your amazing content here...\nPress Enter for new line, Shift+Enter for line break.",
      });

      // Add comprehensive CSS for proper sizing and overflow
      const style = document.createElement("style");
      style.textContent = `
        /* Container styling */
        .ql-container {
          height: 100% !important;
          overflow: hidden !important;
          border: none !important;
          border-radius: 0 0 12px 12px !important;
        }
        
        /* Editor content area */
        .ql-editor {
          line-height: 1.6 !important;
          min-height: ${height - 100}px !important;
          max-height: ${height - 100}px !important;
          height: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          padding: 20px !important;
          box-sizing: border-box !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
        }
        
        /* Ensure content stays within bounds */
        .ql-editor * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Images and other media */
        .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        /* Long words and URLs */
        .ql-editor a,
        .ql-editor code,
        .ql-editor pre {
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* Code blocks */
        .ql-editor pre {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }
        
        /* Paragraph spacing */
        .ql-editor p {
          margin-bottom: 1em !important;
          word-wrap: break-word !important;
        }
        
        .ql-editor p + p {
          margin-top: 0.5em !important;
        }
        
        /* Headings */
        .ql-editor h1, 
        .ql-editor h2, 
        .ql-editor h3 {
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
          word-wrap: break-word !important;
        }
        
        /* Line breaks */
        .ql-editor br {
          content: "" !important;
          display: block !important;
          margin-top: 0.5em !important;
        }
        
        /* Toolbar styling */
        .ql-toolbar {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          background: hsl(var(--muted) / 0.3) !important;
          padding: 12px 16px !important;
          border-radius: 12px 12px 0 0 !important;
        }
        
        /* Scrollbar styling */
        .ql-editor::-webkit-scrollbar {
          width: 6px;
        }
        
        .ql-editor::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 3px;
        }
        
        .ql-editor::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 3px;
        }
        
        .ql-editor::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `;
      container.appendChild(style);

      if (initialHtml) {
        quillRef.current.root.innerHTML = initialHtml;
      }

      // Add keyboard handler for better line breaks
      quillRef.current.root.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          setTimeout(() => {
            const selection = quillRef.current?.getSelection();
            if (selection) {
              quillRef.current?.formatLine(selection.index, 1, "line-height", "1.6");
            }
          }, 10);
        }
      });

      // Handle window resize to maintain proper sizing
      const handleResize = () => {
        if (quillRef.current && container) {
          const editor = container.querySelector(".ql-editor") as HTMLElement;
          if (editor) {
            editor.style.maxHeight = `${height - 100}px`;
            editor.style.minHeight = `${height - 100}px`;
          }
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (quillRef.current) {
          quillRef.current = null;
        }
        if (container) {
          container.innerHTML = "";
        }
      };
    }, [height]);

    useEffect(() => {
      if (quillRef.current && initialHtml !== undefined) {
        const currentContent = quillRef.current.root.innerHTML;
        if (currentContent !== initialHtml) {
          quillRef.current.root.innerHTML = initialHtml;
        }
      }
    }, [initialHtml]);

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return quillRef.current?.root.innerHTML || "";
      },
      setContent: (html: string) => {
        if (quillRef.current) {
          quillRef.current.root.innerHTML = html;
        }
      },
    }));

    return (
      <div className="space-y-2">
        <div
          ref={editorContainerRef}
          className="rich-text-editor w-full border border-border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden"
          style={{
            height: `${height}px`,
            display: "flex",
            flexDirection: "column",
          }}
        />
        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: Press <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">Enter</kbd> for new paragraph,
          <kbd className="px-1 py-0.5 text-xs border rounded bg-muted mx-1">Shift + Enter</kbd> for line break
        </p>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
