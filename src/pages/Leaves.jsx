import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Leaves() {

    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [employeeId, setEmployeeId] = useState("");
    const [leaveType, setLeaveType] = useState("Casual");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        try {

            const [leaveResponse, employeeResponse] =
                await Promise.all([
                    api.get("/leaves"),
                    api.get("/employees")
                ]);

            setLeaves(leaveResponse.data);
            setEmployees(employeeResponse.data);
            setError("");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You do not have permission to view leaves.");
            } else {
                setError("Unable to load leave data.");
            }

        } finally {

            setLoading(false);

        }
    };

    const handleApplyLeave = async (e) => {

        e.preventDefault();

        try {

            await api.post("/leaves", {
                employeeId: Number(employeeId),
                leaveType: leaveType,
                startDate: startDate,
                endDate: endDate,
                reason: reason
            });

            alert("Leave applied successfully!");

            setEmployeeId("");
            setLeaveType("Casual");
            setStartDate("");
            setEndDate("");
            setReason("");

            fetchData();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {
                alert(
                    error.response.data?.error ||
                    "Please check the entered leave details."
                );
            } else {
                alert("Unable to apply leave.");
            }

        }
    };

    const handleApprove = async (id) => {

        const confirmed = window.confirm(
            "Approve this leave request?"
        );

        if (!confirmed) return;

        try {

            await api.put(`/leaves/${id}/approve`);

            alert("Leave approved successfully!");

            fetchData();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 403) {
                alert("Only ADMIN can approve leaves.");
            } else {
                alert("Unable to approve leave.");
            }

        }
    };

    const handleReject = async (id) => {

        const confirmed = window.confirm(
            "Reject this leave request?"
        );

        if (!confirmed) return;

        try {

            await api.put(`/leaves/${id}/reject`);

            alert("Leave rejected successfully!");

            fetchData();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 403) {
                alert("Only ADMIN can reject leaves.");
            } else {
                alert("Unable to reject leave.");
            }

        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/");

    };

    const getStatusStyle = (status) => {

        if (status === "Approved") {
            return styles.approvedBadge;
        }

        if (status === "Rejected") {
            return styles.rejectedBadge;
        }

        return styles.pendingBadge;
    };

    const filteredLeaves = leaves.filter((leave) => {

        const searchText = search.toLowerCase();

        return (
            leave.employeeName?.toLowerCase().includes(searchText) ||
            leave.leaveType?.toLowerCase().includes(searchText) ||
            leave.status?.toLowerCase().includes(searchText) ||
            leave.reason?.toLowerCase().includes(searchText)
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

            <main style={styles.main}>

                {/* TITLE */}

                <div style={styles.titleRow}>

                    <div>

                        <h1 style={styles.title}>
                            Leave Management
                        </h1>

                        <p style={styles.subtitle}>
                            Apply and manage employee leave requests
                        </p>

                    </div>

                </div>

                {/* APPLY LEAVE */}

                <div style={styles.formCard}>

                    <h2>
                        Apply Leave
                    </h2>

                    <form onSubmit={handleApplyLeave}>

                        <div style={styles.formGrid}>

                            <div>

                                <label style={styles.label}>
                                    Employee
                                </label>

                                <select
                                    value={employeeId}
                                    onChange={(e) =>
                                        setEmployeeId(e.target.value)
                                    }
                                    style={styles.input}
                                    required
                                >

                                    <option value="">
                                        Select Employee
                                    </option>

                                    {employees.map((employee) => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >
                                            {employee.name}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div>

                                <label style={styles.label}>
                                    Leave Type
                                </label>

                                <select
                                    value={leaveType}
                                    onChange={(e) =>
                                        setLeaveType(e.target.value)
                                    }
                                    style={styles.input}
                                >

                                    <option value="Casual">
                                        Casual
                                    </option>

                                    <option value="Medical">
                                        Medical
                                    </option>

                                    <option value="Sick">
                                        Sick
                                    </option>

                                    <option value="Emergency">
                                        Emergency
                                    </option>

                                </select>

                            </div>

                            <div>

                                <label style={styles.label}>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    style={styles.input}
                                    required
                                />

                            </div>

                            <div>

                                <label style={styles.label}>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(e.target.value)
                                    }
                                    style={styles.input}
                                    required
                                />

                            </div>

                            <div style={styles.reasonContainer}>

                                <label style={styles.label}>
                                    Reason
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter reason"
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(e.target.value)
                                    }
                                    style={styles.input}
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            style={styles.applyButton}
                        >
                            Apply Leave
                        </button>

                    </form>

                </div>

                {/* SEARCH */}

                <div style={styles.searchContainer}>

                    <input
                        type="text"
                        placeholder="Search by employee, leave type, status or reason..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={styles.searchInput}
                    />

                </div>

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
                                        Reason
                                    </th>

                                    <th style={styles.th}>
                                        Status
                                    </th>

                                    {role === "ADMIN" && (
                                        <th style={styles.th}>
                                            Actions
                                        </th>
                                    )}

                                </tr>

                            </thead>

                            <tbody>

                                {filteredLeaves.map((leave) => (

                                    <tr key={leave.id}>

                                        <td style={styles.td}>
                                            {leave.id}
                                        </td>

                                        <td
                                            style={{
                                                ...styles.td,
                                                fontWeight: "600"
                                            }}
                                        >
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
                                            {leave.reason}
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

                                        {role === "ADMIN" && (

                                            <td style={styles.td}>

                                                {leave.status === "Pending" && (

                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    leave.id
                                                                )
                                                            }
                                                            style={
                                                                styles.approveButton
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleReject(
                                                                    leave.id
                                                                )
                                                            }
                                                            style={
                                                                styles.rejectButton
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    </>

                                                )}

                                                {leave.status !== "Pending" && (
                                                    <span
                                                        style={
                                                            styles.noAction
                                                        }
                                                    >
                                                        Completed
                                                    </span>
                                                )}

                                            </td>

                                        )}

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        {filteredLeaves.length === 0 && (

                            <div style={styles.empty}>
                                {search
                                    ? "No leaves found matching your search."
                                    : "No leave requests found."
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
        marginBottom: "25px"
    },

    title: {
        marginBottom: "5px"
    },

    subtitle: {
        color: "#666"
    },

    formCard: {
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "25px"
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, minmax(200px, 1fr))",
        gap: "18px"
    },

    reasonContainer: {
        gridColumn: "1 / -1"
    },

    label: {
        display: "block",
        marginBottom: "7px",
        fontWeight: "600"
    },

    input: {
        width: "100%",
        padding: "11px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "14px",
        boxSizing: "border-box"
    },

    applyButton: {
        marginTop: "20px",
        padding: "11px 20px",
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
        maxWidth: "550px",
        padding: "13px 15px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box"
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

    pendingBadge: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#fef3c7",
        color: "#92400e",
        fontSize: "12px",
        fontWeight: "600"
    },

    approvedBadge: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#dcfce7",
        color: "#166534",
        fontSize: "12px",
        fontWeight: "600"
    },

    rejectedBadge: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#fee2e2",
        color: "#991b1b",
        fontSize: "12px",
        fontWeight: "600"
    },

    approveButton: {
        padding: "7px 12px",
        border: "none",
        borderRadius: "5px",
        background: "#16a34a",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    rejectButton: {
        marginLeft: "7px",
        padding: "7px 12px",
        border: "none",
        borderRadius: "5px",
        background: "#dc2626",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
    },

    noAction: {
        color: "#6b7280",
        fontSize: "13px"
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

export default Leaves;