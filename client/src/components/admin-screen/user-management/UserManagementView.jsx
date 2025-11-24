import React, { useState } from "react";
import { Row, Col, Modal, Form, Button, Card, InputGroup, Badge, Dropdown } from "react-bootstrap";
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

const UserManagementView = () => {
  const [users, setUsers] = useState([
    {
      id: "user1",
      username: "Admin",
      email: "admin@gmail.com",
      role: "Admin",
      status: "Active",
      dateCreation: "16/11/2025",
      avatar: null,
    },
    {
      id: "user2",
      username: "Instructor",
      email: "instructor@gmail.com",
      role: "Instructor",
      status: "Active",
      dateCreation: "16/11/2025",
      avatar: null,
    },
    {
      id: "user3",
      username: "User",
      email: "user@gmail.com",
      role: "User",
      status: "Inactive",
      dateCreation: "16/11/2025",
      avatar: null,
    },
  ]);

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
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    avatar: null,
  });
  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    role: "",
    avatar: null,
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return { bg: "#9C27B0", text: "#fff" };
      case "Instructor":
        return { bg: "#2196F3", text: "#fff" };
      case "User":
        return { bg: "#FF9800", text: "#fff" };
      default:
        return { bg: "#9E9E9E", text: "#fff" };
    }
  };

  const getStatusColor = (status) => (status === "Active" ? "#4CAF50" : "#F44336");
  const getAvatarColor = (role) => {
    switch (role) {
      case "Admin":
        return "#F44336";
      case "Instructor":
        return "#FF9800";
      case "User":
        return "#9C27B0";
      default:
        return "#9E9E9E";
    }
  };

  const stats = [
    {
      label: "All Users",
      count: users.length,
      icon: <FaUsers className="text-white" />,
      bg: "rgba(13, 110, 253, 0.6)",
    },
    {
      label: "Learner",
      count: users.filter((u) => u.role === "User").length,
      icon: <FaUsers className="text-white" />,
      bg: "rgba(232, 47, 161, 0.7)",
    },
    {
      label: "Instructor",
      count: users.filter((u) => u.role === "Instructor").length,
      icon: <FaUserGraduate className="text-white" />,
      bg: "#28a745",
    },
    {
      label: "Admin",
      count: users.filter((u) => u.role === "Admin").length,
      icon: <FaUserShield className="text-white" />,
      bg: "orange",
    },
    {
      label: "Active",
      count: users.filter((u) => u.status === "Active").length,
      icon: <FaCheckCircle className="text-white" />,
      bg: "#17a2b8",
    },
    {
      label: "Inactive",
      count: users.filter((u) => u.status === "Inactive").length,
      icon: <FaTimesCircle className="text-white" />,
      bg: "#dc3545",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "All" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreate = () => {
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) return;
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const user = {
      id: `user${Date.now()}`,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      dateCreation: new Date().toLocaleDateString("en-GB"),
      avatar: newUser.avatar,
    };
    setUsers([...users, user]);
    setNewUser({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      avatar: null,
    });
    setShowCreateModal(false);
  };

  const handleEdit = () => {
    if (!editUser.username || !editUser.email || !editUser.role) return;
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...editUser } : u)));
    setShowEditModal(false);
  };

  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditUser({
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
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
                <Dropdown.Item eventKey="Admin" style={{ color: "black", opacity: 1 }}>Admin</Dropdown.Item>
                <Dropdown.Item eventKey="Instructor" style={{ color: "black", opacity: 1 }}>Instructor</Dropdown.Item>
                <Dropdown.Item eventKey="User" style={{ color: "black", opacity: 1 }}>User</Dropdown.Item>
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
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Date creation</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
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
                        style={{ background: getAvatarColor(user.role) }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: "600" }}>{user.username}</div>
                      <div style={{ fontSize: "12px", color: "#999" }}>ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ color: "#666" }}>✉️</span> {user.email}
                </td>
                <td>
                  <Badge
                    pill
                    style={{
                      background: getRoleColor(user.role).bg,
                      color: getRoleColor(user.role).text,
                    }}
                  >
                    🎓 {user.role}
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
                <td>{user.dateCreation}</td>
                <td>
                  <button className="action-btn" onClick={() => openEditModal(user)}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                Account's name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <input
                className="modal-input"
                placeholder="User1"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
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

              <Form.Label className="fw-semibold">
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
              </div>

              <Form.Label className="fw-semibold">Role</Form.Label>
              <select
                className="modal-input"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="">Choose role</option>
                <option value="Admin">Admin</option>
                <option value="Instructor">Instructor</option>
                <option value="User">User</option>
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
          <Button variant="dark" className="create-btn" onClick={handleCreate}>
            Create account
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
              <Form.Label className="fw-semibold">Account's name</Form.Label>
              <input
                className="modal-input"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              />

              <Form.Label className="fw-semibold">Email</Form.Label>
              <input
                className="modal-input"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />

              <Form.Label className="fw-semibold">Role</Form.Label>
              <select
                className="modal-input"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="Admin">Admin</option>
                <option value="Instructor">Instructor</option>
                <option value="User">User</option>
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
          <Button variant="dark" className="create-btn" onClick={handleEdit}>
            Save Changes
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
            Are you sure you want to delete "{selectedUser?.username}"?
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagementView;
