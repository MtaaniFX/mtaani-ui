import {ReactNode} from "react";
import ActionButton from "@/components/internal/ui/ActionButton";
import TestInvestmentComponent from "@/componentpreviews/TestInvestmentPlanCard";

function Components({ children }: { children: ReactNode }) {
    return (
        <div className="m-3">
            <div>CButton</div>
            <ActionButton>Get Started</ActionButton>

            <div>CButton</div>
            <ActionButton icon={
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m-7.5-7.5L19.5 12l-7.5 7.5"
                />
                </svg>}>Get Started</ActionButton>

            <div>InvestmentPlanCard</div>
            <TestInvestmentComponent/>
            <div style={{height: '10em'}}></div>
            {children}
        </div>
    )
}

export default Components;
