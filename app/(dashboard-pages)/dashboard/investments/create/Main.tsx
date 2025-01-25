'use client'

import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from "@mui/material/Divider";
import StepInvestmentPlan from "./StepInvestmentPlan";

function VerticalLinearStepper() {

    const steps = [
        {
            label: 'Select campaign settings',
            description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
        },
        {
            label: 'Create an ad group',
            description:
                'An ad group contains one or more ads which target a shared set of keywords.',
        },
        {
            label: 'Create an ad',
            description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
        },
    ];
    const [activeStep, setActiveStep] = React.useState(0);

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
        <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                </Button>
                                <Button
                                    disabled={index === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Back
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}

function CreateInvestmentStepper() {
    // Get the current page URL path
    const currentPath = window.location.pathname;

    // Initialize state based on sessionStorage for the specific path
    const [storedStep, setStoredStep] = useState<string>(() => {
        const savedData = sessionStorage.getItem(currentPath);
        return savedData ? savedData : '0';
    });

    useEffect(() => {
        // Store storedStep in sessionStorage with the current path as the key
        sessionStorage.setItem(currentPath, storedStep);
    }, [storedStep, currentPath]); // Run effect when storedStep or currentPath changes

    const [activeStep, setActiveStep] = useState(parseInt(storedStep, 10));

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            const nextActiveStep = prevActiveStep + 1;
            setStoredStep(nextActiveStep.toString(10));
            return nextActiveStep;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            const nextActiveStep = prevActiveStep - 1;
            setStoredStep(nextActiveStep.toString(10));
            return nextActiveStep;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function Step1() {
        return (
            <>
                <Typography>Step 1 Content</Typography>
            </>
        )
    }

    function Step2() {
        return (
            <>
                <Typography>Step 2 Content</Typography>
            </>
        )
    }

    const steps = [
        {
            label: "Choose an Investment Plan",
            description: "Based on your investment goals, here are some investment plans we offer.",
            component: <StepInvestmentPlan/>
        },

        {
            label: "Choose an Investment Type",
            description: "Having your goals as an individual, or with a group of friends or community, " +
                "we've got you covered.",
            component: <Step1/>
        },

        {
            label: "Investment Goals",
            description: "Having your goals as an individual, or with a group of friends or community, " +
                "we've got you covered.",
            component: <Step1/>
        },

        {
            label: "Investment Amount",
            description: "Having your goals as an individual, or with a group of friends or community, " +
                "we've got you covered.",
            component: <Step1/>
        },
    ];

    return (
        <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent TransitionProps={{ unmountOnExit: false }}>
                            <Typography>{step.description}</Typography>
                            {step.component}
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                </Button>
                                <Button
                                    disabled={index === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Back
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

function CreateInvestmentStepper2() {
    console.log('rendering >>> ');
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function Step1() {
        return (
            <>
                <Typography>Step 1 Content</Typography>
            </>
        )
    }

    function Step2() {
        return (
            <>
                <Typography>Step 2 Content</Typography>
            </>
        )
    }

    const steps = [
        {label: "Step 1", description: "", component: <Step1/>},
        {label: "Step 2", description: "", component: <Step2/>},
    ];

    return (
        <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent TransitionProps={{ unmountOnExit: false }}>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                </Button>
                                <Button
                                    disabled={index === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Back
                                </Button>
                            </Box>
                            {step.component}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}

function Main() {
    return (
        <>
            <Typography variant='h4' gutterBottom>Create an Investment</Typography>
            <Typography gutterBottom>
                We'll help you come up with an investment that aligns with
                your objectives and delivers consistent results.
            </Typography>
            <CreateInvestmentStepper/>

            <Divider sx={{my: 3}}/>
            {/*<VerticalLinearStepper/>*/}
        </>
    )
}

export default Main;
