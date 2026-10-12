import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import Leaves from "./pages/Leaves";

import ProtectedRoute from "./ProtectedRoute";
function App() {

    return (
        <BrowserRouter>

            <Routes>
                {/* Public Route */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Protected Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <Employees />
                        </ProtectedRoute>
                    }
                />

               <Route
                    path="/employees/add"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AddEmployee />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees/edit/:id"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <EditEmployee />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leaves"
                    element={
                        <ProtectedRoute>
                            <Leaves />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;