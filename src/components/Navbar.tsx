
import { isLoggedIn, currentUser } from "@/data/mockData";
import { Link } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-cafe-blue">CaféConnect</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Credit:</span>
                  <span className="text-sm font-medium text-cafe-blue">
                    ${currentUser.creditBalance.toFixed(2)}
                  </span>
                </div>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    {currentUser.displayName}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
