"use client";
import { useState } from "react";

type PDFUploadProps = { onUpload : (text:string) => void }

export default function PDFUploader({onUpload}: PDFUploadProps ) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
        setError("File error.")
        setFile(null)
        return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
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
    <div className='flex flex-col justify-center space-center align-center m-10'>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}
