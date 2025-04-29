
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const Signup = () => {
  const { user, signUp, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  // If user is already logged in, redirect to appropriate dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.displayName
      );
      
      if (error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.success("Account created successfully! Please check your email to verify your account.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Display Name"
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-cafe-blue focus:ring-cafe-blue"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a
                href="#"
                className="font-medium text-cafe-blue hover:text-cafe-blue-dark"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-cafe-blue hover:text-cafe-blue-dark"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-cafe-blue hover:text-cafe-blue-dark"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;
