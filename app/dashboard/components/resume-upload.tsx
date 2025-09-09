"use client";
import { useState } from "react";
import { Button } from "../../components/ui/button"
import { useAuth } from "../../context/GoogleAuthContext"

type PDFUploadProps = { onUpload : (text:string) => void }

export default function PDFUploader({onUpload}: PDFUploadProps ) {
  const { logout } = useAuth();
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
    <div>
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
      <Button 
        onClick={logout}
        variant='destructive'
        className="fixed bottom-10 right-10 cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-600 hover:text-white hover:scale-105 transition-transform transition-colors text-sm font-medium">
          <svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign Out
      </Button>
  </div>
  );
}
