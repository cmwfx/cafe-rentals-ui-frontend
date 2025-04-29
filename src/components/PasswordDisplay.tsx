
import { useState } from "react";
import Button from "./Button";

interface PasswordDisplayProps {
  password: string;
}

const PasswordDisplay = ({ password }: PasswordDisplayProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Temporary Password</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Hide" : "Show"}
        </Button>
      </div>
      <div className="bg-gray-100 p-3 rounded flex justify-center items-center">
        {visible ? (
          <p className="text-xl font-mono font-bold tracking-wider">{password}</p>
        ) : (
          <p className="text-xl font-mono font-bold tracking-wider">••••••••</p>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Use this password to login to your rented PC
      </p>
    </div>
  );
};

export default PasswordDisplay;
