"use client";
import PDFUploader from "./components/resume-upload"
import { useState, useEffect } from 'react'
import { DataTable } from "./components/event-table";
import { EventItem } from "./types/events";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Dashboard() {

    const router = useRouter();

    const [events, setEvents] = useState<EventItem[] | null>(null);

    useEffect(() => {
        const localEvents = localStorage.getItem("current_events")
        if (localEvents != null) {
            const parsedEvents = JSON.parse(localEvents)
            setEvents(parsedEvents)
        }
    }, []);

    const handleReset = () => {
        localStorage.removeItem("current_events")
        setEvents(null)
    }

    const handleEventsCalendar = () => {

    }

    const handleDeleteEvent = (item: EventItem) => {
        const updatedEvents = events?.filter(event => event.id !== item.id) || null;
        
        setEvents(updatedEvents);
        
        if (updatedEvents) {
            localStorage.setItem("current_events", JSON.stringify(updatedEvents));
        } else {
            localStorage.removeItem("current_events");
        }
    };
    
    const handleUpdateEvent = (updatedEvent: EventItem) => {
        setEvents(prevEvents => 
            prevEvents?.map(event => 
                event.id === updatedEvent.id ? updatedEvent : event
            ) || []
        );
        
        // Also update localStorage
        const updatedEvents = events?.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
        );
        if (updatedEvents) {
            localStorage.setItem("current_events", JSON.stringify(updatedEvents));
        }
    };
      
    const generateEvents = async (text: string) => {
        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                body: text
            });
            const eventJSON = await res.json();
                    
            const parsedEvents = JSON.parse(eventJSON.response);    
            
            const eventsWithIds = parsedEvents.dates.map((event: any) => ({
                ...event,
                id: crypto.randomUUID()
            }));
            
            setEvents(eventsWithIds);
            localStorage.setItem("current_events", JSON.stringify(eventsWithIds))
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
            <div className="w-full h-full flex flex-col">
                <div className='flex flex-col justify-center items-center'>
                    <div className="w-[90%] space-y-6 mt-10">
                        <div id="header-elements" className="flex flex-row justify-between">
                            <h1 className="font-semibold text-4xl">Current Syllabus Schedule</h1>
                            <div className='flex flex-col space-y-2'>
                            <Button variant='outline' className='cursor-pointer bg-zinc-700 text-white hover:bg-zinc-300 hover:text-black' onClick={handleReset}>Upload a New Syllabus</Button>
                            <Button variant='outline' className='cursor-pointer bg-zinc-200 hover:bg-zinc-700 hover:text-white' onClick={handleEventsCalendar}>Add To Google Calendar</Button>
                            </div>
                        </div>
                        <DataTable data={events} onDeleteEvent={handleDeleteEvent} onUpdateEvent={handleUpdateEvent} />
                    </div>
                </div>
            </div>
        )
    }
}