
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/Button";
import { machines } from "@/data/mockData";

const RentMachine = () => {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [machine, setMachine] = useState<any>(null);
  const [duration, setDuration] = useState<number>(60); // Default 60 minutes
  const [cost, setCost] = useState<number>(0);

  useEffect(() => {
    // Find the machine by ID
    const selectedMachine = machines.find((m) => m.id === machineId);
    
    if (!selectedMachine) {
      navigate("/");
      return;
    }
    
    if (selectedMachine.status !== "available") {
      navigate("/");
      return;
    }
    
    setMachine(selectedMachine);
    // Calculate initial cost
    setCost((selectedMachine.hourlyRate / 60) * duration);
  }, [machineId, navigate]);

  useEffect(() => {
    if (machine) {
      // Recalculate cost when duration changes
      setCost(parseFloat(((machine.hourlyRate / 60) * duration).toFixed(2)));
    }
  }, [duration, machine]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(parseInt(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/session");
    }, 1000);
  };

  if (!machine) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-cafe-blue hover:text-cafe-blue-dark flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to all PCs
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Rent PC</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{machine.name}</h3>
              <p className="text-gray-600 mb-2">{machine.specs}</p>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-cafe-available">
                Available
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Rental Duration
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={duration}
                  onChange={handleDurationChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cafe-blue"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Rate per hour:</span>
                  <span className="font-medium">${machine.hourlyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{duration} minutes</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-lg font-bold text-cafe-blue">${cost}</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm Rental"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RentMachine;
