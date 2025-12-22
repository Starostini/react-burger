//@ts-expect-error React issue
import React from "react";
import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useAppSelector } from "../../services/hooks.ts";
import { currentUser, isAuthChecked } from "../../services/selectors";

interface ProtectedRouteElementProps {
    onlyUnAuth?: boolean;
    element: ReactElement;
}

const ProtectedRoute = ({ onlyUnAuth = false, element }: ProtectedRouteElementProps) => {
    const user = useAppSelector(currentUser);
    const authChecked = useAppSelector(isAuthChecked);
    const location = useLocation();

    if (!authChecked) {
        return null;
    }

    if (onlyUnAuth && user) {
        const fromState = (location.state as { from?: Location | string } | undefined)?.from;
        const redirectTo = typeof fromState === "string" ? fromState : fromState?.pathname ?? "/";
        return <Navigate to={redirectTo} replace />;
    }

    if (!onlyUnAuth && !user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return element;
};

export default ProtectedRoute;
