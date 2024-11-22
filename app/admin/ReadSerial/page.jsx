'use client'
import React, { useState } from "react";

const SerialReader = () => {
  const [port, setPort] = useState(null);
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
      <h1>Serial Port Reader</h1>
      <button onClick={connectSerial} disabled={isConnected}>
        {isConnected ? "Connected" : "Connect to Serial Port"}
      </button>
    </div>
  );
};

export default SerialReader;
