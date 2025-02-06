'use client'

import { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    DialogActions,
    Button,
    Typography,
    Snackbar,
    Alert,
    Box,
    styled,
    CircularProgress,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createClient } from '@/utils/supabase/client';
import { uploadFile, type ProgressListeners } from '@/utils/supabase/resumable-uploads';

interface VerificationDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (facePhoto: File, idFrontPhoto: File, idBackPhoto: File) => void;
}

const Input = styled('input')({
    display: 'none',
});

const VerificationDialog = ({
    open,
    onClose,
    onSubmit,
}: VerificationDialogProps) => {
    const [facePhoto, setFacePhoto] = useState<File | null>(null);
    const [idFrontPhoto, setIdFrontPhoto] = useState<File | null>(null);
    const [idBackPhoto, setIdBackPhoto] = useState<File | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
        'success'
    );

    // Refs for the hidden file input elements
    const faceInputRef = useRef<HTMLInputElement>(null);
    const idFrontInputRef = useRef<HTMLInputElement>(null);
    const idBackInputRef = useRef<HTMLInputElement>(null);

    // State for upload progress and retries
    const [uploadProgress, setUploadProgress] = useState<{
        face: number | null;
        idFront: number | null;
        idBack: number | null;
    }>({ face: null, idFront: null, idBack: null });
    const [uploadRetries, setUploadRetries] = useState<{
        face: number;
        idFront: number;
        idBack: number;
    }>({ face: 0, idFront: 0, idBack: 0 });
    const MAX_RETRIES = 3;

    const supabase = createClient();

    const handleDialogClose = () => {
        onClose();
        // Clear files and upload state on close
        setFacePhoto(null);
        setIdFrontPhoto(null);
        setIdBackPhoto(null);
        setUploadProgress({ face: null, idFront: null, idBack: null });
        setUploadRetries({ face: 0, idFront: 0, idBack: 0 });
    };

    const handleSubmit = async () => {
        if (!facePhoto || !idFrontPhoto || !idBackPhoto) {
            setSnackbarMessage('Please upload all required documents.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        // Reset progress and retries
        setUploadProgress({ face: 0, idFront: 0, idBack: 0 });
        setUploadRetries({ face: 0, idFront: 0, idBack: 0 });

        // Perform the upload and other operations (this is where you'd call your RPC function)
        onSubmit(facePhoto, idFrontPhoto, idBackPhoto);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const triggerFaceInput = () => faceInputRef.current?.click();
    const triggerIdFrontInput = () => idFrontInputRef.current?.click();
    const triggerIdBackInput = () => idBackInputRef.current?.click();

    const onFaceFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFacePhoto(file);
            setUploadProgress((prev) => ({ ...prev, face: 0 })); // Reset progress
            setUploadRetries((prev) => ({ ...prev, face: 0 })); // Reset retries
        }
    };

    const onIdFrontFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIdFrontPhoto(file);
            setUploadProgress((prev) => ({ ...prev, idFront: 0 }));
            setUploadRetries((prev) => ({ ...prev, idFront: 0 }));
        }
    };

    const onIdBackFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIdBackPhoto(file);
            setUploadProgress((prev) => ({ ...prev, idBack: 0 }));
            setUploadRetries((prev) => ({ ...prev, idBack: 0 }));
        }
    };

    // Helper function to upload a file with progress and retry
    const uploadFileWithProgressAndRetry = async (
        file: File,
        bucketName: string,
        fileType: 'face' | 'idFront' | 'idBack'
    ): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                reject(userError || new Error("User not found")); 
                return;
            }
            const filePath = `${user.id}/${file.name}`;
            const upload = async (currentRetry: number) => {
                let uploadError: any;
                const _ = await uploadFile(bucketName, filePath, file, {
                    onProgress(bytesSent, bytesTotal) {
                        const progress = {loaded: bytesSent, total: bytesTotal}
                        if (progress.total > 0 && progress.loaded <= progress.total) {
                            const percentage = Math.round(
                                (progress.loaded / progress.total) * 100
                            );
                            setUploadProgress((prev) => ({
                                ...prev,
                                [fileType]: percentage,
                            }));
                        }
                    },
                    onError(error) {
                        uploadError = error;
                    },
                });

                // const { data, error } = await supabase.storage
                //     .from(bucketName)
                //     .upload(filePath, file, {
                //         upsert: true,
                //         // Pass a function to `onUploadProgress` to track progress
                //         onUploadProgress: (progress) => {
                //             if (progress.total > 0 && progress.loaded <= progress.total) {
                //                 const percentage = Math.round(
                //                     (progress.loaded / progress.total) * 100
                //                 );
                //                 setUploadProgress((prev) => ({
                //                     ...prev,
                //                     [fileType]: percentage,
                //                 }));
                //             }
                //         },
                //     });

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    if (currentRetry < MAX_RETRIES) {
                        console.log(`Retrying upload (${currentRetry + 1}/${MAX_RETRIES})...`);
                        setUploadRetries((prev) => ({
                            ...prev,
                            [fileType]: currentRetry + 1,
                        }));
                        // Exponential backoff (wait for 2^currentRetry seconds before retrying)
                        setTimeout(() => upload(currentRetry + 1), 1000 * 2 ** currentRetry);
                    } else {
                        // Reject after max retries
                        reject(uploadError); 
                    }
                } else {
                    // Get the public URL
                    const { data: urlData } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(filePath);
                    resolve(urlData.publicUrl);
                }
            };
            
            // Start the initial upload
            upload(0); 
        });
    };

    return (
        <>
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

            <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Submit Verification Documents
                    <IconButton
                        aria-label="close"
                        onClick={handleDialogClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <ErrorOutlineIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Please upload a recent photo of your face and both sides of your
                        national ID.
                    </Typography>

                    {/* Face Photo Upload */}
                    <Box mt={2}>
                        <label htmlFor="face-photo-upload">
                            <Input
                                accept="image/*"
                                id="face-photo-upload"
                                type="file"
                                onChange={onFaceFileSelected}
                                ref={faceInputRef}
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                onClick={triggerFaceInput}
                                disabled={uploadProgress.face !== null}
                            >
                                {facePhoto ? facePhoto.name : 'Upload Face Photo'}
                            </Button>
                        </label>
                        {uploadProgress.face !== null && (
                            <Box display="flex" alignItems="center" mt={1}>
                                <CircularProgress
                                    variant="determinate"
                                    value={uploadProgress.face}
                                />
                                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                                    {uploadProgress.face}%
                                </Typography>
                                {uploadRetries.face > 0 && uploadProgress.face !== 100 && (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            uploadFileWithProgressAndRetry(
                                                facePhoto!,
                                                'verification-documents',
                                                'face'
                                            )
                                        }
                                    >
                                        Retry
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* ID Front Photo Upload */}
                    <Box mt={2}>
                        <label htmlFor="id-front-photo-upload">
                            <Input
                                accept="image/*,application/pdf"
                                id="id-front-photo-upload"
                                type="file"
                                onChange={onIdFrontFileSelected}
                                ref={idFrontInputRef}
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                onClick={triggerIdFrontInput}
                                disabled={uploadProgress.idFront !== null}
                            >
                                {idFrontPhoto ? idFrontPhoto.name : 'Upload ID Front'}
                            </Button>
                        </label>
                        {uploadProgress.idFront !== null && (
                            <Box display="flex" alignItems="center" mt={1}>
                                <CircularProgress
                                    variant="determinate"
                                    value={uploadProgress.idFront}
                                />
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ ml: 1 }}
                                >
                                    {uploadProgress.idFront}%
                                </Typography>
                                {uploadRetries.idFront > 0 && uploadProgress.idFront !== 100 && (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            uploadFileWithProgressAndRetry(
                                                idFrontPhoto!,
                                                'verification-documents',
                                                'idFront'
                                            )
                                        }
                                    >
                                        Retry
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* ID Back Photo Upload */}
                    <Box mt={2}>
                        <label htmlFor="id-back-photo-upload">
                            <Input
                                accept="image/*,application/pdf"
                                id="id-back-photo-upload"
                                type="file"
                                onChange={onIdBackFileSelected}
                                ref={idBackInputRef}
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                onClick={triggerIdBackInput}
                                disabled={uploadProgress.idBack !== null}
                            >
                                {idBackPhoto ? idBackPhoto.name : 'Upload ID Back'}
                            </Button>
                        </label>
                        {uploadProgress.idBack !== null && (
                            <Box display="flex" alignItems="center" mt={1}>
                                <CircularProgress
                                    variant="determinate"
                                    value={uploadProgress.idBack}
                                />
                                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                                    {uploadProgress.idBack}%
                                </Typography>
                                {uploadRetries.idBack > 0 && uploadProgress.idBack !== 100 && (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            uploadFileWithProgressAndRetry(
                                                idBackPhoto!,
                                                'verification-documents',
                                                'idBack'
                                            )
                                        }
                                    >
                                        Retry
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        disabled={
                            !facePhoto ||
                            !idFrontPhoto ||
                            !idBackPhoto ||
                            uploadProgress.face !== null ||
                            uploadProgress.idFront !== null ||
                            uploadProgress.idBack !== null
                        }
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VerificationDialog;
