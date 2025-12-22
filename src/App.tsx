import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useAppDispatch } from "./services/hooks.ts";
import Main from "./compoments/main/Main.tsx";
import AppHeader from "./compoments/header/AppHeader.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProfileInfo from "./pages/ProfileInfo";
import ProfileOrders from "./pages/ProfileOrders";
import IngredientContent from "./compoments/ui/modal/modalContents/IngredientContent.tsx";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./compoments/protected-route/ProtectedRoute.tsx";
import { checkUserAuth } from "./services/userActions";
import IngredientModal from "./compoments/ui/modal/IngredientModal.tsx";
import FeedPage from "./pages/Feed";
import OrderInfoPage from "./pages/OrderInfoPage";
import OrderModal from "./compoments/ui/modal/OrderModal";
import { fetchIngredients } from "./services/ingredientsSlice";

const AppRoutes = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const backgroundLocation = (location.state as { backgroundLocation?: Location })?.backgroundLocation;

    useEffect(() => {
        dispatch(checkUserAuth());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    return (
        <>
            <AppHeader />
            <Routes location={backgroundLocation ?? location}>
                <Route path="/" element={<Main />} />
                <Route
                    path="/login"
                    element={<ProtectedRoute onlyUnAuth element={<Login />} />}
                />
                <Route
                    path="/register"
                    element={<ProtectedRoute onlyUnAuth element={<Register />} />}
                />
                <Route
                    path="/forgot-password"
                    element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
                />
                <Route
                    path="/reset-password"
                    element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
                />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />}>
                    <Route index element={<ProfileInfo />} />
                    <Route path="orders" element={<ProfileOrders />} />
                    <Route path="orders/:id" element={<OrderInfoPage />} />
                </Route>
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/feed/:id" element={<OrderInfoPage />} />
                <Route path="/ingredients/:id" element={<IngredientContent />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            {backgroundLocation && (
                <Routes>
                    <Route path="/ingredients/:id" element={<IngredientModal />} />
                    <Route path="/feed/:id" element={<OrderModal />} />
                    <Route path="/profile/orders/:id" element={<ProtectedRoute element={<OrderModal />} />} />
                </Routes>
            )}
        </>
    );
};

function App() {
    return (
        <React.Fragment>
            <DndProvider backend={HTML5Backend}>
                <Router basename={import.meta.env.BASE_URL}>
                    <AppRoutes />
                </Router>
            </DndProvider>
        </React.Fragment>
    );
}

export default App;
