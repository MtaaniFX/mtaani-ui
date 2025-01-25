'use client'

import React, {ReactNode, useState} from "react";
import Stack from "@mui/material/Stack";
import InvestmentPlanCard, {
    InvestmentPlanCardProps
} from "@/customcomponents/InvestmentPlanCard";

function StepInvestmentPlan({ children }: { children?: ReactNode }) {
    const [currentPlan, setCurrentPlan] = useState('');
    let fifth: typeof setCurrentPlan;
    const selectionCards: InvestmentPlanCardProps[] = [
        {
            selectionModeProps: {
                name: 'plan-selection',
                value: 'starter',
                stateCurrentValue: currentPlan,
                stateSetCurrentValue: setCurrentPlan,
            },
            recommended: false,
            recommendedText: "",
            plan: "Starter",
            price: "KES 10,000",
            priceIntro: "from",
            features: [
                'Investment upto KES 50,000',
                '10% Monthly Returns',
                'Best for new investors',
                'Minimal entry, full flexibility',
            ],
            actionText: "Get Started",
        },

        {
            selectionModeProps: {
                name: "plan-selection",
                value: "growth",
                stateCurrentValue: currentPlan,
                stateSetCurrentValue: setCurrentPlan,
            },
            recommended: true,
            recommendedText: "Recommended",
            plan: "Growth",
            price: "KES 50,000",
            priceIntro: "from",
            features: [
                'Investment upto KES 100,000',
                '10% Monthly Returns',
                'Best for growing investors',
                'Full flexibility',
            ],
            actionText: "Go For It",
        },

        {
            selectionModeProps: {
                name: "plan-selection",
                value: "premium",
                stateCurrentValue: currentPlan,
                stateSetCurrentValue: setCurrentPlan,
            },
            recommended: false,
            recommendedText: "",
            plan: "Premium",
            price: "KES 100,000",
            priceIntro: "from",
            features: [
                'Investment upto KES 500,000',
                '10% Monthly Returns',
                'Best for heavy investors',
                'Full flexibility',
            ],
            actionText: "Let's Do This",
        },
    ];

    return (
        <>
            <Stack direction={'row'} spacing={2}>
                {selectionCards.map((product, index) => (
                    <InvestmentPlanCard {...product} key={index}/>
                ))}
            </Stack>
            {children}
        </>
    )
}

export default StepInvestmentPlan;
