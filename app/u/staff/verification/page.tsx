'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  Button, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock data fetching function to simulate API
const fetchVerificationDetails = async (userId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data structure matching likely verification details
  return {
    user: {
      id: userId,
      full_name: `User ${userId}`,
      email: `${userId}@example.com`,
      phone: '+1234567890'
    },
    documents: {
      passport: `https://picsum.photos/seed/passport-${userId}/400/300`,
      idFront: `https://picsum.photos/seed/id-front-${userId}/400/300`,
      idBack: `https://picsum.photos/seed/id-back-${userId}/400/300`
    }
  };
};

const VerificationDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId  = searchParams.get("userId") ?? "user101";

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchVerificationDetails(userId as string)
        .then(data => {
          setDetails(data);
          setLoading(false);
        });
    }
  }, [userId]);

  const handleApprove = () => {
    // Implement approval logic
    setApprovalDialogOpen(true);
  };

  const handleReject = () => {
    // Implement rejection logic
    setRejectionDialogOpen(true);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Verification Details
      </Typography>

      <Grid container spacing={3}>
        {/* User Details */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">User Information</Typography>
              <Typography>Name: {details.user.full_name}</Typography>
              <Typography>Email: {details.user.email}</Typography>
              <Typography>Phone: {details.user.phone}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Images */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {Object.entries(details.documents).map(([type, url]) => (
              <Grid item xs={12} md={4} key={type}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">{type.toUpperCase()}</Typography>
                    <img
                      src={url as string} 
                      alt={`${type} document`} 
                      width={400} 
                      height={300} 
                      style={{ objectFit: 'cover' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleApprove}
        >
          Approve Verification
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleReject}
        >
          Reject Verification
        </Button>
      </Box>

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialogOpen}>
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this verification?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
          <Button color="success">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Confirmation Dialog */}
      <Dialog open={rejectionDialogOpen}>
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this verification?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialogOpen(false)}>Cancel</Button>
          <Button color="error">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default function Page(){
  return (
      <>
        <Suspense>
          <VerificationDetailsPage/>
        </Suspense>
      </>
  )
}
