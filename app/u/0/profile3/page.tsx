'use client'

import { useState } from 'react';
// import { supabase } from '../utils/supabaseClient'; // Initialize Supabase client
import { Button, LinearProgress, Typography, Container, Box, Grid } from '@mui/material';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const UploadPage = () => {
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [idFrontPhoto, setIdFrontPhoto] = useState<File | null>(null);
  const [idBackPhoto, setIdBackPhoto] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'passport') setPassportPhoto(file);
      if (type === 'idFront') setIdFrontPhoto(file);
      if (type === 'idBack') setIdBackPhoto(file);

      // Generate preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({ ...prev, [type]: previewUrl }));
    }
  };

  const handleUpload = async () => {
    if (!passportPhoto || !idFrontPhoto || !idBackPhoto) {
      alert('Please upload all required files.');
      return;
    }

    const files = [
      { type: 'passport', file: passportPhoto },
      { type: 'idFront', file: idFrontPhoto },
      { type: 'idBack', file: idBackPhoto },
    ];

    const uploadPromises = files.map(async ({ type, file }) => {
      const filePath = `${type}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Update progress
      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));

      return { type, url: data?.path };
    });

    try {
      const results = await Promise.all(uploadPromises);
      const urls = results.reduce((acc, { type, url }) => ({ ...acc, [type]: url }), {});

      // Save URLs to the database
      const { data: user } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('verification_requests').insert([
          {
            user_id: user.user?.id,
            // passport_photo_url: urls['passport'],
            // id_front_url: urls['idFront'],
            // id_back_url: urls['idBack'],
          },
        ]);

        if (error) throw error;
      }

      alert('Upload successful!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload Verification Documents
      </Typography>
      <Grid container spacing={3}>
        {['passport', 'idFront', 'idBack'].map((type) => (
          <Grid item xs={12} md={4} key={type}>
            <Box>
              <Typography variant="h6">{`${type === 'passport' ? 'Passport Photo' : type === 'idFront' ? 'ID Front' : 'ID Back'}`}</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, type)}
                style={{ marginBottom: '10px' }}
              />
              {previewUrls[type] && (
                <img
                  src={previewUrls[type]}
                  alt={`Preview ${type}`}
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                />
              )}
              {uploadProgress[type] !== undefined && (
                <LinearProgress variant="determinate" value={uploadProgress[type]} />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: '20px' }}>
        Upload All
      </Button>
    </Container>
  );
};

export default UploadPage;
