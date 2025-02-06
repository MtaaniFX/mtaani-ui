'use client'

import React, { useState, useCallback } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { FileUpload, Check, Clear } from '@mui/icons-material';
import { createClient } from '@/utils/supabase/client';

// Define TypeScript interfaces
interface UploadFile {
  file: File | null;
  preview: string;
  progress: number;
  error: string | null;
  uploaded: boolean;
}

interface UploadState {
  passport: UploadFile;
  idFront: UploadFile;
  idBack: UploadFile;
}

// Styled components
const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `2px dashed ${theme.palette.primary.main}`,
  cursor: 'pointer',
  transition: 'border 0.3s ease-in-out',
  '&:hover': {
    border: `2px dashed ${theme.palette.primary.dark}`,
  },
}));

const PreviewImage = styled(Image)({
  objectFit: 'contain',
  width: '100%',
  height: '200px',
});

const DocumentUploadPage = () => {
  const supabase = createClient();
  const [uploads, setUploads] = useState<UploadState>({
    passport: { file: null, preview: '', progress: 0, error: null, uploaded: false },
    idFront: { file: null, preview: '', progress: 0, error: null, uploaded: false },
    idBack: { file: null, preview: '', progress: 0, error: null, uploaded: false },
  });

  const handleFileSelect = useCallback((type: keyof UploadState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setUploads(prev => ({
          ...prev,
          [type]: { ...prev[type], error: 'Please upload an image file' }
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploads(prev => ({
          ...prev,
          [type]: { ...prev[type], error: 'File size should be less than 5MB' }
        }));
        return;
      }

      const preview = URL.createObjectURL(file);
      setUploads(prev => ({
        ...prev,
        [type]: {
          file,
          preview,
          progress: 0,
          error: null,
          uploaded: false,
        }
      }));
    }
  }, []);

  const uploadFile = async (type: keyof UploadState) => {
    const { file } = uploads[type];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    
    try {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file, {
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('verification_requests')
        .insert({
          document_type: type,
          document_url: publicUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) throw dbError;

      setUploads(prev => ({
        ...prev,
        [type]: { ...prev[type], uploaded: true, error: null }
      }));

    } catch (error) {
      setUploads(prev => ({
        ...prev,
        [type]: { ...prev[type], error: 'Upload failed. Please try again.' }
      }));
    }
  };

  const renderUploadBox = (type: keyof UploadState, label: string) => {
    const { preview, progress, error, uploaded } = uploads[type];

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>{label}</Typography>
        <input
          type="file"
          accept="image/*"
          id={`upload-${type}`}
          onChange={handleFileSelect(type)}
          style={{ display: 'none' }}
        />
        <label htmlFor={`upload-${type}`}>
          <UploadBox>
            {!preview ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <FileUpload sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography>Click or drag to upload {label}</Typography>
              </Box>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <PreviewImage
                  src={preview}
                  alt={`Preview ${type}`}
                  width={400}
                  height={200}
                />
                {progress > 0 && progress < 100 && (
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <CircularProgress variant="determinate" value={progress} />
                  </Box>
                )}
              </Box>
            )}
          </UploadBox>
        </label>
        
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
        )}
        
        {preview && !uploaded && (
          <Button
            variant="contained"
            onClick={() => uploadFile(type)}
            sx={{ mt: 1 }}
            startIcon={<FileUpload />}
          >
            Upload {label}
          </Button>
        )}
        
        {uploaded && (
          <Alert icon={<Check />} severity="success" sx={{ mt: 1 }}>
            {label} uploaded successfully!
          </Alert>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Document Verification
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Please upload clear photos of your passport and national ID card for verification.
      </Typography>

      {renderUploadBox('passport', 'Passport Photo')}
      {renderUploadBox('idFront', 'ID Card (Front)')}
      {renderUploadBox('idBack', 'ID Card (Back)')}
    </Box>
  );
};

export default DocumentUploadPage;
