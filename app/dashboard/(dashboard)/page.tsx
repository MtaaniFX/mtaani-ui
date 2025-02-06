'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  TablePagination,
  CircularProgress
} from '@mui/material';
import {
  VerifiedUser,
  Phone,
  Warning,
  AccountBalance,
  Payment
} from '@mui/icons-material';


type UserVerification = {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

type InvestmentPlan = {
  id: string;
  name: string;
  category: 'starter' | 'growth' | 'premium';
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  duration: string;
  features: string[];
}

type UserInvestment = {
  id: string;
  planId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'pending';
  currentValue: number;
}

export default function DashboardOverview() {
  const router = useRouter();
  const [verification, setVerification] = useState<UserVerification | null>(null);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchUserData();
    fetchInvestmentPlans();
    fetchUserInvestments();
  }, []);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('user_verification')
      .select('*')
      .single();

    if (data) setVerification(data);
  };

  const fetchInvestmentPlans = async () => {
    const { data } = await supabase
      .from('investment_plans')
      .select('*');

    if (data) setPlans(data);

    const mockPlans: InvestmentPlan[] = [
      {
        id: "",
        name: '',
        category: 'starter',
        minAmount: 10_000,
        maxAmount: 50_000,
        interestRate: 20,
        duration: '',
        features: ['f1', 'f2'],
      }
    ];
    setPlans(mockPlans);
  };

  const fetchUserInvestments = async () => {
    const { data } = await supabase
      .from('user_investments')
      .select('*')
      .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

    if (data) setUserInvestments(data);
    setLoading(false);
  };

  const VerificationCard = ({ type }: { type: 'email' | 'phone' }) => (
    <Card
      variant="outlined"
      sx={{
        cursor: 'pointer',
        bgcolor: 'error.light',
        color: 'white',
        '&:hover': { bgcolor: 'error.main' }
      }}
      onClick={() => router.push(`/settings/${type}-verification`)}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {type === 'email' ? <VerifiedUser /> : <Phone />}
        <Typography>
          {type === 'email' ? 'Verify you Account' : 'Verify your phone number'}
        </Typography>
      </CardContent>
    </Card>
  );

  const PlanCard = ({ plan }: { plan: InvestmentPlan }) => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {plan.name}
          <Chip
            label={plan.category}
            size="small"
            sx={{ ml: 1 }}
            color={
              plan.category === 'premium' ? 'primary' :
                plan.category === 'growth' ? 'secondary' : 'default'
            }
          />
        </Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          {plan.interestRate}% APY
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {plan.minAmount} - {plan.maxAmount} KES
        </Typography>
        {plan.features.map((feature, index) => (
          <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            • {feature}
          </Typography>
        ))}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => router.push(`/invest/new?plan=${plan.id}`)}
        >
          Invest Now
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      {/* Verification Alerts */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {!verification?.isEmailVerified && (
          <Grid item xs={12} md={6}>
            <VerificationCard type="email" />
          </Grid>
        )}
        {!verification?.isPhoneVerified && (
          <Grid item xs={12} md={6}>
            <VerificationCard type="phone" />
          </Grid>
        )}
      </Grid>

      {/* Investment Plans
            <Typography variant="h5" gutterBottom>Investment Plans</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {plans.map((plan) => (
                    <Grid item xs={12} md={4} key={plan.id}>
                        <PlanCard plan={plan} />
                    </Grid>
                ))}
            </Grid> */}

      {/* User Investments */}
      <Typography variant="h5" gutterBottom>Your Investments</Typography>
      {userInvestments.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {userInvestments.map((investment) => (
              <Grid item xs={12} md={6} key={investment.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Investment #{investment.id}
                      <Chip
                        label={investment.status}
                        size="small"
                        sx={{ ml: 1 }}
                        color={
                          investment.status === 'active' ? 'success' :
                            investment.status === 'pending' ? 'warning' : 'default'
                        }
                      />
                    </Typography>
                    <Typography variant="body1">
                      Amount: {investment.amount} KES
                    </Typography>
                    <Typography variant="body1">
                      Current Value: {investment.currentValue} KES
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start Date: {new Date(investment.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      End Date: {new Date(investment.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <TablePagination
            component="div"
            count={-1}
            page={page}
            onPageChange={(_, newPage) => {
              setPage(newPage);
              fetchUserInvestments();
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
              fetchUserInvestments();
            }}
          />
        </>
      ) : (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <AccountBalance sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Active Investments
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Start your investment journey today and watch your money grow!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/invest/new')}
            >
              Start Investing
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card sx={{ my: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment /> Payment Methods
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src="/res/regulatory/lipa-na-m-pesa.png"
              alt="MPesa"
              style={{ height: 40 }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
