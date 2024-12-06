import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

import { IoFingerPrintSharp } from "react-icons/io5";

const FingerPrint = () => {
    const [scanStatus, setScanStatus] = useState(0);
    const [scanStatusMessage, setScanStatusMessage] = useState("Scanning...");
    const [port, setPort] = useState(null); //for serial port

    // connect to arduino
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
                setScanStatus(2);
            }
    
            // Close the port
            reader.releaseLock();
            await readableStreamClosed.catch(() => {});
            await selectedPort.close();
            setIsConnected(false);
        } catch (error) {
            console.error("Error connecting to serial port:", error);
            setScanStatus(1);

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
            <Label className='grid lg:grid-cols-3 gap-1 items-center'>
                 

                <Button type='button' variant='link' className='ms-4' onClick={connectSerial}>Scan FingerPrint</Button>
            </Label>
            
            
            
            
        </div>
    )
}

export default FingerPrint