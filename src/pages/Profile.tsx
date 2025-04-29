
import MainLayout from "@/layouts/MainLayout";
import { currentUser, rentalSessions } from "@/data/mockData";
import Button from "@/components/Button";
import { Link } from "react-router-dom";

const Profile = () => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${remainingMinutes}m`;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentUser.displayName}
              </h1>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Credit Balance:</span>
                <span className="text-lg font-medium text-cafe-blue">
                  ${currentUser.creditBalance.toFixed(2)}
                </span>
                <Button size="sm">Add Credit</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              Rental History
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {rentalSessions.length > 0 ? (
              rentalSessions.map((session) => (
                <div key={session.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-800">
                        {session.machineName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(session.startTime)}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                      <span className="text-sm font-medium text-gray-800">
                        {calculateDuration(session.duration)} - ${session.cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-600">No rental history yet</p>
                <Link to="/" className="text-cafe-blue hover:text-cafe-blue-dark mt-2 inline-block">
                  Browse available PCs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
