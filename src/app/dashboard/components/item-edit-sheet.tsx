import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ReactNode, useState } from 'react';
import { EventItem } from "../types/events";


interface EditSheetProps {
    children: ReactNode,
    eventItem: EventItem,
    onSave: (event: EventItem) => void;
}

export function EditSheet({ children, eventItem, onSave }: EditSheetProps) {

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(eventItem || {
    id: '',
    type: 'homework' as const,
    name: '',
    date: ''
  })

  const handleSave = () => {
    onSave({
        ...formData,
        id: eventItem.id 
      })
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit calendar event item</SheetTitle>
          <SheetDescription>
            Make changes to your event here. Click save when you&apos;re finished.
          </SheetDescription>
        </SheetHeader>                                                           
        <div className="grid flex-1 auto-rows-min gap-6 px-4">

            <div className="grid gap-3">
                <Label htmlFor="event-type">Type</Label>
                <select 
                    id="event-type"
                    value={formData.type || ''} 
                    onChange={(e) => setFormData({...formData, type: e.target.value as "exam" | "homework" | "project"})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Select event type</option>
                    <option value="exam">Exam</option>
                    <option value="homework">Homework</option>
                    <option value="project">Project</option>
                </select>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="event-name">Name</Label>
                <Input 
                    id="event-name" 
                    value={formData.name || ''} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="event-date">Date</Label>
                <Input 
                    id="event-date" 
                    type="date"
                    value={formData.date || ''} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
            </div>
        </div>
        <SheetFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
