import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditEmployee() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        joiningDate: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {

        try {

            const response =
                await api.get(`/employees/${id}`);

            setFormData({
                name: response.data.name || "",
                email: response.data.email || "",
                phone: response.data.phone || "",
                department: response.data.department || "",
                designation: response.data.designation || "",
                joiningDate: response.data.joiningDate || ""
            });

            setError("");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 404) {
                setError("Employee not found.");
            } else if (error.response?.status === 403) {
                setError(
                    "You do not have permission to edit employees."
                );
            } else {
                setError("Unable to load employee details.");
            }

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!/^[0-9]{10}$/.test(formData.phone)) {

            setError(
                "Phone number must contain exactly 10 digits."
            );

            return;
        }

        setSaving(true);

        try {

            await api.put(
                `/employees/${id}`,
                formData
            );

            alert("Employee updated successfully!");

            navigate("/employees");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {

                const data = error.response.data;

                if (typeof data === "object") {

                    const firstError =
                        Object.values(data)[0];

                    setError(
                        firstError ||
                        data.error ||
                        "Please check the entered details."
                    );

                } else {

                    setError(
                        "Please check the entered details."
                    );

                }

            } else if (error.response?.status === 403) {

                setError(
                    "Only ADMIN can edit employees."
                );

            } else if (error.response?.status === 404) {

                setError("Employee not found.");

            } else {

                setError(
                    "Unable to update employee."
                );

            }

        } finally {

            setSaving(false);

        }
    };

    return (

        <div style={styles.container}>

            <header style={styles.header}>

                <h2 style={styles.logo}>
                    Employee Management
                </h2>

                <div style={styles.headerButtons}>

                    <button
                        onClick={() =>
                            navigate("/employees")
                        }
                        style={styles.backButton}
                    >
                        Employees
                    </button>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        style={styles.dashboardButton}
                    >
                        Dashboard
                    </button>

                </div>

            </header>

            <main style={styles.main}>

                <div style={styles.formCard}>

                    <h1>
                        Edit Employee
                    </h1>

                    <p style={styles.subtitle}>
                        Update employee information
                    </p>

                    {loading ? (

                        <p style={styles.loading}>
                            Loading employee details...
                        </p>

                    ) : (

                        <>

                            {error && (
                                <div style={styles.error}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div style={styles.grid}>

                                    <div>

                                        <label style={styles.label}>
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={styles.input}
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label style={styles.label}>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={styles.input}
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label style={styles.label}>
                                            Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength="10"
                                            style={styles.input}
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label style={styles.label}>
                                            Department
                                        </label>

                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            style={styles.input}
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label style={styles.label}>
                                            Designation
                                        </label>

                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            style={styles.input}
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label style={styles.label}>
                                            Joining Date
                                        </label>

                                        <input
                                            type="date"
                                            name="joiningDate"
                                            value={formData.joiningDate}
                                            onChange={handleChange}
                                            style={styles.input}
                                            required
                                        />

                                    </div>

                                </div>

                                <div style={styles.buttons}>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/employees")
                                        }
                                        style={styles.cancelButton}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        style={{
                                            ...styles.saveButton,
                                            opacity: saving ? 0.7 : 1
                                        }}
                                    >
                                        {saving
                                            ? "Updating..."
                                            : "Update Employee"}
                                    </button>

                                </div>

                            </form>

                        </>

                    )}

                </div>

            </main>

        </div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        background: "#f4f6f8"
    },

    header: {
        minHeight: "70px",
        background: "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px"
    },

    logo: {
        margin: 0
    },

    headerButtons: {
        display: "flex",
        gap: "10px"
    },

    backButton: {
        padding: "9px 16px",
        border: "none",
        borderRadius: "6px",
        background: "white",
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "600"
    },

    dashboardButton: {
        padding: "9px 16px",
        border: "none",
        borderRadius: "6px",
        background: "#1d4ed8",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    main: {
        padding: "40px",
        display: "flex",
        justifyContent: "center"
    },

    formCard: {
        width: "800px",
        maxWidth: "100%",
        background: "white",
        padding: "35px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    },

    subtitle: {
        color: "#666",
        marginBottom: "25px"
    },

    loading: {
        color: "#666"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, minmax(200px, 1fr))",
        gap: "20px"
    },

    label: {
        display: "block",
        marginBottom: "7px",
        fontWeight: "600"
    },

    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        boxSizing: "border-box",
        fontSize: "14px"
    },

    error: {
        padding: "12px",
        marginBottom: "20px",
        background: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "7px"
    },

    buttons: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "30px"
    },

    cancelButton: {
        padding: "11px 20px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        background: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    saveButton: {
        padding: "11px 20px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    }
};

export default EditEmployee;