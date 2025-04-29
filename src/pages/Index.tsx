
import { machines } from "@/data/mockData";
import MainLayout from "@/layouts/MainLayout";
import MachineCard from "@/components/MachineCard";

const Index = () => {
  const availableMachines = machines.filter((m) => m.status === "available");
  const occupiedMachines = machines.filter((m) => m.status === "occupied");

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available PCs
          </h2>
          {availableMachines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableMachines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">
              No available PCs at the moment. Please check back later.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Currently Occupied
          </h2>
          {occupiedMachines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {occupiedMachines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">
              No machines are currently occupied.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
