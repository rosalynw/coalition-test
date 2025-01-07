import { fetchUser } from "./index.js";

function formatMonthYear(month, year) {
  const date = new Date(`${month}, ${year}`);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}


document.addEventListener("DOMContentLoaded", async function () {

  const userData =  await fetchUser();

  if (userData) {
  const ctx = document.getElementById('blood-pressure-chart').getContext('2d');
  const diagnosisData = userData.diagnosis_history.slice(0, 6).reverse();
  const labels = diagnosisData.map(label => formatMonthYear(label.month, label.year))
  const systolicData = diagnosisData.map(data => data.blood_pressure.systolic.value);
  const diastolicData = diagnosisData.map(data => data.blood_pressure.diastolic.value);

  const chartColors = {
    pink: 'rgb(230, 111, 210)',
    purple: 'rgb(140, 111, 230)',
  };
  console.log(diagnosisData);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
        label: 'Systolic',
        data: systolicData,
        borderColor: chartColors.pink,
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: chartColors.pink,
        pointBorderColor: 'white',
        pointBorderWidth: 1,
        tension: 0.4
      },
      {
        label: 'Diastolic',
        data: diastolicData,
        borderColor: chartColors.purple,
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: chartColors.purple,
        pointBorderColor: 'white',
        pointBorderWidth: 1,
        tension: 0.4
      },
    ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          poinstStyle: 'circle',
          radius: 5,
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false,
          position: 'right',
          labels: {
            font: {
              size: 14,
              family: 'Manrope',
              weight: 'bold',
            },
            color: 'black',

          }
        },
        tooltip: {
          intersect: false,
        }
      }
    }
  });
  }
});
