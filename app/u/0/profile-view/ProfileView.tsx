'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Avatar,
    Typography,
    Grid,
    Container,
    Button,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import VerificationDialog from './VerificationDialogue';

const ProfileView = () => {
    const supabase = createClient();
    const router = useRouter();
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [verificationRequest, setVerificationRequest] = useState<any | null>(
        null
    );
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
        'success'
    );
    const [dialogOpen, setDialogOpen] = useState(false);

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

                const { data: profileData, error: profileError } = await supabase
                    .schema('users')
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    throw profileError;
                }

                setProfile(profileData);

                const { data: verifiedData, error: verifiedError } = await supabase
                    .schema('users')
                    .rpc('is_profile_verified', { profile_id: user.id });

                if (verifiedError) {
                    throw verifiedError;
                }

                setIsVerified(verifiedData);

                const { data: requestData, error: requestError } = await supabase
                    .schema('users')
                    .rpc('get_active_verification_request', { p_profile_id: user.id });

                if (requestError) {
                    throw requestError;
                }

                setVerificationRequest(
                    requestData && requestData.length > 0 ? requestData[0] : null
                );
            } catch (error) {
                console.error('Error fetching profile:', error);
                setSnackbarMessage('Error fetching profile data.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [supabase]);

    const handleRequestVerification = async () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleVerificationSubmit = async (
        facePhoto: File,
        idFrontPhoto: File,
        idBackPhoto: File
    ) => {
        if (!profile) return;

        setDialogOpen(false); // Close the dialog
        setLoading(true); // Show the loading indicator

        try {
            // 1. Upload files to Supabase Storage
            const facePhotoUrl = await uploadFile(facePhoto, 'verification-documents');
            const idFrontPhotoUrl = await uploadFile(idFrontPhoto, 'verification-documents');
            const idBackPhotoUrl = await uploadFile(idBackPhoto, 'verification-documents');

            // 2. Call request_verification function with the file URLs
            const { error: requestError } = await supabase
                .schema('users')
                .rpc('request_verification', {
                    p_profile_id: profile.id,
                    p_face_photo_url: facePhotoUrl,
                    p_id_front_photo_url: idFrontPhotoUrl,
                    p_id_back_photo_url: idBackPhotoUrl,
                });

            if (requestError) {
                throw requestError;
            }

            setSnackbarMessage('Verification request submitted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Update verificationRequest state to reflect the new request
            const { data: requestData, error: activeVerificationRequestError } = await supabase
                .schema('users')
                .rpc('get_active_verification_request', { p_profile_id: profile.id });

            if (activeVerificationRequestError) {
                throw activeVerificationRequestError;
            }

            setVerificationRequest(
                requestData && requestData.length > 0 ? requestData[0] : null
            );
        } catch (error) {
            console.error('Error submitting verification request:', error);
            setSnackbarMessage('Error submitting verification request.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false); // Hide the loading indicator
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleEditProfile = () => {
        const returnTo = window.location.href; // Get current URL
        // TODO: store this redirect URL in the constants
        router.push(`/u/0/profile?returnTo=${encodeURIComponent(returnTo)}`);
    };

    // Helper function to upload a file and return the public URL
    const uploadFile = async (file: File, bucketName: string): Promise<string> => {
        const filePath = `${profile!.id}/${file.name}`; // Unique path for each user and file

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                upsert: true, // If the file already exists at that path, replace it.
            });

        if (uploadError) {
            throw uploadError;
        }

        // Get the public URL of the uploaded file
        const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
        return data.publicUrl;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>Profile not found.</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Use the VerificationDialog component */}
            <VerificationDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleVerificationSubmit}
            />

            <Box my={4}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={'auto'}>
                        <Avatar
                            src={profile.avatar_url || ''}
                            alt={`${profile.first_name} ${profile.last_name}`}
                            sx={{ width: 120, height: 120 }}
                        />
                    </Grid>
                    <Grid item xs>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h4" gutterBottom>
                                {profile.first_name} {profile.last_name}
                            </Typography>
                            {isVerified && (
                                <CheckCircleOutlineIcon
                                    color="primary"
                                    sx={{ ml: 1, fontSize: '28px' }}
                                    titleAccess="Verified"
                                />
                            )}
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary">
                            @{profile.username}
                        </Typography>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={handleEditProfile}
                        >
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>

                <Box mt={4}>
                    <Typography variant="body1">{profile.bio}</Typography>
                </Box>

                <Grid container spacing={2} mt={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Details</Typography>
                        <Box mt={2}>
                            <Typography>
                                <strong>Date of Birth:</strong> {profile.date_of_birth || 'N/A'}
                            </Typography>
                            <Typography>
                                <strong>National ID:</strong>{' '}
                                {profile.national_id_number
                                    ? '*'.repeat(profile.national_id_number.length)
                                    : 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Verification Status</Typography>
                        <Box mt={2}>
                            {isVerified ? (
                                <Chip
                                    icon={<CheckCircleOutlineIcon />}
                                    label="Verified"
                                    color="success"
                                    variant="outlined"
                                />
                            ) : verificationRequest ? (
                                <Chip
                                    icon={<CheckCircleOutlineIcon />}
                                    label="Verification Pending"
                                    color="warning"
                                    variant="outlined"
                                />
                            ) : (
                                <Chip
                                    icon={<ErrorOutlineIcon />}
                                    label="Get Verified"
                                    color="success"
                                    variant="outlined"
                                    onClick={handleRequestVerification}
                                    disabled={!!verificationRequest}
                                    clickable
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ProfileView;
