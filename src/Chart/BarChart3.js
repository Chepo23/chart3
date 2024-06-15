import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart3 = () => {
  const [bmvData, setBmvData] = useState([]);
  const [sp500Data, setSp500Data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alphaVantageApiKey = 'H3Y1OS1ZF88Q7AZ3';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseBmv = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: 'MXX',
            apikey: alphaVantageApiKey,
          },
        });

        console.log('BMV Data:', responseBmv.data);

        const responseSp500 = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: 'SPY',
            apikey: alphaVantageApiKey,
          },
        });

        console.log('S&P 500 Data:', responseSp500.data);

        if (responseBmv.data['Time Series (Daily)']) {
          const formattedBmvData = formatData(responseBmv.data['Time Series (Daily)']);
          setBmvData(formattedBmvData);
        } else {
          console.error('No Time Series data available for BMV:', responseBmv.data);
        }

        if (responseSp500.data['Time Series (Daily)']) {
          const formattedSp500Data = formatData(responseSp500.data['Time Series (Daily)']);
          setSp500Data(formattedSp500Data);
        } else {
          console.error('No Time Series data available for S&P 500:', responseSp500.data);
        }

        if (responseBmv.data['Time Series (Daily)'] && responseSp500.data['Time Series (Daily)']) {
          setLoading(false);
        } else {
          throw new Error('No data available from API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [alphaVantageApiKey]);

  const formatData = (data) => {
    if (!data) return [];

    return Object.keys(data)
      .slice(0, 10)
      .reverse()
      .map(date => ({
        date,
        value: parseFloat(data[date]['4. close']),
      }));
  };

  const data = {
    labels: bmvData.map(item => item.date),
    datasets: [
      {
        label: 'BMV - IPC',
        data: bmvData.map(item => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'S&P 500',
        data: sp500Data.map(item => item.value),
        backgroundColor: 'rgba(192, 75, 192, 0.2)',
        borderColor: 'rgba(192, 75, 192, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: {
          fontSize: 15,
        },
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ height: '500px' }}>
      <Bar data={data} options={options} height={400} />
    </div>
  );
};

export default BarChart3;
