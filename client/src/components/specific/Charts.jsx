import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJs,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from "chart.js";
import colors from "../../constant/color";
import { getLast7Days } from "../../lib/features";

ChartJs.register(
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const LineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const labels = getLast7Days();

// eslint-disable-next-line react/prop-types
const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Messages",
        data: value,
        fill: true,
        backgroundColor: colors.purpleLight,
        borderColor: colors.purple,
      },
    ],
  };
  return <Line data={data} options={LineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  cutout: 90,
};

// eslint-disable-next-line react/prop-types
const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [
          "rgba(153, 102, 255, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: ["rgba(153, 102, 255, 0.3)", "rgba(54, 162, 235, 0.3)"],
        hoverBorderColor: ["rgb(153, 102, 255)", "rgb(54, 162, 235)"],
        offset: 20,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};
export { LineChart, DoughnutChart };
