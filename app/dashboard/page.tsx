"use client";
import PDFUploader from "./components/resume-upload"
import { useState, useEffect } from 'react'
import { DataTable } from "./components/event-table";
import { EventItem } from "./types/events";
import { Button } from "../components/ui/button";
import { useAuth, useAuthenticatedFetch } from "../context/GoogleAuthContext";
import { useRouter } from 'next/navigation'

export default function Dashboard() {

    const router = useRouter();
    
    const {logout} = useAuth();
    const fetchWithAuth = useAuthenticatedFetch();
    const [status, setStatus] = useState<"idle" | "pushing" | "success" | "error">("idle");
    const [events, setEvents] = useState<EventItem[] | null>(null);

     useEffect(() => {
        const localEvents = localStorage.getItem("current_events")
        if (localEvents != null) {
            const parsedEvents = JSON.parse(localEvents)
            setEvents(parsedEvents)
        }
        const checkAuth = async () => {
            const res = await fetch('/api/google/auth/status', {method: "GET"})
            if (res.status != 200) {
                router.push("/")
            }
        }
        checkAuth()
    }, []);

    const handleReset = () => {
        localStorage.removeItem("current_events")
        setEvents(null)
        setStatus("idle") // Reset status when uploading new syllabus
    }

    const handleEventsCalendar = async () => {
        setStatus("pushing");
        try {
            const response = await fetchWithAuth('/api/google/calendar', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(events)
            });

            if (response.status === 200) {
                setStatus("success");
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 1000); 
            }
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 1000); 
        }
        setTimeout(() => setStatus("idle"), 1000);

    }

    const getCalendarButtonContent = () => {
        switch (status) {
            case "pushing":
                return "Pushing...";
            case "success":
                return "Push Successful!";
            case "error":
                return "Push Failed";
            default:
                return "Add To Google Calendar";
        }
    };

    const getCalendarButtonClassName = () => {
        const baseClass = "cursor-pointer w-full sm:w-auto";
        
        switch (status) {
            case "success":
                return `${baseClass} variant="outline" bg-green-600 text-white hover:bg-green-700 hover:text-white`;
            case "error":
                return `${baseClass} variant="outline" bg-red-600 text-white hover:bg-red-700 hover:text-white`;
            case "pushing":
                return `${baseClass} variant="outline" bg-zinc-300 hover:bg-zinc-700 hover:text-white text-black`;
            default:
                return `${baseClass} variant="outline" bg-zinc-300 hover:bg-zinc-700 hover:text-white text-black`;
        }
    };

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
            
            const eventsWithIds = parsedEvents.dates.map((event: EventItem) => ({
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

    const handleText = async (text: string) => {
        await generateEvents(text)
      };

    if (events == null) {
        return (
            <div>
                <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
                    <div className="flex flex-col items-center space-y-6 max-w-2xl text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight">
                        add a pdf of the course syllabus to continue
                        </h1>
                        <PDFUploader onUpload={handleText} />
                    </div>
                </div>
            </div>
        )
    } else {
    return (
        <div className="w-full h-full flex flex-col space-y-4">
            <div className="flex flex-col justify-center items-center">
                <div className="w-[90%] space-y-2 mt-10 mx-auto">
                    <div id="header-elements" className="flex flex-col-reverse sm:flex-row justify-between items-center w-full">
                        <h1 className="font-semibold text-4xl mb-4 sm:mb-0">
                            Current Syllabus Schedule
                        </h1>
                        <div className="hidden sm:flex flex-col xs:flex-row xs:space-x-2 space-y-2 xs:space-y-0 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="cursor-pointer bg-zinc-700 text-white hover:bg-zinc-300 hover:text-black w-full sm:w-auto"
                                onClick={handleReset}>
                                Upload a New Syllabus
                            </Button>
                            <Button
                                className={getCalendarButtonClassName()}
                                onClick={handleEventsCalendar}
                                disabled={status === "pushing"}>
                                <svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                {getCalendarButtonContent()}
                            </Button>
                        </div>
                    </div>
                    <DataTable data={events} onDeleteEvent={handleDeleteEvent} onUpdateEvent={handleUpdateEvent}/>
                    
                    <div className="flex sm:hidden flex-col space-y-3 w-full mt-6">
                        <Button
                            variant="outline"
                            className="cursor-pointer bg-zinc-700 text-white hover:bg-zinc-500 hover:text-black w-full"
                            onClick={handleReset}>
                            Upload a New Syllabus
                        </Button>
                        <Button
                            className={getCalendarButtonClassName()}
                            onClick={handleEventsCalendar}
                            disabled={status === "pushing"}>
                            <svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            {getCalendarButtonContent()}
                        </Button>
                    </div>
                </div>
            </div>
            <Button 
                onClick={logout}
                variant='destructive'
                className="fixed bottom-10 right-18 cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-600 hover:text-white hover:scale-105 transition-transform transition-colors text-sm font-medium">
                <svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign Out
            </Button>
        </div>
    )}
};