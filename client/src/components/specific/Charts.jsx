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

// eslint-disable-next-line react/prop-types
const LineChart = ({value = []}) => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Revenue2",
        data: value,
        fill: true,
        backgroundColor:colors.purpleLight,
        borderColor: colors.purple,
      },
    ],
  };
  return <Line data={data} options={LineChartOptions} />;
};

const DoughnutChart = () => {
  return <div>DoughnutChart</div>;
};
export { LineChart, DoughnutChart };
