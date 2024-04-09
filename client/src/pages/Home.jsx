import AppLayout from "../components/Layout/AppLayout";

function Home() {
  return <div>Home</div>;
}

export default AppLayout()(Home); // Apply the AppLayout HOC to Home component
