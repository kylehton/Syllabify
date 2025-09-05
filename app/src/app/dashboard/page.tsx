"use client";
import PDFUploader from "./components/resume-upload"

export default function Dashboard() {

    const handleText = (text: string) => {
        console.log("Extracted PDF text:", text);
        // make OpenAI API call here
      };

    return (
        <div className='flex justify-center'>
            <PDFUploader onUpload={handleText}/>
        </div>
    )
}