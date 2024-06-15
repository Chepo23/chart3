import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const BarChart2 = () => {
  const [stockData, setStockData] = useState(null);
  const apiKey = 'H3Y1OS1ZF88Q7AZ3';
  const baseUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${apiKey}`;

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        setStockData(data['Time Series (Daily)']);
      } catch (error) {
        console.error("Error fetching stock data: ", error);
      }
    };

    fetchStockData();
  }, [baseUrl]);

  if (!stockData) {
    return <p>Cargando...</p>;
  }

  // Procesar los datos para el gráfico
  const dates = Object.keys(stockData).slice(0, 10).reverse(); // Limitar a los últimos 10 días y revertir para mostrar cronológicamente
  const volumes = dates.map(date => stockData[date]['5. volume']);

  const data = {
    labels: dates,
    datasets: [{
      label: 'Volumen de Acciones',
      data: volumes,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
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
    <div style={{ height: '500px' }}>
      <Bar data={data} options={options} height={400} />
    </div>
  );
};

export default BarChart2;
