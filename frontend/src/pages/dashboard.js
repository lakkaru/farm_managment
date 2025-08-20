import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
} from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();
  
  const stats = [
    {
      title: 'Total Farms',
      value: '5',
      color: theme.palette.success.main,
    },
    {
      title: 'Active Crops',
      value: '23',
      color: theme.palette.primary.main,
    },
    {
      title: 'Livestock',
      value: '156',
      color: theme.palette.warning.main,
    },
    {
      title: 'Inventory Items',
      value: '89',
      color: theme.palette.secondary.main,
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Overview of your farm operations
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={2}
              sx={{ 
                borderLeft: `4px solid ${stat.color}`,
                height: '100%',
              }}
            >
              <CardContent>
                <Typography 
                  variant="overline" 
                  color="textSecondary" 
                  sx={{ 
                    fontWeight: 600,
                    display: 'block',
                    mb: 1,
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Recent farm activities will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
