import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Button,
  Card,
  Badge,
  Dropdown,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserGraduate,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
} from "react-icons/fa";
import { toast } from "sonner";

const UserManagementView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [userStats, setUserStats] = useState({
    total: 0,
    byRole: {
      LEARNER: 0,
      INSTRUCTOR: 0,
      ADMIN: 0,
    },
    byStatus: {
      ACTIVE: 0,
      INACTIVE: 0,
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    avatar: null,
    status: "ACTIVE",
  });
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "",
    avatar: null,
    status: "",
  });

  // API Base URL - thay đổi theo backend của bạn
  const API_BASE_URL = "http://localhost:3000/admin";

  // Fetch users from API
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Thêm token nếu cần
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();

      if (result.status === "success") {
        setUsers(result.data.users);
        setPagination({
          total: result.data.total,
          page: result.data.page,
          totalPages: result.data.totalPages,
        });
        // Set stats from API if available
        if (result.data.stats) {
          setUserStats(result.data.stats);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helpers
  const getRoleName = (roles) => {
    if (!roles || roles.length === 0) return "No Role";
    // Lấy role đầu tiên và chuyển thành format đẹp hơn
    const role = roles[0];
    if (role === "LEARNER") return "LEARNER";
    if (role === "INSTRUCTOR") return "INSTRUCTOR";
    if (role === "ADMIN") return "ADMIN";
    return role;
  };

  const getRoleColor = (roles) => {
    const role = getRoleName(roles);
    switch (role) {
      case "Admin":
        return { bg: "#9C27B0", text: "#fff" };
      case "Instructor":
        return { bg: "#2196F3", text: "#fff" };
      case "Learner":
        return { bg: "#FF9800", text: "#fff" };
      default:
        return { bg: "#9E9E9E", text: "#fff" };
    }
  };

  const getStatusColor = (status) => (status === "ACTIVE" ? "#4CAF50" : "#F44336");

  const getAvatarColor = (roles) => {
    const role = getRoleName(roles);
    switch (role) {
      case "Admin":
        return "#F44336";
      case "Instructor":
        return "#FF9800";
      case "LEARNER":
        return "#9C27B0";
      default:
        return "#9E9E9E";
    }
  };

  const stats = [
    {
      label: "All Users",
      count: pagination.total,
      icon: <FaUsers className="text-white" />,
      bg: "rgba(13, 110, 253, 0.6)",
    },
    {
      label: "Learner",
      count: userStats.byRole?.LEARNER || 0,
      icon: <FaUsers className="text-white" />,
      bg: "rgba(232, 47, 161, 0.7)",
    },
    {
      label: "Instructor",
      count: userStats.byRole?.INSTRUCTOR || 0,
      icon: <FaUserGraduate className="text-white" />,
      bg: "#28a745",
    },
    {
      label: "Admin",
      count: userStats.byRole?.ADMIN || 0,
      icon: <FaUserShield className="text-white" />,
      bg: "orange",
    },
    {
      label: "Active",
      count: userStats.byStatus?.ACTIVE || 0,
      icon: <FaCheckCircle className="text-white" />,
      bg: "#17a2b8",
    },
    {
      label: "Inactive",
      count: userStats.byStatus?.INACTIVE || 0,
      icon: <FaTimesCircle className="text-white" />,
      bg: "#dc3545",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchRole = true;
    if (roleFilter !== "All") {
      if (roleFilter === "LEARNER") {
        matchRole = user.roles?.includes("LEARNER");
      } else {
        matchRole = user.roles?.includes(roleFilter.toUpperCase());
      }
    }

    return matchSearch && matchRole;
  });

  // API Handlers
  const handleCreate = async () => {
    // 1. Kiểm tra đầu vào
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);

      // 2. Chuẩn hóa Role thành chuỗi viết hoa (e.g., "ADMIN", "INSTRUCTOR", "LEARNER")
      const roleString = newUser.role.toUpperCase();

      const payload = {
        name: newUser.name,
        email: newUser.email,
        role: roleString, // CHẮC CHẮN LÀ CHUỖI, KHÔNG CÓ [ ]
      };

      console.log("Payload gửi đi:", payload); // Kiểm tra log ở trình duyệt

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.data || "Failed to create user");
      }

      await fetchUsers(pagination.page);
      setShowCreateModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "",
        avatar: null,
      });
      toast.success("User created successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editUser.name || !editUser.role) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);

      let roleApi = editUser.role.toUpperCase();
      if (editUser.role === "LEARNER") roleApi = "LEARNER";

      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: editUser.name,
          role: editUser.role.toUpperCase(), // Gửi chuỗi
          avatar: editUser.avatar,
          status: editUser.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      await fetchUsers(pagination.page);
      setShowEditModal(false);
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers(pagination.page);
      setShowDeleteModal(false);
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name || "",
      email: user.email || "",
      role: getRoleName(user.roles),
      avatar: user.avatar || null,
      status: user.status || "INACTIVE",
    });
    setShowEditModal(true);
  };

  const handleAvatarChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) setEditUser({ ...editUser, avatar: reader.result });
        else setNewUser({ ...newUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <style>{`        
        .user-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .user-table th { background: #f5f5f5; padding: 12px 16px; text-align: left; font-weight: 600; border-bottom: 2px solid #e0e0e0; }
        .user-table td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
        .user-table tr:hover { background: #fafafa; }
        .role-badge { padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; } 
        .status-badge { display: flex; align-items: center; gap: 6px; font-size: 13px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .action-btn { border: 1px solid #e0e0e0; background: #e9ecef; color: black; padding: 6px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-right: 8px; }
        .action-btn:hover { background: #f5f5f5; }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .delete-btn { color: black; border-color: #e0e0e0; }
        .avatar-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 14px; }
        .modal-input { border: 1px solid #ced4da; border-radius: 8px; padding: 10px 14px; width: 100%; margin-bottom: 16px; background-color: #fff; color: #000; }
        .modal-input:focus { outline: none; border-color: #2196F3; }
        .password-wrapper { position: relative; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #666; padding-bottom: 20px; }
        .password-toggle { font-size: 1.2rem; }
        .avatar-upload { border: 2px dashed #e0e0e0; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; }
        .avatar-upload:hover { border-color: #2196F3; }
        .create-btn { background: #333; color: #fff; border: none; border-radius: 8px; padding: 10px 24px; cursor: pointer; }
        .gray-modal-content {
          background-color: #e9ecef;
          color: black;
        }
        .gray-modal-content .btn-close {
          filter: none;
        }
        .search-input::placeholder {
          color: black;
        }
        .custom-dropdown-toggle::after {
          display: none !important;
        }
      `}</style>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4 g-3 stats-section">
        {stats.map((stat, i) => (
          <Col key={i} xs={12} sm={6} md={4} lg={2}>
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                backgroundColor: "#bfeff9",
                borderRadius: "12px",
              }}
            >
              <Card.Body className="p-3 d-flex align-items-center justify-content-between">
                <div>
                  <div className="small text-black">{stat.label}</div>
                  <div className="fs-2 fw-bold text-black mb-0">{stat.count}</div>
                </div>
                <div
                  className="rounded d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: stat.bg,
                    minWidth: "56px",
                    minHeight: "56px",
                    fontSize: "1.5rem",
                  }}
                >
                  {stat.icon}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search & Filter */}
      <Row className="mb-4 align-items-center search-section">
        <Col md={8}>
          <div className="d-flex gap-3">
            <div className="d-flex flex-grow-1">
              <Form.Control
                type="text"
                placeholder="Find users, instructors, ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-custom"
                style={{
                  color: "#000",
                  backgroundColor: "#ADD8E6",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px 0 0 8px",
                  height: "50px",
                  fontSize: "16px",
                  paddingLeft: "16px",
                }}
              />
              <Button
                variant="primary"
                style={{
                  borderRadius: "0 8px 8px 0",
                  height: "50px",
                  minWidth: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaSearch />
              </Button>
            </div>
            <Dropdown onSelect={(e) => setRoleFilter(e)}>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-roles"
                style={{
                  height: "50px",
                  minWidth: "150px",
                  color: "#343a40",
                  fontWeight: "500",
                  backgroundColor: "#e9ecef",
                  border: "1px solid #dee2e6",
                }}
                className="d-flex align-items-center justify-content-between custom-dropdown-toggle"
              >
                {roleFilter === "All" ? "All Roles" : roleFilter}
                <FaChevronDown style={{ color: "#343a40", marginLeft: "8px" }} />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ opacity: 1 }}>
                <Dropdown.Item eventKey="All" style={{ color: "black", opacity: 1 }}>
                  All Roles
                </Dropdown.Item>
                <Dropdown.Item eventKey="Admin" style={{ color: "black", opacity: 1 }}>
                  Admin
                </Dropdown.Item>
                <Dropdown.Item eventKey="Instructor" style={{ color: "black", opacity: 1 }}>
                  Instructor
                </Dropdown.Item>
                <Dropdown.Item eventKey="LEARNER" style={{ color: "black", opacity: 1 }}>
                  LEARNER
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="d-flex align-items-center ms-auto"
            style={{
              borderRadius: "8px",
              height: "50px",
              fontSize: "16px",
              padding: "12px 20px",
            }}
          >
            <FaUserPlus className="me-2" /> Add Account
          </Button>
        </Col>
      </Row>

      {/* Users Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <table className="user-table">
          <thead>
            <tr>
              <th>FullName</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="avatar-circle"
                          style={{ background: getAvatarColor(user.roles) }}
                        >
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: "600" }}>
                          {user.name || (
                            <span style={{ color: "#999", fontStyle: "italic" }}>No name</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {" "}
                    <div style={{ fontWeight: "600" }}>
                      {user.email || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>No email</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {" "}
                    <Badge
                      pill
                      style={{
                        background: getRoleColor(user.roles).bg,
                        color: getRoleColor(user.roles).text,
                      }}
                    >
                      🎓 {getRoleName(user.roles)}
                    </Badge>
                  </td>
                  <td>
                    <div className="status-badge">
                      <span
                        className="status-dot"
                        style={{ background: getStatusColor(user.status) }}
                      ></span>
                      {user.status}
                    </div>
                  </td>

                  <td>
                    <button
                      className="action-btn"
                      onClick={() => openEditModal(user)}
                      disabled={loading}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="outline-primary"
            disabled={pagination.page === 1 || loading}
            onClick={() => fetchUsers(pagination.page - 1)}
            className="me-2"
          >
            Previous
          </Button>
          <span className="align-self-center mx-3">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline-primary"
            disabled={pagination.page === pagination.totalPages || loading}
            onClick={() => fetchUsers(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
        contentClassName="gray-modal-content"
      >
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title className="fw-bold fs-4">Create new account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ marginBottom: "24px" }}>Fill in the basic information about this account.</p>
          <Row>
            <Col md={7}>
              <Form.Label className="fw-semibold">
                FullName <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <input
                className="modal-input"
                placeholder="User1"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />

              <Form.Label className="fw-semibold">
                Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <input
                className="modal-input"
                type="email"
                placeholder="example@gmail.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />

              {/* <Form.Label className="fw-semibold">
                Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <div className="password-wrapper">
                <input
                  className="modal-input"
                  type={showPassword.password ? "text" : "password"}
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <span
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword({ ...showPassword, password: !showPassword.password })
                  }
                >
                  {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <Form.Label className="fw-semibold">
                Confirm password <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <div className="password-wrapper">
                <input
                  className="modal-input"
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                />
                <span
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                  }
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div> */}

              <Form.Label className="fw-semibold">
                Role <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <select
                className="modal-input"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="">Choose role</option>
                <option value="ADMIN">Admin</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="LEARNER">Learner</option>
              </select>
            </Col>
            <Col md={5}>
              <Form.Label className="fw-semibold">Account's avatar</Form.Label>
              <div
                className="avatar-upload"
                onClick={() => document.getElementById("create-avatar").click()}
              >
                {newUser.avatar ? (
                  <img
                    src={newUser.avatar}
                    alt=""
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ color: "#999" }}>Browse your computer</div>
                )}
                <input
                  type="file"
                  id="create-avatar"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleAvatarChange(e)}
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <Button variant="dark" className="create-btn" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
        contentClassName="gray-modal-content"
      >
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title className="fw-bold fs-4">Change account info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ marginBottom: "24px" }}>Update account information</p>
          <Row>
            <Col md={7}>
              <Form.Label className="fw-semibold">FullName</Form.Label>
              <input
                className="modal-input"
                value={editUser.name ? editUser.name : "Anonymous"}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
              <Form.Label className="fw-semibold">Email</Form.Label>
              <input
                className="modal-input"
                type="email"
                value={editUser.email}
                disabled // Thêm disabled nếu không cho sửa email
                style={{
                  backgroundColor: "#f5f5f5", // Màu xám nhạt để biết là disabled
                  cursor: "not-allowed",
                }}
              />

              <Form.Label className="fw-semibold">Role</Form.Label>
              <select
                className="modal-input"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="ADMIN">Admin</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="LEARNER">Learner</option>
              </select>
              <Form.Label className="fw-semibold">Status</Form.Label>
              <select
                className="modal-input"
                value={editUser.status}
                onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Col>
            <Col md={5}>
              <Form.Label className="fw-semibold">Account's avatar</Form.Label>
              <div
                className="avatar-upload"
                onClick={() => document.getElementById("edit-avatar").click()}
              >
                {editUser.avatar ? (
                  <img
                    src={editUser.avatar}
                    alt=""
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ color: "#999" }}>Browse your computer</div>
                )}
                <input
                  type="file"
                  id="edit-avatar"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleAvatarChange(e, true)}
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <Button variant="dark" className="create-btn" onClick={handleEdit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        size="sm"
        contentClassName="gray-modal-content"
      >
        <Modal.Body className="text-center p-4">
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h5 style={{ fontWeight: "700", marginBottom: "12px" }}>Delete User?</h5>
          <p style={{ marginBottom: "24px" }}>
            Are you sure you want to delete "{selectedUser?.name || "this user"}"?
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagementView;
