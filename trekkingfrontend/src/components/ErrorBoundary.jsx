import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-4 bg-[#F6FFFF] text-black font-inter">
          <h1 className="text-[64px] font-bold mb-4">Something Went Wrong</h1>
          <p className="text-[24px] font-medium text-red-500">
            An error occurred: {this.state.error?.message || "Unknown error"}
          </p>
          <p className="text-[24px] font-medium">
            Please try refreshing the page or contact support.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
