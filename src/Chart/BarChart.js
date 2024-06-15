import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend);

const BarChart = () => {
  const [exchangeRates, setExchangeRates] = useState(null);

  const apiKey = 'da1aa46a90803e3af907234f'; // Reemplaza con tu clave de API de ExchangeRate-API
  const baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        setExchangeRates(data.conversion_rates);
      } catch (error) {
        console.error("Error fetching exchange rate data: ", error);
      }
    };

    fetchExchangeRates();
  }, [baseUrl]);

  if (!exchangeRates) {
    return <p>Cargando...</p>;
  }

  // Filtrar solo USD y MXN
  const filteredRates = {
    USD: exchangeRates.USD,
    MXN: exchangeRates.MXN
  };

  const data = {
    labels: Object.keys(filteredRates),
    datasets: [{
      label: 'Tipo de Cambio',
      data: Object.values(filteredRates),
      backgroundColor: 'rgba(250, 250, 20, 0.2)',
      borderColor: 'rgba(200, 50, 50, 1)',
      borderWidth: 1,
    }],
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

  return (
    <div style={{ height: '700px' }}>
      <Bar data={data} options={options} height={400} />
    </div>
  );
};

export default BarChart;
