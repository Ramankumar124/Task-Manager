// This component displays a loading spinner
import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
