'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        if (!email || !password) {
            setError('Both email and password are required.');
            return;
        }

        setError(''); // Clear any previous error

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/Dashboard'); // Navigate to dashboard
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please try again.');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center flex-col">
            <div className="h-3/6 w-5/6 lg:w-2/6 bg-gray-100 p-10 rounded-lg flex flex-col justify-around">
                <h1 className="text-center text-2xl mb-2">Sign In</h1>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <Label>
                    Email
                    <Input
                        className="bg-white my-2"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </Label>
                <Label>
                    Password
                    <Input
                        className="bg-white my-2"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </Label>
                <Button onClick={handleSignIn}>Sign In</Button>
                <Label className="text-center">
                    Don't have an account yet?{' '}
                    <Link href="SignUp" className="underline text-blue-600">
                        Sign up
                    </Link>
                </Label>
            </div>
        </div>
    );
};

export default SignIn;
