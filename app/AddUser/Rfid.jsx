import React from 'react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Rfid = () => {
    const [rfid, setRfid] = useState('');
    const [port, setPort] = useState(null); //for serial port
    const [isConnected, setIsConnected] = useState(false);
    const [reader, setReader] = useState(null);
    const [receivedData, setReceivedData] = useState('');

    const connectSerial = async () => {
        try {
            const selectedPort = await navigator.serial.requestPort();
            await selectedPort.open({ baudRate: 9600 });
            setPort(selectedPort);
            setIsConnected(true);
            console.log('Connected to Arduino via Serial Port');
      
            // Start receiving data
            startReceiving(selectedPort);
          } catch (error) {
            console.error('Error connecting to serial port:', error);
          }
    };

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
            setRfid(value);
            sessionStorage.setItem()
          }
        } catch (error) {
          console.error('Error receiving data:', error);
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

      const disconnectSerial = async () => {
        try {
          if (reader) {
            // Cancel the reader and release its lock
            await reader.cancel();
            reader.releaseLock();
            setReader(null);
          }
      
          if (port) {
            // Cancel the pipeTo() operation if it's active
            const readableStream = port.readable;
            if (readableStream.locked) {
              const textDecoderStream = new TextDecoderStream();
              readableStream.pipeTo(textDecoderStream.writable).catch(() => {});
            }
      
            // Close the port
            await port.close();
            setPort(null);
          }
      
          setIsConnected(false);
          console.log('Disconnected from Arduino');
        } catch (error) {
          console.error('Error disconnecting from serial port:', error);
        }
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