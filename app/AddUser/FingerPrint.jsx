'use client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { db, storage, auth } from '@/firebase-config'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { IoFingerPrintSharp } from "react-icons/io5";
import { Box } from '@mui/material'


const gifs = ['/fingerScan.webm', '/fingerFailed.webm', '/fingerSuccess.webm'];

const FingerPrint = ({handleBack, handleNext, activeStep, steps}) => {
    const [scanStatus, setScanStatus] = useState(0);
    const [scanStatusMessage, setScanStatusMessage] = useState("");
    const [port, setPort] = useState(null); //for serial port
    const [fingerId, setFingerId] = useState(0);
    const [reader, setReader] = useState(null);
    const [receivedData, setReceivedData] = useState('');
    const [renderGif, setRenderGif] = useState('')
    const [messages, setMessages] = useState(["Hello World"]);

    // connect to arduino
    const [isConnected, setIsConnected] = useState(false);

    // Function to connect to the serial port
    const connectSerial = async () => {
        try {
            setMessages(p => [...p, "Connecting fingerprint..."])
            const selectedPort = await navigator.serial.requestPort();
            await selectedPort.open({ baudRate: 9600 });
            setPort(selectedPort);
            setIsConnected(true);
            setMessages(p => [...p, "Successfully connected to fingerprint..."])
            console.log('Connected to Arduino via Serial Port');

            // Start receiving data
            startReceiving(selectedPort);
        } catch (error) {
            console.error('Error connecting to serial port:', error);
            setMessages(m => [...m, "Something went wrong. try again..."])
            setScanStatus(2);
        }
    };
    
    const sendData = async (message) => {
        if (!port) {
          console.log('Port is not connected.');
          return;
        }
      
        try {
            // Get a writer for the port
            const writer = port.writable.getWriter();
      
            // Encode the string into a Uint8Array
            const encoder = new TextEncoder();
            const encodedMessage = encoder.encode(message + '\n');
      
            // Write the encoded data
            //await writer.write("fingerprint");
            await writer.write(encodedMessage);
            console.log(`Sent to Arduino: ${message}`);
            sessionStorage.setItem('fingerprint id', fingerId);
          // Release the writer
          writer.releaseLock();
        } catch (error) {
            setScanStatus(2);
            console.error('Error sending data:', error);
        }
    };

    // Function to start receiving data from the Arduino
    const startReceiving = async (selectedPort) => {
        try {
        const textDecoder = new TextDecoderStream();
        selectedPort.readable.pipeTo(textDecoder.writable);
        const newReader = textDecoder.readable.getReader();
        setReader(newReader); // Save the reader for later use

        while (true) {
            const { value, done } = await newReader.read();
            if (done) {
                console.log('Serial port closed.');
                break;
            }
            console.log(`Received: ${value}`);
            setMessages(m => [...m, `Recevied: ${value}`])
            setReceivedData((prevData) => prevData + value); // Append received data
            if(value.includes("failed")){
                setScanStatus(2);
            } else if(value.includes('successful')){
                setScanStatus(3);
                const demographics = JSON.parse(sessionStorage.getItem('values'));
                const rfid = sessionStorage.getItem('rfid')
                
                await setDoc(doc(db, "users", rfid), {
                    demographics,
                    fingerPrint: sessionStorage.getItem('fingerprint id'),
                    rfid: rfid
                });
            } else if(value.includes('already')){
                setScanStatus(2);
            }else if(value.includes("valid finger")){
                setScanStatus(1);
            }
        }
        } catch (error) {
            console.error('Error receiving data:', error);
        }
    };

    //toggle Scan Status Message
    useEffect(()=>{
        
        if(scanStatus === 1){
            setRenderGif(gifs[0]);
            setScanStatusMessage("Scanning...");
        }else if(scanStatus === 2){
            setRenderGif(gifs[1]);
            setScanStatusMessage("Scanning Failed...");
        }else if(scanStatus === 3){
            setRenderGif(gifs[2]);
            setScanStatusMessage("Finger print Successfully Added")
        }

    }, [scanStatus]);


    return (
        <div className='w-full relative'>
            <Button type='link' onClick={connectSerial}>Connect fingerprint</Button>
            <div className="font-thin text-xs absolute top-20">
                {messages.slice(-10).map((msg, i)=>{
                    return <p className="italic text-black/20" key={i}>{msg}</p>
                }) }
            </div>

            
            {(scanStatus !== 0) ? (<div className="">
                <video autoPlay key={renderGif} loop height="240" width="200" className='mx-auto'>
                    <source src={`/assets/${renderGif}`} type="video/webm" />
                </video>

                <p className="text-center mt-5">{scanStatusMessage}</p>
            </div>) : <IoFingerPrintSharp className='mx-auto w-56 h-56'/>}
            <Label className='grid lg:grid-cols-3 gap-1 items-center my-10'>
                 Finger Id 
                <Input value={fingerId} onChange={e => setFingerId(e.target.value)}/>
                <Button type='button' variant='' className='ms-4' onClick={() => sendData(fingerId)} disabled={fingerId == 0 || isNaN(fingerId) || fingerId < 0}>Scan FingerPrint</Button>
            </Label>
            
            
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2}}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >Back</Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
            
        </div>
    )
}

export default FingerPrint