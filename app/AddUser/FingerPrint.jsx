'use client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

import { IoFingerPrintSharp } from "react-icons/io5";

const FingerPrint = () => {
    const [scanStatus, setScanStatus] = useState(0);
    const [scanStatusMessage, setScanStatusMessage] = useState("Scanning...");
    const [port, setPort] = useState(null); //for serial port
    const [fingerId, setFingerId] = useState(0);
    const [reader, setReader] = useState(null);
    const [receivedData, setReceivedData] = useState('');
    
    // connect to arduino
    const [isConnected, setIsConnected] = useState(false);


    // Function to connect to the serial port
    const connectSerial = async () => {
        try {
        const selectedPort = await navigator.serial.requestPort();
        await selectedPort.open({ baudRate: 9600 });
        setPort(selectedPort);
        setIsConnected(true);
        console.log('Connected to Arduino via Serial Port');

        // Start receiving data
        startReceiving(selectedPort);
        setScanStatus(2);
        } catch (error) {
        console.error('Error connecting to serial port:', error);
        setScanStatus(1);
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
          await writer.write(encodedMessage);
          console.log(`Sent to Arduino: ${message}`);
      
          // Release the writer
          writer.releaseLock();
        } catch (error) {
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
            setReceivedData((prevData) => prevData + value); // Append received data
        }
        } catch (error) {
        console.error('Error receiving data:', error);
        }
    };

    //toggle Scan Status Message
    useEffect(()=>{
        
        if(scanStatus === 0){
            setScanStatusMessage("Scanning...");
        }else if(scanStatus === 1){
            setScanStatusMessage("Scanning Failed...");
        }else{
            setScanStatusMessage("Scanning Successful")
        }
    }, [scanStatus]);


    return (
        <div className='w-full'>
            <Button type='link' onClick={connectSerial}>Connect fingerprint</Button>
            <p className="">{isConnected}</p>
            {(scanStatus === 0) ? (
                <div className="w-full">
                    <video key={scanStatus} autoPlay loop width="200" className='mx-auto'>
                        <source src="/assets/fingerScan.webm" type="video/webm" />
                    </video>
                    <p className="text-center mt-5">Scanning...</p>
                </div>
            ) : (scanStatus === 1) ? (
                <div className="">
                    <video key={scanStatus} autoPlay loop height="240" width="200" className='mx-auto'>
                      <source src="/assets/fingerFailed.webm" type="video/webm" />
                    </video>
                    <p className="text-center mt-5">Scanning Failed</p>
                </div>

            ) : (
                <div className="">
                    <video key={scanStatus} autoPlay loop height="240" width="200" className='mx-auto'>
                      <source src="/assets/fingerSuccess.webm" type="video/webm" />
                    </video>
                    <p className="text-center mt-5">Scanning Success</p>
                </div>

            )}
            <Label className='grid lg:grid-cols-3 gap-1 items-center my-10'>
                 Finger Id 
                <Input value={fingerId} onChange={e => setFingerId(e.target.value)}/>
                <Button type='button' variant='' className='ms-4' onClick={() => sendData(fingerId)} disabled={fingerId == 0 || isNaN(fingerId)}>Scan FingerPrint</Button>
            </Label>
            
            
            
            
        </div>
    )
}

export default FingerPrint