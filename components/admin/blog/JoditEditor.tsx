"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { IAllProps } from "@tinymce/tinymce-react";

const TinyMCEEditor = dynamic<IAllProps>(
  async () => {
    const { Editor } = await import("@tinymce/tinymce-react");

    // TinyMCE's class component declares a broader propTypes shape than the
    // React 18 types accepted by next/dynamic, although its props are valid.
    return Editor as unknown as React.ComponentType<IAllProps>;
  },
  { ssr: false },
);

interface TinymceEditorProps {
  placeholder?: string;
  initialValue?: string;
  onContentChange?: (content: string) => void;
  height?: string | number;
}

const TinymceEditor: React.FC<TinymceEditorProps> = ({
  placeholder = "Start typing...",
  initialValue = "",
  onContentChange,
  height = "300px",
}) => {
  const [content, setContent] = useState(initialValue);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const allowTinyMceDialogs = (event: FocusEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        target.closest(
          ".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root",
        )
      ) {
        event.stopImmediatePropagation();
      }
    };

    document.addEventListener("focusin", allowTinyMceDialogs, true);

    return () => {
      document.removeEventListener("focusin", allowTinyMceDialogs, true);
    };
  }, []);

  const handleChange = (value: string) => {
    setContent(value);
    onContentChange?.(value);
  };

  return (
    <div style={{ height }}>
      <TinyMCEEditor
        apiKey="1d2imqlpa6a5au7mxorkaasoa4b9c24wm0pzzxbua1rdpg7y"
        value={content}
        onEditorChange={handleChange}
        init={{
          height,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | removeformat | help",
          placeholder,
        }}
      />
    </div>
  );
};

export default TinymceEditor;
