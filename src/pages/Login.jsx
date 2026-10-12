import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email: email,
                password: password
            });

            // Save authentication details
            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "email",
                response.data.email
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                setError(
                    "Invalid email or password."
                );

            } else if (
                error.response?.status === 400
            ) {

                setError(
                    "Please enter a valid email and password."
                );

            } else {

                setError(
                    "Unable to connect to server."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div style={styles.page}>

            <div style={styles.card}>

                <div style={styles.header}>

                    <h1 style={styles.title}>
                        Employee Management
                    </h1>

                    <p style={styles.subtitle}>
                        Sign in to continue
                    </p>

                </div>


                <form onSubmit={handleLogin}>

                    {/* EMAIL */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                            style={styles.input}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Password
                        </label>

                        <div style={styles.passwordWrapper}>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                                style={styles.passwordInput}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                style={styles.showButton}
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div style={styles.error}>
                            {error}
                        </div>

                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.loginButton,
                            opacity: loading ? 0.7 : 1
                        }}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"}

                    </button>

                </form>

            </div>

        </div>
    );
}


// ==============================
// STYLES
// ==============================

const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
        padding: "20px"
    },

    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        padding: "35px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
    },

    header: {
        textAlign: "center",
        marginBottom: "30px"
    },

    title: {
        marginBottom: "8px",
        fontSize: "25px",
        color: "#1f2937"
    },

    subtitle: {
        color: "#6b7280",
        fontSize: "14px"
    },

    field: {
        marginBottom: "20px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#374151"
    },

    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "14px",
        outline: "none"
    },

    passwordWrapper: {
        display: "flex",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        overflow: "hidden"
    },

    passwordInput: {
        flex: 1,
        padding: "12px",
        border: "none",
        outline: "none",
        fontSize: "14px"
    },

    showButton: {
        border: "none",
        background: "#f3f4f6",
        padding: "0 12px",
        cursor: "pointer",
        color: "#2563eb",
        fontWeight: "600"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "15px",
        fontSize: "14px"
    },

    loginButton: {
        width: "100%",
        padding: "13px",
        background: "#2563eb",
        color: "#ffffff",
        border: "none",
        borderRadius: "7px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer"
    }
};

export default Login;