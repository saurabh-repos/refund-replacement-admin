import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { BACKEND_URL } from 'src/config/config';
import { userRequest } from 'src/requestMethod';
import { useRouter } from 'src/routes/hooks';
import ReportTable from '../app-report-table';

export default function AppView() {
  const [cardData, setCardData] = useState();
  const [filter, setFilter] = useState('weekly');
  const [pieFilter, setPieFilter] = useState('weekly');
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieLoading, setPieLoading] = useState(true);
  const router = useRouter();

  const getData = async () => {
    try {
      const response = await userRequest.get('/admin/getFormStatistics');
      setCardData(response.data?.data);
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getChartData = async () => {
    try {
      setLoading(true);
      const response = await userRequest.get('/admin/getFormBarChartData', {
        params: { period: filter },
      });
      setChartData(response.data?.data?.reverse());
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChartData();
  }, [filter]);

  const getPieChartData = async () => {
    try {
      setPieLoading(true);
      const response = await userRequest.get('/admin/getRegionPieChartData', {
        params: { period: pieFilter },
      });
      setPieChartData(response.data?.data);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setPieLoading(false);
    }
  };

  console.log(pieChartData, 'pieChartData');

  useEffect(() => {
    getPieChartData();
  }, [pieFilter]);

  const getLabel = (data) => {
    switch (filter) {
      case 'yearly':
        return data && data.year;
      case 'monthly':
        return data && data.month;
      case 'weekly':
        return data && data.date;
      default:
        return '';
    }
  };

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'todayRequests':
      case 'totalRequests':
        router.push('/requests');
        break;
      case 'completedRequests':
      case 'pendingRequests':
        router.push('/hierarchy');
        break;
      default:
        break;
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Today Requests"
            total={cardData && cardData.todayForms}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/today-requests.svg" />}
            onClick={() => handleCardClick('todayRequests')}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Requests"
            total={cardData && cardData.totalForms}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/total-requests.svg" />}
            onClick={() => handleCardClick('totalRequests')}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Completed Requests"
            total={cardData && cardData.completedForms}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/completed-requests.svg" />}
            onClick={() => handleCardClick('completedRequests')}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Pending Requests"
            total={cardData && cardData.pendingForms}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/pending-requests.svg" />}
            onClick={() => handleCardClick('pendingRequests')}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <AppWebsiteVisits
              style={{ height: '100%' }}
              title="Total Requests"
              setFilter={setFilter}
              filter={filter}
              chart={{
                labels:
                  chartData && chartData.length > 0 ? chartData.map((data) => getLabel(data)) : [],
                series: [
                  {
                    name: 'Total Requests',
                    type: 'area', // Change to area
                    fill: 'gradient', // Ensure fill is gradient
                    data:
                      chartData && chartData.length > 0
                        ? chartData.map((data) => data?.totalRequests)
                        : [],
                  },
                  {
                    name: 'Completed Requests',
                    type: 'area', // Change to area
                    fill: 'gradient',
                    data:
                      chartData && chartData.length > 0
                        ? chartData.map((data) => data?.completedRequests)
                        : [],
                  },
                  {
                    name: 'Pending Requests',
                    type: 'area', // Change to area
                    fill: 'gradient',
                    data:
                      chartData && chartData.length > 0
                        ? chartData.map((data) => data?.pendingRequests)
                        : [],
                  },
                ],
                colors: ['#ffb40b', '#00a65e', '#da0000'],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          {pieLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <AppCurrentVisits
              title="Region Wise Request"
              setFilter={setPieFilter}
              filter={pieFilter}
              chart={{
                series: pieChartData.map((item) => ({
                  label: item.region.charAt(0) + item.region.slice(1).toLowerCase(),
                  value: Number(item.count),
                })),
              }}
            />
          )}
        </Grid>
      </Grid>
      <Grid container spacing={3} >
        <ReportTable style={{ height: '100%' }}/>
      </Grid>
    </Container>
  );
}
