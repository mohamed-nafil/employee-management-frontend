import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {

        try {

            const [employeeResponse, leaveResponse] =
                await Promise.all([
                    api.get("/employees"),
                    api.get("/leaves")
                ]);

            setEmployees(employeeResponse.data);
            setLeaves(leaveResponse.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else {
                setError("Unable to load dashboard data.");
            }

        } finally {

            setLoading(false);

        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/");

    };

    const pendingLeaves = leaves.filter(
        (leave) => leave.status === "Pending"
    ).length;

    const approvedLeaves = leaves.filter(
        (leave) => leave.status === "Approved"
    ).length;

    const rejectedLeaves = leaves.filter(
        (leave) => leave.status === "Rejected"
    ).length;

    // Show latest 5 leave requests
    const recentLeaves = [...leaves]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    const getStatusStyle = (status) => {

        if (status === "Approved") {
            return styles.approvedBadge;
        }

        if (status === "Rejected") {
            return styles.rejectedBadge;
        }

        return styles.pendingBadge;
    };

    return (

        <div style={styles.container}>

            {/* HEADER */}

            <header style={styles.header}>

                <h2 style={styles.logo}>
                    Employee Management
                </h2>

                <div style={styles.userSection}>

                    <div style={styles.userInfo}>

                        <strong>
                            {email}
                        </strong>

                        <span style={styles.role}>
                            {role}
                        </span>

                    </div>

                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main style={styles.main}>

                <h1>
                    Welcome back!
                </h1>

                <p style={styles.subtitle}>
                    Here's what's happening in your organization.
                </p>

                {loading ? (

                    <div style={styles.message}>
                        Loading dashboard...
                    </div>

                ) : error ? (

                    <div style={styles.error}>
                        {error}
                    </div>

                ) : (

                    <>

                        {/* STATISTICS */}

                        <div style={styles.statsContainer}>

                            <div style={styles.statCard}>

                                <h3>
                                    Total Employees
                                </h3>

                                <p style={styles.number}>
                                    {employees.length}
                                </p>

                            </div>

                            <div style={styles.statCard}>

                                <h3>
                                    Pending Leaves
                                </h3>

                                <p style={styles.number}>
                                    {pendingLeaves}
                                </p>

                            </div>

                            <div style={styles.statCard}>

                                <h3>
                                    Approved Leaves
                                </h3>

                                <p style={styles.number}>
                                    {approvedLeaves}
                                </p>

                            </div>

                            <div style={styles.statCard}>

                                <h3>
                                    Rejected Leaves
                                </h3>

                                <p style={styles.number}>
                                    {rejectedLeaves}
                                </p>

                            </div>

                        </div>

                        {/* QUICK ACTIONS */}

                        <div style={styles.section}>

                            <h2>
                                Quick Actions
                            </h2>

                            <div style={styles.actionContainer}>

                                <div style={styles.actionCard}>

                                    <h3>
                                        Employees
                                    </h3>

                                    <p>
                                        View and manage employees.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate("/employees")
                                        }
                                        style={styles.button}
                                    >
                                        View Employees
                                    </button>

                                </div>

                                <div style={styles.actionCard}>

                                    <h3>
                                        Leave Requests
                                    </h3>

                                    <p>
                                        View and manage leave requests.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate("/leaves")
                                        }
                                        style={styles.button}
                                    >
                                        View Leaves
                                    </button>

                                </div>

                                {role === "ADMIN" && (

                                    <div style={styles.actionCard}>

                                        <h3>
                                            Add Employee
                                        </h3>

                                        <p>
                                            Add a new employee to the system.
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate("/employees/add")
                                            }
                                            style={styles.button}
                                        >
                                            Add Employee
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                        {/* RECENT LEAVES */}

                        <div style={styles.section}>

                            <div style={styles.sectionHeader}>

                                <h2>
                                    Recent Leave Requests
                                </h2>

                                <button
                                    onClick={() =>
                                        navigate("/leaves")
                                    }
                                    style={styles.viewAllButton}
                                >
                                    View All
                                </button>

                            </div>

                            <div style={styles.tableContainer}>

                                <table style={styles.table}>

                                    <thead>

                                        <tr>

                                            <th style={styles.th}>
                                                Employee
                                            </th>

                                            <th style={styles.th}>
                                                Leave Type
                                            </th>

                                            <th style={styles.th}>
                                                Start Date
                                            </th>

                                            <th style={styles.th}>
                                                End Date
                                            </th>

                                            <th style={styles.th}>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {recentLeaves.map((leave) => (

                                            <tr key={leave.id}>

                                                <td style={styles.td}>
                                                    {leave.employeeName}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.leaveType}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.startDate}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.endDate}
                                                </td>

                                                <td style={styles.td}>

                                                    <span
                                                        style={getStatusStyle(
                                                            leave.status
                                                        )}
                                                    >
                                                        {leave.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                                {recentLeaves.length === 0 && (

                                    <div style={styles.empty}>
                                        No leave requests found.
                                    </div>

                                )}

                            </div>

                        </div>

                    </>

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

    userSection: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },

    userInfo: {
        textAlign: "right"
    },

    role: {
        display: "block",
        fontSize: "12px",
        opacity: 0.8,
        marginTop: "3px"
    },

    logoutButton: {
        padding: "9px 18px",
        border: "none",
        borderRadius: "6px",
        background: "white",
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "bold"
    },

    main: {
        padding: "40px"
    },

    subtitle: {
        color: "#666",
        marginBottom: "30px"
    },

    statsContainer: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(180px, 1fr))",
        gap: "20px",
        marginBottom: "35px"
    },

    statCard: {
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"
    },

    number: {
        fontSize: "36px",
        fontWeight: "bold",
        margin: "10px 0 0"
    },

    section: {
        marginBottom: "35px"
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px"
    },

    actionContainer: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(220px, 1fr))",
        gap: "20px"
    },

    actionCard: {
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"
    },

    button: {
        marginTop: "10px",
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    viewAllButton: {
        padding: "8px 15px",
        border: "none",
        borderRadius: "6px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer"
    },

    tableContainer: {
        background: "white",
        borderRadius: "10px",
        overflowX: "auto",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        padding: "14px",
        textAlign: "left",
        background: "#f8fafc",
        borderBottom: "1px solid #ddd"
    },

    td: {
        padding: "14px",
        borderBottom: "1px solid #eee"
    },

    pendingBadge: {
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#fef3c7",
        color: "#92400e",
        fontSize: "12px",
        fontWeight: "600"
    },

    approvedBadge: {
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#dcfce7",
        color: "#166534",
        fontSize: "12px",
        fontWeight: "600"
    },

    rejectedBadge: {
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#fee2e2",
        color: "#991b1b",
        fontSize: "12px",
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
        borderRadius: "8px"
    },

    empty: {
        padding: "30px",
        textAlign: "center",
        color: "#666"
    }
};

export default Dashboard;
