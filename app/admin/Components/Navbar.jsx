import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"


const Navbar = () => {
    return (
        <div className="">
            <div className="hidden lg:flex items-center justify-between py-2 bg-gray-100">
                <div className="">
                    <Link href='./Dashboard' className="font-bold me-56 p-4">LogiTrack</Link>
                    {/* <Link className="px-10 py-4 hover:underline hover:bg-white " href='./Dashboard'>Dashboard</Link> */}
                    <Link className="px-10 py-4 hover:underline hover:bg-white " href='./Events'>Events</Link>
                    <Link className="px-10 py-4 hover:underline hover:bg-white " href='./Users'>Users</Link>
                    {/* <Link className="px-10 py-4 hover:underline hover:bg-white " href='./Settings'>Settings</Link> */}
                    {/* <Link className="px-10 py-4 hover:underline hover:bg-white " href='./Logs'>Logs</Link> */}
                    {/* <Link className="px-10 py-4 hover:underline hover:bg-white " href='./Reports'>Reports</Link> */}
                </div>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </div>

            <div className="lg:hidden">
                <Sheet>
                    <div className=" bg-gray-100 p-4 flex">
                        <SheetTrigger className='w-screen'><GiHamburgerMenu className='text-xl'/></SheetTrigger>
                        <Link href='./Dashboard' className="font-bold">LogiTrack</Link>
                    </div>
                    
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      
    )
}

export default Navbar