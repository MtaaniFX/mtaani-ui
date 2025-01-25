'use client'

import Typography from "@mui/material/Typography";
import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import StepInvestmentPlan from "./StepInvestmentPlan";
import StepInvestmentType from "./StepInvestmentType";
import InvestmentSelection from "@/app/dev/t1/StepInvestmentTerms";
import StepCreateInvestment from "./StepCreateInvestment";
import GroupForm from "./GroupForm2";

function CreateInvestmentStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [currentPlan, setCurrentPlan] = useState('');
    const [currentType, setCurrentType] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [termDuration, setTermDuration] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            const nextStep = prevActiveStep - 1;
            if (nextStep < 0) {
                return prevActiveStep;
            }
            return nextStep;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function StepInvestmentTerms() {
        return (
            <>
                {currentType === 'group'
                    ? <GroupForm></GroupForm>
                    : <InvestmentSelection
                        selectedTerm={selectedTerm}
                        setSelectedTerm={setSelectedTerm}
                        termDuration={termDuration}
                        setTermDuration={setTermDuration}/>
                }
            </>
        )
    }

    const steps = [
        {
            label: "Choose an Investment Plan",
            description: "Based on your investment goals, here are some investment plans we offer.",
            component:
                <StepInvestmentPlan
                    currentPlan={currentPlan}
                    setCurrentPlan={setCurrentPlan}/>,
            proceed: !!currentPlan,
        },

        {
            label: "Choose an Investment Type",
            description: "Having your goals as an individual, or with a group of friends or community, " +
                "we've got you covered.",
            component:
                <StepInvestmentType
                    currentType={currentType}
                    setCurrentType={setCurrentType}/>,
            proceed: !!currentType,
        },

        {
            label: "Investment Terms",
            description: "",
            component:
                <InvestmentSelection
                    selectedTerm={selectedTerm}
                    setSelectedTerm={setSelectedTerm}
                    termDuration={termDuration}
                    setTermDuration={setTermDuration}/>,
            proceed: (!!selectedTerm && !!termDuration)
                || (selectedTerm === 'normal'),
        },

        {
            label: "Investment Terms2",
            description: "",
            component: <StepInvestmentTerms/>,
            proceed: undefined,
        },

        {
            label: "Investment Amount",
            description: "",
            component:
                <StepCreateInvestment
                    selectedPlan={currentPlan}
                    investmentAmount={investmentAmount}
                    setInvestmentAmount={setInvestmentAmount}
                    handleSubmit={function (): void {
                        handleNext();
                        throw new Error("Function not implemented.");
                    }}
                    changePlan={handleReset}/>,
            proceed: false,
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
                        <StepContent TransitionProps={{unmountOnExit: false}}>
                            <Typography gutterBottom>{step.description}</Typography>
                            {step.component}
                            {index !== steps.length - 1 && step.proceed !== undefined &&
                                <Box sx={{mb: 2, mt: 2}}>
                                    <Button
                                        disabled={!step.proceed}
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{mr: 1}}
                                    >
                                        Continue
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{mr: 1}}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            }

                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

function Main() {
    return (
        <>
            <Typography variant='h4' gutterBottom>Create an Investment</Typography>
            <Typography gutterBottom>
                This wizard will help you come up with an investment that aligns with
                your objectives and delivers consistent results.
            </Typography>
            <CreateInvestmentStepper/>

            <Divider sx={{my: 3}}/>
        </>
    )
}

export default Main;
