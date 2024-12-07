'use client'
import React from 'react'
import Navbar from '../Components/Navbar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter();

    return (
        <div>
            <Navbar />
            <h1 className="">Users</h1>
            <Button onClick={router.push('./AddUser')}>Add User</Button>
        </div>
    )
}

export default page