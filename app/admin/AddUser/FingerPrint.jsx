import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

import { IoFingerPrintSharp } from "react-icons/io5";

const FingerPrint = () => {
    const [scanStatus, setScanStatus] = useState(0);
    const [scanStatusMessage, setScanStatusMessage] = useState("Scanning...");

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
            {(scanStatus === 0) ? (
                <div className="w-full">
                    <video autoPlay loop width="200" className='mx-auto'>
                        <source src="/assets/fingerScan.webm" type="video/webm" />
                    </video>
                    <p className="text-center mt-5">Scanning...</p>
                </div>
            ) : (scanStatus === 1) ? (
                <div className="">
                    <video autoPlay height="240" width="200" className='mx-auto'>
                      <source src="/assets/fingerFailed.webm" type="video/webm" />
                    </video>
                    <p className="text-center mt-5">Scanning Failed</p>
                </div>

            ) : (
                <div className="">
                    <video autoPlay height="240" width="200" className='mx-auto'>
                      <source src="/assets/fingerSuccess.webm" type="video/webm" />
                    </video>
                    <p className="text-center mt-5">Scanning Success</p>
                </div>

            )}
            <Label className='grid lg:grid-cols-3 gap-1 items-center'>
                Add Fingerprint

                <Input className='bg-white my-2' type=""
                    name="id"
                    />

                <Button type='button' variant='link' className='ms-4' >Click</Button>
            </Label>
            
            
            
            
        </div>
    )
}

export default FingerPrint