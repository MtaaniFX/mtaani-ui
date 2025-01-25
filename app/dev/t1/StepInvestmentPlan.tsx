import React, {ReactNode} from "react";
import Stack from "@mui/material/Stack";
import InvestmentPlanCard, {
    InvestmentPlanCardProps
} from "@/customcomponents/InvestmentPlanCard";
import {ReactStateString} from "@/types/react";
import {Grid2 as Grid} from "@mui/material";

function StepInvestmentPlan({ children, currentPlan, setCurrentPlan }: { children?: ReactNode, currentPlan: string, setCurrentPlan: ReactStateString }) {
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
            <Grid container
                  spacing={{xs: 2, md: 3}}
                  sx={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                  }}>
                {selectionCards.map((product, index) => (
                    <Grid key={index} size={{xs: 12, md: 6, lg: 4}} >
                        <InvestmentPlanCard {...product} key={index}/>
                    </Grid>
                ))}
            </Grid>
            {children}
        </>
    )
}

export default StepInvestmentPlan;
