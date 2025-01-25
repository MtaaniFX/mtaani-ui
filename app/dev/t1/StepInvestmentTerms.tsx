import React, {useState} from 'react';
import {
    Box,
    FormControl,
    FormHelperText,
    Grid2 as Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import InvestmentPlanCard, {InvestmentPlanCardProps} from "@/customcomponents/InvestmentPlanCard";
import {ReactStateString} from "@/types/react";

type InvestmentType = 'normal' | 'locked';
type LockedTermUnit = 'months' | 'years';

type Props = {
    children?: React.ReactNode,
    selectedTerm: string,
    setSelectedTerm: ReactStateString,
}

function InvestmentTerms({children, selectedTerm, setSelectedTerm}: Props) {
    const selectionCards: InvestmentPlanCardProps[] = [
        {
            selectionModeProps: {
                name: 'terms-selection',
                value: 'normal',
                stateCurrentValue: selectedTerm,
                stateSetCurrentValue: setSelectedTerm,
            },
            recommended: false,
            recommendedText: "Recommended",
            plan: "Normal",
            price: "",
            priceIntro: "",
            features: [
                'Be your own boss',
                'Set your goals',
                'Fund at your own pace',
            ],
            actionText: "",
        },

        {
            selectionModeProps: {
                name: 'terms-selection',
                value: 'locked',
                stateCurrentValue: selectedTerm,
                stateSetCurrentValue: setSelectedTerm,
            },
            recommended: false,
            recommendedText: "",
            plan: "Locked",
            price: "",
            priceIntro: "",
            features: [
                'Manage investments in the group',
                'Outline group goals',
                'Faster funding, huge investments',
            ],
            actionText: "",
        },
    ];

    return (
        <>
            <Typography gutterBottom>
                You can choose to make an investment that offers monthly interest payouts with
                no restrictions on when you can access your funds,
                or you can opt for an investment that will earn returns over a set period.
            </Typography>
            <Grid container
                  spacing={{xs: 2, md: 3}}
                  sx={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                  }}>
                {selectionCards.map((product, index) => (
                    <Grid key={index} size={{xs: 12, md: 6, lg: 4}} >
                        <Box>
                            <InvestmentPlanCard {...product} key={index}/>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {children}
        </>
    )
}

type PageProps = {
    children?: React.ReactNode,
    selectedTerm: string,
    setSelectedTerm: ReactStateString,
    termDuration: string,
    setTermDuration: ReactStateString,
}

const InvestmentSelection: React.FC<PageProps> = (props) => {
    const [years, setYears] = useState('');
    const [months, setMonths] = useState('');
    const [lockedTermUnit, setLockedTermUnit] = useState<LockedTermUnit>('months');
    const [error, setError] = useState<string>('');
    const {selectedTerm, setSelectedTerm, termDuration, setTermDuration} = props;

    // TODO: Reset time duration when switching between terms
    const handleMonthOrYearsChange = (event: React.ChangeEvent<HTMLInputElement>, isYear: boolean) => {
        // const targetYears = parseInt(event.target.value, 10);
        const targetYears = isYear
            ? parseInt(event.target.value, 10)
            : parseInt(years, 10);
        const targetMonths = !isYear
            ? parseInt(event.target.value, 10)
            : parseInt(months, 10);

        if(targetYears > 3 || targetMonths > 3 * 12) {
            setError('Maximum commitment of 3 Years');
            return;
        }

        if(!Number.isNaN(targetYears) && !Number.isNaN(targetMonths) && (targetYears*12+targetMonths) > 3 * 12) {
            setError('Maximum commitment of 3 Years');
            return;
        }

        if(targetYears < 0) {
            setError('Minimum Commitment of 1 Month');
            return;
        }

        if(targetMonths < 0) {
            setError('Minimum Commitment of 1 Month');
            return;
        }

        isYear
            ? setYears(event.target.value)
            : setMonths(event.target.value);

        let totalMonths: number = 0;
        if (!Number.isNaN(targetYears)) {
            totalMonths += targetYears * 12;
        }
        if (!Number.isNaN(targetMonths)) {
            totalMonths += targetMonths;
        }

        setTermDuration(totalMonths.toString(10));
        setError('');
    };

    const handleMonthsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleMonthOrYearsChange(event, false);
    };

    const handleYearsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleMonthOrYearsChange(event, true);
    };

    const handleLockedTermUnitChange = (event: any) => {
        setLockedTermUnit(event.target.value as LockedTermUnit);
        // Reset values when switching between units
        setYears('');
        setMonths('');
    };

    return (
        <div>
            {/* Investment Type Selection */}
            <InvestmentTerms
                selectedTerm={selectedTerm}
                setSelectedTerm={setSelectedTerm}/>

            {/* Conditional Rendering for Locked Term */}
            {selectedTerm === 'locked' && (
                <div>
                    <Typography variant="body1" sx={{mt: 2}}>
                        Since you’ve selected a locked investment, please specify the duration:
                    </Typography>

                    <Grid container columnSpacing={2}>
                        {/* Year Input */}
                        {lockedTermUnit === 'years' && (
                            <Grid spacing={{xs: 2, md: 3}}>
                                <TextField
                                    label="Years"
                                    type="number"
                                    value={years}
                                    onChange={handleYearsChange}
                                    variant="outlined"
                                    margin="normal"
                                    error={!!error}
                                    helperText={error || 'Duration in years'}
                                />
                            </Grid>
                        )}

                        {/* Month Input */}
                        <Grid spacing={{xs: 2, md: 3}}>
                            <TextField
                                label="Months"
                                type="number"
                                value={months}
                                onChange={handleMonthsChange}
                                variant="outlined"
                                margin="normal"
                                error={!!error}
                                helperText={error || 'Duration in months'}
                            />
                        </Grid>

                        {/* Term Unit Selection */}
                        <Grid spacing={{xs: 2, md: 3}}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Term Unit</InputLabel>
                                <Select value={lockedTermUnit} onChange={handleLockedTermUnitChange} label="Term Unit">
                                    <MenuItem value="months">Months</MenuItem>
                                    <MenuItem value="years">Years</MenuItem>
                                </Select>
                                <FormHelperText>Select how long your investment will be locked</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

export default InvestmentSelection;
