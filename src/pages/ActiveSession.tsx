
import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/Button";
import CountdownTimer from "@/components/CountdownTimer";
import PasswordDisplay from "@/components/PasswordDisplay";
import { activeSession } from "@/data/mockData";

const ActiveSession = () => {
  const [isLocking, setIsLocking] = useState(false);

  const handleLockEarly = () => {
    setIsLocking(true);
    // Simulate API call
    setTimeout(() => {
      setIsLocking(false);
      // Navigate logic would go here
    }, 1000);
  };

  const handleTimerComplete = () => {
    console.log("Session completed");
    // Navigate logic would go here
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Active Session</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">
                {activeSession.machineName}
              </h3>
              <p className="text-gray-600">
                Session started at:{" "}
                {new Date(activeSession.startTime).toLocaleTimeString()}
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-cafe-blue p-4 rounded">
              <p className="text-sm text-gray-700">
                Your PC is ready to use. Please use the temporary password below
                to log in. This password will expire once your session ends.
              </p>
            </div>

            <PasswordDisplay password={activeSession.tempPassword} />

            <CountdownTimer
              seconds={activeSession.timeRemaining}
              onComplete={handleTimerComplete}
            />

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="danger"
                onClick={handleLockEarly}
                disabled={isLocking}
              >
                {isLocking ? "Ending Session..." : "End Session Early"}
              </Button>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ActiveSession;
