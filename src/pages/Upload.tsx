"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

export default function Upload() {
  const [image, setImage] = useState<File | null>(null);
  const [desc, setDesc] = useState("");

  const handleUpload = async () => {
    if (!image || !desc) {
      toast.error("Please provide both image and description");
      return;
    }
  
    const fileName = `${Date.now()}-${image.name}`;
  
    const { error: storageError } = await supabase.storage
      .from("reports")
      .upload(fileName, image);
  
    if (storageError) {
      toast.error("Image upload failed");
      console.error(storageError);
      return;
    }
  
    const imageUrl = supabase.storage
      .from("reports")
      .getPublicUrl(fileName).data.publicUrl;
  
    const { error: dbError } = await supabase.from("uploads").insert([
      { desc, image_url: imageUrl },
    ]);
  
    if (dbError) {
      toast.error("Data insert failed");
      console.error(dbError);
    } else {
      toast.success("Uploaded successfully!");
      setImage(null);
      setDesc("");
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-2xl font-bold">Upload</h2>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full rounded border border-gray-300 p-2"
          />

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="w-full rounded border border-gray-300 p-2"
          />

          <button
            onClick={handleUpload}
            className="w-full rounded bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
