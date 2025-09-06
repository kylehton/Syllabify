"use client";
import PDFUploader from "./components/resume-upload"
import { useState } from 'react'

export default function Dashboard() {

    interface EventItem {
        name: string;
        date: string; // RFC3339 date string
        type: "exam" | "homework" | "project";
    }
      
    const [events, setEvents] = useState<EventItem[] | null>(null);

    const generateEvents = async (text: string) => {
        const res = await fetch ('/api/openai', {
            method: 'POST',
            body: text
        });
        const eventJSON = await res.json();
        setEvents(eventJSON.response)
        return
    }

    const handleText = (text: string) => {
        console.log("Extracted PDF text:", text);
        generateEvents(text)
      };

    if (events == null)
    return (
        <div className='flex justify-center'>
            <PDFUploader onUpload={handleText}/> 
        </div>
    )
}