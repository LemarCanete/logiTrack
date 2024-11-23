import React, { useState } from 'react';

const Form = () => {
  const [mode, setMode] = useState('Attendance');
  const [port, setPort] = useState(null); // Serial port
  const [isConnected, setIsConnected] = useState(false);
  const [receivedData, setReceivedData] = useState('');

  // Function to connect to the serial port
  const connectSerial = async () => {
    try {
      // Request a port and open a connection
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      setPort(selectedPort);
      setIsConnected(true);
      console.log('Connected to Arduino via Serial Port');
    } catch (error) {
      console.error('Error connecting to serial port:', error);
    }
  };

  // Function to send data to the Arduino
  const sendData = async (message) => {
    if (!port) {
      console.log('Port is not connected.');
      return;
    }

    try {
      // Create a new TextEncoderStream for each message
      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      const writer = textEncoder.writable.getWriter();

      // Write the message
      await writer.write(message + '\n');
      console.log(`Sent to Arduino: ${message}`);

      // Clean up the writer
      writer.releaseLock();
      await writableStreamClosed.catch(() => {});
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  // Function to receive data from the Arduino
  const receiveData = async () => {
    if (!port) {
      console.log('Port is not connected.');
      return;
    }

    try {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      // Read the data
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log('Serial port closed.');
          break;
        }
        console.log(`Received: ${value}`);
        setReceivedData(value); // Update the state with received data
      }

      // Clean up
      reader.releaseLock();
      await readableStreamClosed.catch(() => {});
    } catch (error) {
      console.error('Error receiving data:', error);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button
          className="bg-green-300 px-4 py-2 mr-2"
          onClick={connectSerial}
        >
          Connect to Arduino
        </button>
        <button
          className="bg-red-300 px-4 py-2 mr-2"
          onClick={() => setMode('Attendance')}
        >
          Attendance Mode
        </button>
        <button
          className="bg-blue-300 px-4 py-2"
          onClick={() => setMode('Registration')}
        >
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
        <button
          className="bg-purple-300 px-4 py-2"
          onClick={receiveData}
        >
          Receive Data
        </button>
        {receivedData && (
          <div className="mt-4">
            <h3>Received Data:</h3>
            <p>{receivedData}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
