"use client"

import React, { useState, ChangeEvent } from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    IconButton,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { createClient } from "@/utils/supabase/client";

const supabaseClient = createClient();

const ProfilePage: React.FC = () => {
    // Form States
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        nationalId: '',
        dateOfBirth: null as Dayjs | null,
        bio: '',
    });

    // Avatar States
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Responsive Design
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    // Handle Form Input Changes
    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle Date Change separately for dateOfBirth
    const handleDateChange = (date: Dayjs | null) => {
        setFormData((prevData) => ({
            ...prevData,
            dateOfBirth: date,
        }));
    };

    // Handle Avatar Change and Upload
    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const fileName = `${Date.now()}-${file.name}`;

            setUploadProgress(0);

            const { data, error } = await supabaseClient.storage
                .from('avatars')
                .upload(fileName, file);

            // .upload(fileName, file, {
            //   onUploadProgress: (progress) => {
            //     const percentage = Math.round((progress.loaded / progress.total) * 100);
            //     setUploadProgress(percentage);
            //   },
            // });

            setUploadProgress(null); // Reset progress after upload

            if (error) {
                console.error('Error uploading file:', error.message);
                return;
            }

            const { data: avatarData } = supabaseClient.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setAvatarUrl(avatarData.publicUrl); // Set the public URL for the new avatar
        }
    };

    // Handle Form Submit
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formattedDate = formData.dateOfBirth
            ? dayjs(formData.dateOfBirth).toISOString()
            : null; // Format date to UTC for storage

        const { error } = await supabaseClient
            .from('profiles')
            .upsert({
                username: formData.username,
                first_name: formData.firstName,
                last_name: formData.lastName,
                national_id: formData.nationalId,
                date_of_birth: formattedDate,
                bio: formData.bio,
                avatar_url: avatarUrl,
            });

        if (error) {
            console.error('Error saving profile details:', error.message);
        } else {
            alert('Profile saved successfully!');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isSmallScreen ? 'center' : 'flex-start',
                padding: 4,
            }}
        >
            {/* Avatar Section */}
            <Box
                sx={{
                    position: 'relative',
                    marginBottom: 2,
                }}
            >
                <Avatar
                    src={avatarUrl || '/default-avatar.png'}
                    sx={{
                        width: 100,
                        height: 100,
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    {/* Default text/avatar when no image */}
                </Avatar>
                {uploadProgress !== null ? (
                    <CircularProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 100,
                            height: 100,
                            zIndex: 1,
                        }}
                    />
                ) : (
                    <IconButton
                        component="label"
                        sx={{
                            position: 'absolute',
                            bottom: -5,
                            right: -5,
                            backgroundColor: 'white',
                            boxShadow: 1,
                        }}
                    >
                        <EditIcon color="primary" />
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </IconButton>
                )}
            </Box>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="National ID Card Number"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker 
                        label="Date of Birth"
                        defaultValue={dayjs('2022-04-17')} 
                        onChange={handleDateChange}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Save Profile
                </Button>
            </form>

            {/* Avatar Fullscreen Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogContent sx={{ textAlign: 'center', position: 'relative' }}>
                    <IconButton
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                        onClick={() => setIsDialogOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Avatar
                        src={avatarUrl || '/default-avatar.png'}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: 300,
                            margin: '0 auto',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ProfilePage;
