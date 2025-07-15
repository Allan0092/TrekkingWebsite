import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Mail,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/auth/verify-email/${token}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          const errorData = await response.json();

          if (
            response.status === 400 &&
            (errorData.error?.includes("not found") ||
              errorData.error?.includes("Invalid verification token"))
          ) {
            setStatus("already_verified");
            setMessage(
              "This verification link has already been used or has expired. Your email may already be verified."
            );
          } else {
            setStatus("error");
            setMessage(errorData.error || "Email verification failed.");
          }
        }
      } catch (error) {
        setStatus("error");
        setMessage("Network error. Please try again later.");
        console.error("Email verification error:", error);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Verifying State */}
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <Mail className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-6">
              You will be redirected to the login page in 3 seconds...
            </p>
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

        {/* Already Verified State */}
        {status === "already_verified" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Link Already Used
            </h1>
            <p className="text-yellow-700 mb-6">{message}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Good news!</strong> Your email is likely already
                verified. Try logging in with your credentials.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                Try Login
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/signup"
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Create New Account
              </Link>
              <Link
                to="/"
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h1>
            <p className="text-red-600 mb-6">{message}</p>
            <div className="space-y-4">
              <Link
                to="/signup"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create New Account
              </Link>
              <Link
                to="/login"
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Try Login Instead
              </Link>
              <Link
                to="/"
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
