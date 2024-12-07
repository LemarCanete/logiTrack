import React, { useState } from 'react';

const Form = () => {
  const [mode, setMode] = useState('Attendance');
  const [port, setPort] = useState(null);
  const [reader, setReader] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedData, setReceivedData] = useState('');

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
    } catch (error) {
      console.error('Error connecting to serial port:', error);
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
      <div className="mb-4">
        <button className="bg-green-300 px-4 py-2 mr-2" onClick={connectSerial}>
          Connect to Arduino
        </button>
        <button className="bg-red-300 px-4 py-2 mr-2" onClick={disconnectSerial}>
          Disconnect
        </button>
        <button className="bg-red-300 px-4 py-2 mr-2" onClick={() => setMode('Attendance')}>
          Attendance Mode
        </button>
        <button className="bg-blue-300 px-4 py-2" onClick={() => setMode('Registration')}>
          Registration Mode
        </button>
      </div>

      <div>
        <h2>Current Mode: {mode}</h2>
        {mode === 'Attendance' && (
          <button
            className="bg-yellow-300 px-4 py-2 mt-4"
            onClick={() => sendData('Attendance')}
          >
            Send Attendance Data
          </button>
        )}
        {mode === 'Registration' && (
          <button
            className="bg-yellow-300 px-4 py-2 mt-4"
            onClick={() => sendData('Registration')}
          >
            Send Registration Data
          </button>
        )}
      </div>

      <div className="mt-4">
        <h3>Received Data:</h3>
        <p>{receivedData || 'No data received yet.'}</p>
      </div>
    </div>
  );
};

export default Form;
