'use client'
import React from 'react'
import {Formik} from 'formik'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase-config'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
    const router = useRouter()

    const createUser = async (values) => {
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
    
            // Add user details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                createdAt: new Date().toISOString(),
            });
    
            console.log("User created and added to Firestore:", user.uid);
        } catch (error) {
            console.error("Error creating user or adding to Firestore:", error.message);
        }    
    };

    return (
        <div className='h-screen flex items-center justify-center flex-col '>
            <Formik
                initialValues={{ email: '', password: '', firstname: '', lastname: '', password: '', confirmPassword: '' }}
                validate={values => {
                    const errors = {};
                    if(!values.firstname){
                        errors.firstname = 'Required';
                    }else if(!values.lastname){
                        errors.lastname = 'Required';
                    } else if (!values.email) {
                        errors.email = 'Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    } else if(!values.password){
                        errors.password = 'Required';
                    } else if(values.confirmPassword !== values.password){
                        errors.confirmPassword = 'Incorrect Password!';
                    } 
                        return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                    //alert(JSON.stringify(values, null, 2));
                    console.log(values);
                    createUser(values);
                    setSubmitting(false);
                    //router.push('/Dashboard'); will update when all is over
                    }, 400);
                }}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit} className='h-5/6 lg:h-4/6 w-5/6 lg:w-2/6 bg-gray-100 p-10 rounded-lg flex flex-col justify-around'>
                        <h1 className="text-center text-2xl mb-2">Sign Up</h1>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <Label className=''>
                                First Name
                                <span className='text-red-500 text-right ms-5'>* {errors.firstname && touched.firstname && errors.firstname}</span>
                                <Input className='bg-white my-2' type="text"
                                    name="firstname"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstname}/>
                            </Label>
                            <Label className=''>
                                Last Name
                                <span className='text-red-500 text-right ms-5'>* {errors.lastname && touched.lastname && errors.lastname}</span>
                                <Input className='bg-white my-2' type="text"
                                    name="lastname"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastname}/>
                            </Label>
                        </div>
                        <Label className=''>
                            Email
                            <span className='text-red-500 text-right ms-5'>* {errors.email && touched.email && errors.email}</span>
                            <Input className='bg-white my-2' type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}/>
                        </Label>
                        
                        <Label className=''>
                            Password
                            <span className='text-red-500 text-right ms-5'>* {errors.password && touched.password && errors.password}</span>
                            <Input className='bg-white my-2' type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}/>
                        </Label>

                        <Label className=''>
                            Confirm Password
                            <span className='text-red-500 text-right ms-5'>* {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</span>
                            <Input className='bg-white my-2' type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}/>
                        </Label>
                        <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                        <Label className='text-center'>Don't have an account yet? <Link href="SignIn" className='underline text-blue-600'>Sign in</Link></Label>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default SignUp