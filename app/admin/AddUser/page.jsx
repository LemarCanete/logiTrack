'use client'
import React, {useEffect, useState} from 'react'
import Navbar from '../Components/Navbar'
import { Button } from '@/components/ui/button'
import {Formik} from 'formik'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const page = () => {
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('Disconnected');
    const [rfid, setRfid] = useState('');
    const [receivedData, setReceivedData] = useState();

    const connectToESP32 = () => {
        const newSocket = new WebSocket('ws://192.168.1.39/ws'); 
        newSocket.onopen = () => setStatus('Connected');
        newSocket.onclose = () => setStatus('Disconnected');
        newSocket.onerror = (error) => console.error('WebSocket Error:', error);

        setSocket(newSocket);
    };

    const sendRFIDData = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'rfid', data: rfid }));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    useEffect(()=>{
        const receiveData = () =>{
            socket.onmessage = (event) => {
                console.log('Received data:', event.data);
                setReceivedData(event.data);
            };
        }
        socket && receiveData()
    }, [socket])

    return (
        <div>
            <Navbar />

            <div className='h-screen flex items-center justify-center flex-col '>
                <Formik
                    initialValues={{ email: '', password: '', firstname: '', lastname: '', password: '', confirmPassword: '', id: '' }}
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
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
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
                            <Button variant='link' className='underline' onClick={connectToESP32} type='button'>{status}</Button>
                            <h1 className="text-center text-2xl mb-2">Add User</h1>
                            {/* first name */}
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
                            {/* email */}
                            <Label className=''>
                                Email
                                <span className='text-red-500 text-right ms-5'>* {errors.email && touched.email && errors.email}</span>
                                <Input className='bg-white my-2' type="email"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}/>
                            </Label>
                            
                            
                            {/* password */}
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
                                <Input className='bg-white my-2' type="confirmPassword"
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}/>
                            </Label>
                            
                            <Label className='grid lg:grid-cols-3 gap-1 items-center'>
                                Add RFID Card

                                <Input className='bg-white my-2' type="rfid"
                                    name="id"
                                    value={rfid}
                                    onChange={e => setRfid(e.target.value)}
                                    />

                                <Button type='button' variant='link' className='ms-4' onClick={sendRFIDData}>Add RFID</Button>
                            </Label>


                            <Button type="submit" disabled={isSubmitting}>
                                Submit
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>

            
        </div>
    )
}

export default page