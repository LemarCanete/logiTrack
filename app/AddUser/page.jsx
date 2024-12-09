'use client'
import React, {useEffect, useState} from 'react'
import Navbar from '../Components/Navbar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import FingerPrint from './FingerPrint'
import Rfid from './Rfid'
import Demographics from './Demographics'

// mui
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = ['Demographics', 'RFID', 'Fingerprint'];

const page = () => {
    
    const [activeStep, setActiveStep] = React.useState(0);

    const isStepOptional = (step) => {
        return step === 1;
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div>
            <Navbar />
            <div className='w-3/6 bg-gray-100 mx-auto mt-10 rounded-md p-10 h-[650px]'>
                <Box sx={{ width: '100%' }} >
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                            <Typography variant="caption"></Typography>
                            );
                        }
                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                        </React.Fragment>
                    ) :(activeStep === 0) ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>

                            <Demographics handleBack={handleBack} handleNext={handleNext} activeStep={activeStep} steps={steps}/>

                        </React.Fragment>
                    ) : (activeStep === 1) ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>

                            <Rfid handleBack={handleBack} handleNext={handleNext} activeStep={activeStep} steps={steps}/>

                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>

                            <FingerPrint handleBack={handleBack} handleNext={handleNext} activeStep={activeStep} steps={steps}/>

                            
                        </React.Fragment>
                    )}
                </Box>
            </div>
            
            </div>
    )
}

export default page