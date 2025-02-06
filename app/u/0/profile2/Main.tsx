'use client'

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Button, TextField, Container, Typography, Alert, AlertTitle } from '@mui/material';

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    id_number: string;
    profile_picture: string;
    bio: string;
    username: string;
}

const UpdateProfilePage = () => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        id: '',
        first_name: '',
        last_name: '',
        id_number: '',
        profile_picture: '',
        bio: '',
        username: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    throw new Error('User not found');
                }

                const { data, error } = await supabase.schema('mtaani')
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                setProfile(data as Profile);
            } catch (error: any) {
                setError(error.message || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [supabase]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not found');
            }

            const { error } = await supabase
                .schema('mtaani')
                .rpc('update_profile', {
                    p_user_id: user.id,
                    p_first_name: profile.first_name,
                    p_last_name: profile.last_name,
                    p_id_number: profile.id_number,
                    p_profile_picture: profile.profile_picture,
                    p_bio: profile.bio,
                    p_username: profile.username,
                });

            if (error) {
                throw error;
            }

            setSuccess(true);
        } catch (error: any) {
            setError(error.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Update Profile
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    <AlertTitle>Success</AlertTitle>
                    Profile updated successfully!
                </Alert>
            )}

            {loading && <Typography>Loading...</Typography>}

            {!loading && profile && (
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="ID Number"
                        name="id_number"
                        value={profile.id_number}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Profile Picture (URL)"
                        name="profile_picture"
                        value={profile.profile_picture}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={profile.username}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        Update Profile
                    </Button>
                </form>
            )}
        </Container>
    );
};

export default UpdateProfilePage;
