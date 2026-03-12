"use client";

import { useState } from "react";

export default function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    onUpload(data.url); // returns Cloudinary URL to parent
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
