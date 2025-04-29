
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import MachineCard from "@/components/MachineCard";
import { machines } from "@/data/mockData";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.user_metadata?.display_name || "User"}
          </h1>
          <p className="text-gray-600">Select a machine to rent</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              showRentButton={true}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
