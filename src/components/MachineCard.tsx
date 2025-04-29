
import { Machine } from "@/data/mockData";
import { Link } from "react-router-dom";
import Button from "./Button";

interface MachineCardProps {
  machine: Machine;
  showRentButton?: boolean;
}

const MachineCard = ({ machine, showRentButton = false }: MachineCardProps) => {
  const { id, name, status, specs, hourlyRate } = machine;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === "available"
                ? "bg-green-100 text-cafe-available"
                : "bg-red-100 text-cafe-occupied"
            }`}
          >
            {status === "available" ? "Available" : "Occupied"}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{specs}</p>
        <div className="flex justify-between items-center">
          <p className="text-cafe-blue font-medium">${hourlyRate}/hour</p>
          {showRentButton && status === "available" ? (
            <Link to={`/rent/${id}`}>
              <Button size="sm">Rent Now</Button>
            </Link>
          ) : status !== "available" ? (
            <Button size="sm" variant="secondary" disabled>
              Unavailable
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
