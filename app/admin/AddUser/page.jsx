'use client'
import React, {useEffect, useState} from 'react'
import Navbar from '../Components/Navbar'
import { Button } from '@/components/ui/button'
import {Formik} from 'formik'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { db, storage, auth } from '@/firebase-config'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'

const page = () => {
    const [rfid, setRfid] = useState('');
    const [port, setPort] = useState(null); //for serial port
    const [isConnected, setIsConnected] = useState(false);

    const connectSerial = async () => {
        try {
          // Request a port and open a connection
          const selectedPort = await navigator.serial.requestPort();
          await selectedPort.open({ baudRate: 9600 });
          setPort(selectedPort);
          setIsConnected(true);
    
          // Read data from the port
          const textDecoder = new TextDecoderStream();
          const readableStreamClosed = selectedPort.readable.pipeTo(textDecoder.writable);
          const reader = textDecoder.readable.getReader();
    
          console.log("Connected to serial port!");
    
          // Output data to the console
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // Allow the serial port to be closed
              console.log("Serial port closed.");
              break;
            }
            console.log(value); // Print the received data to the console
            setRfid(value);
          }
    
          // Close the port
          reader.releaseLock();
          await readableStreamClosed.catch(() => {});
          await selectedPort.close();
          setIsConnected(false);
        } catch (error) {
          console.error("Error connecting to serial port:", error);
        }
      };

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
                        //alert(JSON.stringify(values, null, 2));
                        const docData = {
                            firstname: values.firstname,
                            lastname: values.lastname,
                            email: values.email,
                        };
                        console.log(docData);
                        const docRef = addDoc(collection(db, "users"), docData);
                        setDoc(doc(db, "users", docRef.id), {docid: docRef.id}, {merge:true})
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
                                <Input className='bg-white my-2' type="password"
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

                                <Button type='button' variant='link' className='ms-4' onClick={connectSerial} disabled={isConnected}>{isConnected ? 'Scan RFID Card Now' : 'Connect to RFID Scanner'}</Button>
                            </Label>

                            <Label className='grid lg:grid-cols-3 gap-1 items-center'>
                                Add Fingerprint

                                <Input className='bg-white my-2' type="rfid"
                                    name="id"
                                    value={rfid}
                                    onChange={e => setRfid(e.target.value)}
                                    />

                                <Button type='button' variant='link' className='ms-4' onClick={connectSerial} disabled={isConnected}>{isConnected ? 'Scan RFID Card Now' : 'Connect to RFID Scanner'}</Button>
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