'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { createClient } from '@/utils/supabase/client';

const PhoneVerificationPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();

    // Fetch the latest verification status for the logged-in user
    const fetchVerificationStatus = async () => {
        setLoading(true);
        setError('');
        try {
            const {data: {user}}  = await supabase.auth.getUser();
            if (!user) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .schema('users')
                .from('phone_verification_requests')
                .select('status')
                .eq('user_id', user.id)
                .order('requested_at', { ascending: false })
                .limit(1)
                .single();

            if (error) throw error;
            setStatus(data?.status || 'No verification request found.');
        } catch (err: any) {
            setError(err?.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVerificationStatus();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (!phoneNumber) {
            setError('Please enter your phone number.');
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.schema('users')
                .from('phone_verification_requests')
                .insert([{ phone_number: phoneNumber }]);
            if (error) throw error;
            await fetchVerificationStatus();
            setPhoneNumber('');
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Phone Verification
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                {error && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
                    {loading ? 'Submitting...' : 'Request Verification'}
                </Button>
            </form>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Current Verification Status:</Typography>
                {loading ? (
                    <Typography>Loading status...</Typography>
                ) : (
                    <Typography>{status || 'No verification request found.'}</Typography>
                )}
            </Box>
        </Box>
    );
};

export default PhoneVerificationPage;
