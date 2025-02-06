'use client'

import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface UserProfile {
    username: string;
    first_name: string;
    last_name: string;
    date_of_birth: Dayjs| null;
    national_id_number: string;
    avatar_url: string;
    bio: string;
}

async function getUserData() {
    const { error, data } = await supabase.auth.getUser();
    if (error) {
        console.error(error);
        return null;
    }

    const userId = data.user.id;
    if (!userId) {
        console.error("User ID is undefined");
        return null;
    }

    return { UserId: userId, UserData: data.user };
}

export default function ProfileEditView() {
    const [profile, setProfile] = useState<UserProfile>({
        username: '',
        first_name: '',
        last_name: '',
        date_of_birth: null,
        national_id_number: '',
        avatar_url: '',
        bio: ''
    });

    useEffect(() => {
        async function f() {
            const userData = await getUserData();
            if (!userData) {
                return;
            }

            const { data, error} = await supabase
                .schema('users')
                .from("profiles")
                .select('*')
                .eq('id', userData.UserId)
                .single();
            
            if(error) {
                console.error('Failed to fetch user profile');
                return;
            }

            const profile = data as UserProfile;
            if (profile.date_of_birth) {
                profile.date_of_birth = dayjs(profile.date_of_birth);
            } else {
                profile.date_of_birth = null;
            }

            console.log('user data: ', data);
            console.log('profile: ', profile);
            setProfile(profile);
        }

        f();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date: Dayjs | null) => {
        setProfile(prev => ({
            ...prev,
            date_of_birth: date
        }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const data = await getUserData();
        if (!data) {
            return;
        }
        const userId = data.UserId;

        const file = e.target.files?.[0];
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Math.random()}.${fileExt}`;
            const filePath = `users/${fileName}`;

            try {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                console.log('avatar url: ', urlData);

                setProfile(prev => ({
                    ...prev,
                    avatar_url: urlData.publicUrl
                }));
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = await getUserData();
        if (!data) {
            return;
        }
        const userId = data.UserId;

        try {
            console.log('saving profile:', profile);
            
            const { error } = await supabase
                .schema('users')
                .from('profiles')
                .upsert({
                    id: userId,
                    ...profile
                });

            if (error) throw error;

            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 4
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Profile
                    </Typography>

                    <Avatar
                        src={profile.avatar_url}
                        sx={{ width: 100, height: 100, marginBottom: 2 }}
                    />

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleAvatarUpload}
                    />
                    <label htmlFor="avatar-upload">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{ marginBottom: 2 }}
                        >
                            Upload Avatar
                        </Button>
                    </label>

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={profile.username}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="National ID Number"
                                    name="national_id_number"
                                    value={profile.national_id_number}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="first_name"
                                    value={profile.first_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    value={profile.last_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                 <DatePicker
                                    label="Date of Birth"
                                    value={profile.date_of_birth}
                                    onChange={handleDateChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Bio"
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Save Profile
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </LocalizationProvider>
    );
};
