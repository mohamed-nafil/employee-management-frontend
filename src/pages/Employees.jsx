import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Employees() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {

        try {

            const response = await api.get("/employees");

            setEmployees(response.data);
            setError("");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You do not have permission to view employees.");
            } else {
                setError("Unable to load employees.");
            }

        } finally {

            setLoading(false);

        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/employees/${id}`);

            alert("Employee deleted successfully!");

            fetchEmployees();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 403) {

                alert(
                    "You do not have permission to delete employees."
                );

            } else {

                alert("Unable to delete employee.");

            }

        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/");

    };

    // Search employees
    const filteredEmployees = employees.filter((employee) => {

        const searchText = search.toLowerCase();

        return (
            employee.name?.toLowerCase().includes(searchText) ||
            employee.email?.toLowerCase().includes(searchText) ||
            employee.department?.toLowerCase().includes(searchText) ||
            employee.designation?.toLowerCase().includes(searchText)
        );

    });

    return (

        <div style={styles.container}>

            {/* HEADER */}

            <header style={styles.header}>

                <h2 style={styles.logo}>
                    Employee Management
                </h2>

                <div style={styles.rightSection}>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.dashboardButton}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* MAIN */}

            <main style={styles.main}>

                {/* TITLE */}

                <div style={styles.titleRow}>

                    <div>

                        <h1 style={styles.title}>
                            Employees
                        </h1>

                        <p style={styles.subtitle}>
                            Manage employee information
                        </p>

                    </div>

                    {role === "ADMIN" && (
                    <button
                        style={styles.addButton}
                        onClick={() =>
                            navigate("/employees/add")
                        }
                    >
                        + Add Employee
                    </button>
                )}

                </div>

                {/* SEARCH */}

                <div style={styles.searchContainer}>

                    <input
                        type="text"
                        placeholder="Search by name, email, department or designation..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={styles.searchInput}
                    />

                </div>

                {/* LOADING */}

                {loading && (
                    <div style={styles.message}>
                        Loading employees...
                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {/* TABLE */}

                {!loading && !error && (

                    <div style={styles.tableContainer}>

                        <table style={styles.table}>

                            <thead>

                                <tr>

                                    <th style={styles.th}>
                                        ID
                                    </th>

                                    <th style={styles.th}>
                                        Name
                                    </th>

                                    <th style={styles.th}>
                                        Email
                                    </th>

                                    <th style={styles.th}>
                                        Phone
                                    </th>

                                    <th style={styles.th}>
                                        Department
                                    </th>

                                    <th style={styles.th}>
                                        Designation
                                    </th>

                                    <th style={styles.th}>
                                        Joining Date
                                    </th>

                                    <th style={styles.th}>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredEmployees.map(
                                    (employee) => (

                                        <tr
                                            key={employee.id}
                                            style={styles.row}
                                        >

                                            <td style={styles.td}>
                                                {employee.id}
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {employee.name}
                                            </td>

                                            <td style={styles.td}>
                                                {employee.email}
                                            </td>

                                            <td style={styles.td}>
                                                {employee.phone}
                                            </td>

                                            <td style={styles.td}>
                                                <span
                                                    style={
                                                        styles.departmentBadge
                                                    }
                                                >
                                                    {employee.department}
                                                </span>
                                            </td>

                                            <td style={styles.td}>
                                                {employee.designation}
                                            </td>

                                            <td style={styles.td}>
                                                {employee.joiningDate}
                                            </td>

                                            <td style={styles.td}>

                                    {role === "ADMIN" && (
                                    <button
                                        onClick={() =>
                                            navigate(`/employees/edit/${employee.id}`)
                                        }
                                        style={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                )}

                                            {/* DELETE ONLY FOR ADMIN */}

                                            {role === "ADMIN" && (

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                             employee.id
                                                        )
                                                     }
                                                     style={
                                                        styles.deleteButton
                                                      }
                                                 >
                                                    Delete
                                                  </button>

                                            )}

                                        </td>

                                    </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                        {/* NO RESULTS */}

                        {filteredEmployees.length === 0 && (

                            <div style={styles.empty}>

                                {search
                                    ? "No employees found matching your search."
                                    : "No employees found."
                                }

                            </div>

                        )}

                    </div>

                )}

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

    rightSection: {
        display: "flex",
        gap: "10px"
    },

    dashboardButton: {
        padding: "9px 16px",
        border: "none",
        borderRadius: "6px",
        background: "white",
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "600"
    },

    logoutButton: {
        padding: "9px 16px",
        border: "none",
        borderRadius: "6px",
        background: "#dc2626",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    main: {
        padding: "40px"
    },

    titleRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },

    title: {
        marginBottom: "5px"
    },

    subtitle: {
        color: "#666"
    },

    addButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    searchContainer: {
        marginBottom: "20px"
    },

    searchInput: {
        width: "100%",
        maxWidth: "500px",
        padding: "13px 15px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none"
    },

    tableContainer: {
        background: "white",
        borderRadius: "10px",
        overflowX: "auto",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        padding: "14px",
        textAlign: "left",
        borderBottom: "1px solid #ddd",
        background: "#f8fafc",
        whiteSpace: "nowrap"
    },

    td: {
        padding: "14px",
        borderBottom: "1px solid #eee",
        whiteSpace: "nowrap"
    },

    row: {
        transition: "background 0.2s"
    },

    departmentBadge: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#dbeafe",
        color: "#1d4ed8",
        fontSize: "12px",
        fontWeight: "600"
    },

    editButton: {
        padding: "7px 14px",
        border: "none",
        borderRadius: "5px",
        background: "#f59e0b",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    deleteButton: {
        marginLeft: "8px",
        padding: "7px 14px",
        border: "none",
        borderRadius: "5px",
        background: "#dc2626",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    message: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center",
        color: "#666"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px"
    },

    empty: {
        padding: "30px",
        textAlign: "center",
        color: "#666"
    }
};

export default Employees;