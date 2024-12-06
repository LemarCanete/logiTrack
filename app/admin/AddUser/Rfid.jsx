import React from 'react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Rfid = () => {
    const [rfid, setRfid] = useState('');
    const [port, setPort] = useState(null); //for serial port
    const [isConnected, setIsConnected] = useState(false);

    const connectSerial = async () => {
        // try {
        //   // Request a port and open a connection
        //   const selectedPort = await navigator.serial.requestPort();
        //   await selectedPort.open({ baudRate: 9600 });
        //   setPort(selectedPort);
        //   setIsConnected(true);
    
        //   // Read data from the port
        //   const textDecoder = new TextDecoderStream();
        //   const readableStreamClosed = selectedPort.readable.pipeTo(textDecoder.writable);
        //   const reader = textDecoder.readable.getReader();
    
        //   console.log("Connected to serial port!");
    
        //   // Output data to the console
        //   while (true) {
        //     const { value, done } = await reader.read();
        //     if (done) {
        //       // Allow the serial port to be closed
        //       console.log("Serial port closed.");
        //       break;
        //     }
        //     console.log(value); // Print the received data to the console
        //     setRfid(value);
        //   }
    
        //   // Close the port
        //   reader.releaseLock();
        //   await readableStreamClosed.catch(() => {});
        //   await selectedPort.close();
        //   setIsConnected(false);
        // } catch (error) {
        //   console.error("Error connecting to serial port:", error);
        // }
    };

    return (
        <div>
            <Label className='grid lg:grid-cols-3 gap-1 items-center'>
                Add RFID Card

                <Input className='bg-white my-2' type="rfid"
                    name="id"
                    value={rfid}
                    onChange={e => setRfid(e.target.value)}
                    />

                <Button type='button' variant='link' className='ms-4' onClick={connectSerial} disabled={isConnected}>{isConnected ? 'Scan RFID Card Now' : 'Connect to RFID Scanner'}</Button>
            </Label>
        </div>
    )
}

export default Rfid