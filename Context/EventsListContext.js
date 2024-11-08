'use client'
import { createContext, useEffect, useState } from "react";
import { db } from "@/firebase-config";  // Assuming you have a reference to your Firestore database
import { collection, onSnapshot, query } from "firebase/firestore";

export const EventsListContext = createContext();

export const EventsListContextProvider = ({ children }) => {
    const [eventsList, setEventsList] = useState({});

    useEffect(() => {

        const getEvents = async()=>{
            const q = query(collection(db, "events"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const events = [];
                querySnapshot.forEach((doc) => {
                    events.push(doc.data());
                });
                setEventsList(events)
            });
            
        }
        return () => {
            getEvents();
          };
    }, []);

    return (
        <EventsListContext.Provider value={{ eventsList, setEventsList }}>
            {children}
        </EventsListContext.Provider>
    );
};