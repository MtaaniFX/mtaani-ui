'use client'

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './supabase-types';

type InvestmentPlan = Database['public']['Tables']['investment_plans']['Row'];
type InvestmentType = Database['public']['Tables']['investment_types']['Row'];
type InvestmentTerm = Database['public']['Tables']['investment_terms']['Row'];

const CreateInvestment: React.FC = () => {
    const supabase = createClientComponentClient<Database>();
    const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
    const [selectedType, setSelectedType] = useState<InvestmentType | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<InvestmentTerm | null>(null);
    const [investmentAmount, setInvestmentAmount] = useState<number | undefined>();
    const [groupName, setGroupName] = useState<string>('');
    const [groupDescription, setGroupDescription] = useState<string>('');
    const [groupMembers, setGroupMembers] = useState<string[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState<string>('');
    const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
    const [investmentTypes, setInvestmentTypes] = useState<InvestmentType[]>([]);
    const [investmentTerms, setInvestmentTerms] = useState<InvestmentTerm[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch investment plans
                const { data: plans, error: plansError } = await supabase
                    .from('investment_plans')
                    .select('*');
                if (plansError) throw plansError;
                setInvestmentPlans(plans || []);

                // Fetch investment types
                const { data: types, error: typesError } = await supabase
                    .from('investment_types')
                    .select('*');
                if (typesError) throw typesError;
                setInvestmentTypes(types || []);

                // Fetch investment terms
                const { data: terms, error: termsError } = await supabase
                    .from('investment_terms')
                    .select('*');
                if (termsError) throw termsError;
                setInvestmentTerms(terms || []);
            } catch (err: any) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [supabase]);

    const handlePlanSelect = (plan: InvestmentPlan) => {
        setSelectedPlan(plan);
        setInvestmentAmount(undefined); // Reset amount when plan changes
    };

    const handleTypeSelect = (type: InvestmentType) => {
        setSelectedType(type);
        setSelectedTerm(null); // Reset term when type changes
        setGroupName(''); // Reset group details when type changes
        setGroupDescription('');
        setGroupMembers([]);
    };

    const handleTermSelect = (term: InvestmentTerm) => {
        setSelectedTerm(term);
    };

    const handleAddMember = () => {
        if (newMemberEmail && !groupMembers.includes(newMemberEmail)) {
            setGroupMembers([...groupMembers, newMemberEmail]);
            setNewMemberEmail('');
        }
    };

    const handleSubmit = async () => {
        if (!selectedPlan || !selectedType) {
            setError('Please select an investment plan and type.');
            return;
        }
        if (selectedType.name === 'Individual' && !selectedTerm) {
            setError('Please select investment terms for the Individual type.');
            return;
        }
        if (
            selectedType.name === 'Group' &&
            (!groupName || groupMembers.length === 0)
        ) {
            setError('Please provide a group name and add at least one member.');
            return;
        }
        if (
            investmentAmount === undefined ||
            investmentAmount < selectedPlan.min_amount ||
            investmentAmount > selectedPlan.max_amount
        ) {
            setError(
                `Investment amount must be between ${selectedPlan.min_amount} and ${selectedPlan.max_amount}`,
            );
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('User not authenticated');

            let group_id: string | undefined;

            if (selectedType.name === 'Group') {
                const { data: group, error: groupError } = await supabase
                    .from('group_investments')
                    .insert([
                        {
                            name: groupName,
                            description: groupDescription,
                            created_by: user.id,
                        },
                    ])
                    .select()
                    .single();
                if (groupError) throw groupError;
                group_id = group?.id;

                // Insert each group member into user_investments
                for (const email of groupMembers) {
                    const { error: memberError } = await supabase
                        .from('user_investments')
                        .insert([
                            {
                                user_id: user.id, // Ideally, we'd lookup each user by email
                                investment_plan_id: selectedPlan.id,
                                investment_type_id: selectedType.id,
                                group_id,
                                amount: investmentAmount / groupMembers.length, // Assuming equal split
                                status: 'pending',
                            },
                        ]);
                    if (memberError) throw memberError;
                }
            } else {
                // For Individual type, insert directly into user_investments
                const { error: userInvestmentError } = await supabase
                    .from('user_investments')
                    .insert([
                        {
                            user_id: user.id,
                            investment_plan_id: selectedPlan.id,
                            investment_type_id: selectedType.id,
                            investment_term_id: selectedTerm?.id,
                            amount: investmentAmount,
                            status: 'pending',
                            locked_until:
                                selectedTerm?.name === 'Locked'
                                    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Example: Locked for 30 days
                                        .toISOString()
                                    : undefined,
                        },
                    ]);
                if (userInvestmentError) throw userInvestmentError;
            }

            setSuccess(true);
            // Reset form
            setSelectedPlan(null);
            setSelectedType(null);
            setSelectedTerm(null);
            setInvestmentAmount(undefined);
            setGroupName('');
            setGroupDescription('');
            setGroupMembers([]);
        } catch (err: any) {
            setError(err.message || 'Error creating investment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create Investment Plan
            </Typography>

            {/* Investment Plan Selection */}
            <Typography variant="h6">Select Investment Plan</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {investmentPlans.map((plan) => (
                    <Grid item xs={12} sm={4} key={plan.id}>
                        <Card
                            onClick={() => handlePlanSelect(plan)}
                            sx={{
                                cursor: 'pointer',
                                backgroundColor:
                                    selectedPlan?.id === plan.id ? 'primary.light' : 'white',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{plan.name}</Typography>
                                <Typography>
                                    Amount Range: {plan.min_amount} - {plan.max_amount}
                                </Typography>
                                <Typography>Interest Rate: {plan.interest_rate}%</Typography>
                                <ul>
                                    {plan.features &&
                                        (plan.features as unknown as string[]).map((feature) => (
                                            <li key={feature}>{feature}</li>
                                        ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Investment Type Selection */}
            <Typography variant="h6">Select Investment Type</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {investmentTypes.map((type) => (
                    <Grid item xs={12} sm={6} key={type.id}>
                        <Card
                            onClick={() => handleTypeSelect(type)}
                            sx={{
                                cursor: 'pointer',
                                backgroundColor:
                                    selectedType?.id === type.id ? 'primary.light' : 'white',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{type.name}</Typography>
                                <ul>
                                    {type.features &&
                                        (type.features as unknown as string[]).map((feature) => (
                                            <li key={feature}>{feature}</li>
                                        ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Conditional Rendering based on Investment Type */}
            {selectedType?.name === 'Individual' && (
                <>
                    <Typography variant="h6">Select Investment Terms</Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {investmentTerms.map((term) => (
                            <Grid item xs={12} sm={6} key={term.id}>
                                <Card
                                    onClick={() => handleTermSelect(term)}
                                    sx={{
                                        cursor: 'pointer',
                                        backgroundColor:
                                            selectedTerm?.id === term.id ? 'primary.light' : 'white',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{term.name}</Typography>
                                        <ul>
                                            {term.features &&
                                                (term.features as unknown as string[]).map((feature) => (
                                                    <li key={feature}>{feature}</li>
                                                ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {selectedType?.name === 'Group' && (
                <>
                    <TextField
                        label="Group Name"
                        fullWidth
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Group Description (Optional)"
                        fullWidth
                        multiline
                        rows={3}
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Add Member Email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            sx={{ mr: 1 }}
                        />
                        <Button variant="outlined" onClick={handleAddMember}>
                            Add
                        </Button>
                    </Box>
                    <Typography variant="body1">Group Members:</Typography>
                    <ul>
                        {groupMembers.map((member) => (
                            <li key={member}>{member}</li>
                        ))}
                    </ul>
                </>
            )}

            {/* Investment Amount Input */}
            {selectedPlan && (
                <TextField
                    label="Investment Amount"
                    type="number"
                    fullWidth
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(parseFloat(e.target.value))}
                    inputProps={{
                        min: selectedPlan.min_amount,
                        max: selectedPlan.max_amount,
                    }}
                    sx={{ mb: 3 }}
                    helperText={`Enter amount between ${selectedPlan.min_amount} and ${selectedPlan.max_amount}`}
                />
            )}

            {/* Submit Button */}
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedPlan || !selectedType || loading}
            >
                Create Investment
            </Button>

            {/* Success Message */}
            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Investment created successfully!
                </Alert>
            )}
        </Box>
    );
};

export default CreateInvestment;
