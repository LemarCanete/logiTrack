'use client'
import Image from "next/image";
import SignIn from '@/app/SignIn/page'
import {useState} from 'react'
import SerialReader from "./admin/ReadSerial/page";

export default function Home() {
    const [eventsList, setEventsList] = useState({});

    return (
        <div className="">
            <SignIn />
            <SerialReader/>
        </div>
    );

}
