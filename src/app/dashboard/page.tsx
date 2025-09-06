"use client";
import PDFUploader from "./components/resume-upload"
import { useState } from 'react'
import { DataTableDemo } from "./components/event-table";

export default function Dashboard() {

    interface EventItem {
        name: string;
        date: string; // RFC3339 date string
        type: "exam" | "homework" | "project";
    }

    const handleDeleteEvent = (item: EventItem) => {
        setEvents(prevEvents => 
          prevEvents?.filter(event => 
            !(event.name === item.name && 
              event.date === item.date && 
              event.type === item.type)
          ) || null
        );
      };
    
      const handleUpdateEvent = (oldItem: EventItem, newItem: EventItem) => {
        setEvents(prevEvents => 
          prevEvents?.map(event => 
            (event.name === oldItem.name && 
             event.date === oldItem.date && 
             event.type === oldItem.type) 
              ? newItem 
              : event
          ) || null
        );
      };
      
    const [events, setEvents] = useState<EventItem[] | null>(null);

    const generateEvents = async (text: string) => {
        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                body: text
            });
            const eventJSON = await res.json();
            
            console.log('Raw API response:', eventJSON)
            console.log('eventJSON.response:', eventJSON.response)
            
            const parsedEvents = JSON.parse(eventJSON.response);
            console.log('Parsed events:', parsedEvents)
            console.log('Parsed events type:', typeof parsedEvents)
            console.log('Parsed events keys:', Object.keys(parsedEvents))
            
            if (parsedEvents.dates) {
                console.log('Found dates array:', parsedEvents.dates)
                console.log('Dates array length:', parsedEvents.dates.length)
            }
            
            setEvents(parsedEvents.dates);
        } catch (error) {
            console.error('Error generating events:', error);
            setEvents(null);
        }
    }

    const handleText = (text: string) => {
        console.log("Extracted PDF text:", text);
        generateEvents(text)
      };

    if (events == null) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
                {/* Centered content */}
                <div className="flex flex-col items-center space-y-6 max-w-2xl text-center">
                    {/* Main heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight">
                    add a pdf of the course syllabus to continue
                    </h1>
                    <PDFUploader onUpload={handleText} />
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <DataTableDemo data={events} onDeleteEvent={handleDeleteEvent} onUpdateEvent={handleUpdateEvent} />
            </div>
        )
    }
}