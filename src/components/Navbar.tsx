
import { Link } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, signOut, loading, isAdmin } = useAuth();

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
            {!loading && user ? (
              <div className="flex items-center space-x-4">
                {!isAdmin && (
                  <div className="hidden md:flex items-center">
                    <Link to="/dashboard">Dashboard</Link>
                  </div>
                )}
                {isAdmin && (
                  <div className="hidden md:flex items-center">
                    <Link to="/admin-dashboard">Admin Dashboard</Link>
                  </div>
                )}
                <div className="hidden md:flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Credit:</span>
                  <span className="text-sm font-medium text-cafe-blue">
                    ${user.user_metadata?.credit_balance?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      {user.user_metadata?.display_name || user.email}
                    </Button>
                  </Link>
                  <Button variant="primary" size="sm" onClick={signOut}>
                    Log out
                  </Button>
                </div>
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
