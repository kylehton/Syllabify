"use client";
import { useState } from "react";
import { Button } from "../../components/ui/button"

type PDFUploadProps = { onUpload : (text:string) => void }

export default function PDFUploader({onUpload}: PDFUploadProps ) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
        setError("No file selected.")
        setFile(null)
        return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF.");
      return;
    }
    
    setError(null);
    setFile(selectedFile ? selectedFile : null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: file,
      });

      const data = await res.json();
      onUpload(data.text); 
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center m-10 space-y-4'>
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <div className='flex flex-row space-x-6'>
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />

      <label 
        htmlFor="file-upload" 
        className="px-4 py-2 bg-white text-black shadow-md border-1 border-zinc-100 rounded-lg cursor-pointer hover:bg-zinc-700 hover:text-white transition-colors inline-row text-center"
      >
        Select file...
      </label>

      <div className="text-sm text-gray-600 flex flex-col justify-center">
        {file ? file.name : "No file chosen"}
      </div>
      </div>
            
      {error && <p className="text-red-500">{error}</p>}
      <Button className="bg-black mt-4 transition-transform ease-in-out hover:scale-105 cursor-pointer" onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload PDF"}
      </Button>
    </div>
  );
}
