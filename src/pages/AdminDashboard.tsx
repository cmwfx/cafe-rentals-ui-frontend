
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { machines } from "@/data/mockData";
import Button from "@/components/Button";
import UsersTable from "@/components/UsersTable";
import MachineEditMenu from "@/components/MachineEditMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [localMachines, setLocalMachines] = useState(machines);

  // Function to update machine name in local state
  const handleMachineNameChange = (machineId: string, newName: string) => {
    setLocalMachines(prevMachines => 
      prevMachines.map(machine => 
        machine.id === machineId 
          ? { ...machine, name: newName } 
          : machine
      )
    );
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {user?.user_metadata?.display_name || "Admin"}
            </p>
          </div>
          <Button variant="primary" size="md">
            Add New Machine
          </Button>
        </div>

        <Tabs defaultValue="machines" className="space-y-4">
          <TabsList>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="machines" className="space-y-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Machine ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {localMachines.map((machine) => (
                    <tr key={machine.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {machine.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {machine.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            machine.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {machine.status === "available" ? "Available" : "Occupied"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <MachineEditMenu 
                            machineId={machine.id}
                            machineName={machine.name}
                            onNameChange={(newName) => handleMachineNameChange(machine.id, newName)}
                          />
                          <Button variant="danger" size="sm">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UsersTable />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
