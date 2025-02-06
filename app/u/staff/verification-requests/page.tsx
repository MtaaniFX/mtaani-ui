'use client'

import React, { useState } from 'react';
import { Box, Typography, Grid, Avatar, Card, CardContent, 
         Pagination, Button } from '@mui/material';
import Link from 'next/link';

// Mock verification requests data
const MOCK_REQUESTS = [
  {
    id: '1',
    user: {
      id: 'user1',
      avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'john.doe@example.com',
      full_name: 'John Doe'
    },
    created_at: new Date('2024-02-01T10:30:00Z').toISOString()
  },
  {
    id: '2',
    user: {
      id: 'user2',
      avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'jane.smith@example.com',
      full_name: 'Jane Smith'
    },
    created_at: new Date('2024-02-02T14:45:00Z').toISOString()
  },
  // Add more mock requests as needed (at least 10 for pagination demo)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `${i + 3}`,
    user: {
      id: `user${i + 3}`,
      avatar_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 3}.jpg`,
      email: `user${i + 3}@example.com`,
      full_name: `User ${i + 3}`
    },
    created_at: new Date(Date.now() - i * 86400000).toISOString()
  }))
];

const VerificationRequestsPage = () => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Paginate mock data
  const paginatedRequests = MOCK_REQUESTS.slice(
    (page - 1) * rowsPerPage, 
    page * rowsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Verification Requests
      </Typography>

      <Grid container spacing={3}>
        {paginatedRequests.map((request) => (
          <Grid item xs={12} key={request.id}>
            <Card>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar 
                      src={request.user.avatar_url} 
                      alt={request.user.full_name}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">
                      {request.user.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.user.email}
                    </Typography>
                    <Typography variant="caption">
                      Requested on: {new Date(request.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Link href={`/admin/verification/${request.user.id}`} passHref>
                      <Button variant="contained">
                        Review Details
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={Math.ceil(MOCK_REQUESTS.length / rowsPerPage)} 
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default VerificationRequestsPage;
