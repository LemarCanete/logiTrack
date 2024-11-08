'use client'
import React from 'react'
import {Button} from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SignIn = () => {
    const router = useRouter();
    return (
        <div className='h-screen flex items-center justify-center flex-col '>
            <div className="h-3/6 w-5/6 lg:w-2/6 bg-gray-100 p-10 rounded-lg flex flex-col justify-around">
                <h1 className="text-center text-2xl mb-2">Sign In</h1>
                <Label className=''>
                    Email
                    <Input className='bg-white my-2'/>
                </Label>
                <Label className=''>
                    Password
                    <Input className='bg-white my-2'/>
                </Label>
                    <Button className='' onClick={() =>  router.push('/admin/Dashboard')}>Sign In</Button>
                <Label className='text-center'>Don't have an account yet? <Link href="SignUp" className='underline text-blue-600'>Sign up</Link></Label>
            </div>
        </div>
    )
}

export default SignIn