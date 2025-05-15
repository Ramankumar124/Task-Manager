import type { RootState } from "@/redux/Store";
import Spinner from "@/components/Spinner";

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  user: any;
  redirect?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  user,
  redirect = "/login",
}) => {
  const { loader } = useSelector((state: RootState) => state?.auth);
  if (loader) {
    return (
      <div className="w-screen h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirect} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
