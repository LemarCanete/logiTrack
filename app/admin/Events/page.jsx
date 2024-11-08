'use client'
import React, { useContext, useEffect, useState } from 'react'
import {Button} from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import Navbar from '../Components/Navbar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'

//firebase
import { collection, addDoc } from "firebase/firestore"; 
import {db} from '@/firebase-config'

//contexts
import {EventsListContext} from '@/Context/EventsListContext'

//icons
import { MdEventNote } from "react-icons/md";
import { useRouter } from 'next/navigation'

const Events = () => {
    const [eventName, setEventName] = useState("");
    const [eventDetails, setEventDetails] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [duration, setDuration] = useState("");
    const {eventsList} = useContext(EventsListContext)
    const router = useRouter()
    const addEvent = async() =>{
        const docRef = await addDoc(collection(db, "events"), {
            eventName: eventName,
            eventDetails: eventDetails,
            eventDate: eventDate,
            duration: duration,
        });
    }

    console.log(eventsList)

    return (
        <div>
            <Navbar />
            <div className="py-2 w-screen ">
                <div className="flex flex-col md:flex-row w-full md:w-5/6 mx-auto lg:px-5 justify-between my-10 gap-4 px-2">
                    <Input type='search' placeholder='Search' className='md:w-64'/>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="" className='md:w-64'>Add Event</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[300px] text-sm lg:w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Add Event</DialogTitle>
                            <DialogDescription>
                                Fill out Event Details. Click save when you're done.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="eventnName" className="text-right">Event Name</Label>
                                    <Input id="eventName" value={eventName} required onChange={(e) => setEventName(e.target.value)} className="col-span-3 border-0" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="eventDetails" className="text-right">Event Detail</Label>
                                    <Textarea id="eventDetails" placeholder='' required value={eventDetails} onChange={e => setEventDetails(e.target.value)} className="col-span-3 border-0 border-b" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="eventDate" className="text-right">Date</Label>
                                    <Input id="eventDate" placeholder='' required type='datetime-local' value={eventDate} 
                                        onChange={(e) => setEventDate(e.target.value)} className="col-span-3 border-0 border-b p-2" 
                                        />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="duration" className="text-right">Duration</Label>
                                    <Input id="duration" placeholder='0' required type='number' value={duration} 
                                        onChange={(e) => setDuration(e.target.value)} className="col-span-3 border-0 border-b p-2" 
                                        />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={addEvent}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* events list grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-screen lg:w-5/6 mx-auto">
                {eventsList.length > 0 && eventsList.map((event, id)=>(
                    <div className="w-5/6 h-56 sm:w-96 sm:h-96 mx-auto rounded-md p-4 shadow flex flex-col justify-around items-center hover:cursor-pointer hover:shadow-lg" key={id}
                        onClick={()=>router.push(`./Events/${event.eventName}`)}>
                        <MdEventNote className='text-gray-100 w-4/6 h-5/6'/>
                        <h3 className="text-lg text-center">{event.eventName}</h3>
                        <p className="">{event.eventDate}</p>
                    </div>                        
                ))}
                </div>
            </div>
        </div>
    )
}

export default Events