import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaBook, FaChartLine, FaFileAlt, FaUsers, FaSearch, FaPlus } from "react-icons/fa";
import Header from "../components/Header";

const InstructorScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("course-management"); // "assignment-grading" or "course-management"

  const handleCreateCourse = () => {
    // Handle create course logic
    console.log("Create new course");
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const statsCards = [
    {
      title: "Tổng khóa học",
      value: "0",
      icon: <FaBook className="text-primary" />,
      bgColor: "rgba(13, 110, 253, 0.1)",
    },
    {
      title: "Đã xuất bản",
      value: "0",
      icon: <FaChartLine className="text-success" />,
      bgColor: "rgba(25, 135, 84, 0.1)",
    },
    {
      title: "Bản nháp",
      value: "0",
      icon: <FaFileAlt className="text-warning" />,
      bgColor: "rgba(255, 193, 7, 0.1)",
    },
    {
      title: "Học viên",
      value: "0",
      icon: <FaUsers className="text-info" />,
      bgColor: "rgba(13, 202, 240, 0.1)",
    },
  ];

  return (
    <div>
      <Header />

      {/* Main Content */}
      <Container
        fluid
        className="pt-5 mt-4"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        {/* Tab Navigation */}
        <div className="mb-4 d-flex justify-content-center">
          <div
            className="d-flex rounded-3 p-1 shadow-sm"
            style={{
              backgroundColor: "#D9D9D9",
              border: "1px solid #e9ecef",
              height: "60px",
              width: "90vw",
            }}
          >
            <div className="flex-fill">
              <div
                className={`text-center d-flex align-items-center justify-content-center h-100 rounded-3 transition-all ${
                  activeTab === "assignment-grading"
                    ? "bg-white text-dark shadow-sm"
                    : "text-dark bg-transparent"
                }`}
                onClick={() => handleTabSwitch("assignment-grading")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontWeight: activeTab === "assignment-grading" ? "600" : "500",
                }}
              >
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>Chấm điểm bài tập</span>
              </div>
            </div>
            <div className="flex-fill">
              <div
                className={`text-center d-flex align-items-center justify-content-center h-100 rounded-3 transition-all ${
                  activeTab === "course-management"
                    ? "bg-white text-dark shadow-sm"
                    : "text-dark bg-transparent"
                }`}
                onClick={() => handleTabSwitch("course-management")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontWeight: activeTab === "course-management" ? "600" : "500",
                }}
              >
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>Quản lý khóa học</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          {statsCards.map((card, index) => (
            <Col md={3} key={index} className="mb-3">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-muted mb-2">{card.title}</h6>
                      <h2 className="mb-0 fw-bold">{card.value}</h2>
                    </div>
                    <div
                      className="rounded p-3 d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: card.bgColor, minWidth: "56px", minHeight: "56px" }}
                    >
                      {React.cloneElement(card.icon, { size: 24 })}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Content Section */}
        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                {activeTab === "course-management" && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">📚 Quản lý Khóa học</h4>
                      <p className="text-muted">Quản lý tất cả các khóa học của bạn tại đây</p>
                    </div>
                    {/* Search and Create Button */}
                    <Row className="mb-4 align-items-center">
                      <Col md={8}>
                        <div className="position-relative">
                          <FaSearch
                            className="position-absolute text-muted"
                            style={{
                              left: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              zIndex: 2,
                            }}
                          />
                          <Form.Control
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ps-5"
                            style={{
                              backgroundColor: "#f8f9fa",
                              border: "1px solid #e9ecef",
                              borderRadius: "8px",
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button
                          variant="primary"
                          onClick={handleCreateCourse}
                          className="d-flex align-items-center ms-auto"
                          style={{ borderRadius: "8px" }}
                        >
                          <FaPlus className="me-2" />
                          Tạo khóa học mới
                        </Button>
                      </Col>
                    </Row>

                    {/* Empty State */}
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <FaBook size={80} className="text-muted" style={{ opacity: 0.3 }} />
                      </div>
                      <h5 className="text-muted mb-3">Chưa có khóa học nào</h5>
                      <p className="text-muted mb-4">
                        Bắt đầu bằng cách tạo khóa học đầu tiên của bạn
                      </p>
                      <Button
                        variant="dark"
                        onClick={handleCreateCourse}
                        className="d-flex align-items-center mx-auto"
                        style={{ borderRadius: "8px" }}
                      >
                        <FaPlus className="me-2" />
                        Tạo khóa học mới
                      </Button>
                    </div>
                  </>
                )}

                {activeTab === "assignment-grading" && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">📝 Chấm điểm Bài tập</h4>
                      <p className="text-muted">Chấm điểm và đánh giá bài tập của học viên</p>
                    </div>

                    {/* Assignment Grading Content */}
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <FaFileAlt size={80} className="text-muted" style={{ opacity: 0.3 }} />
                      </div>
                      <h5 className="text-muted mb-3">Chưa có bài tập nào cần chấm điểm</h5>
                      <p className="text-muted mb-4">
                        Bài tập của học viên sẽ xuất hiện tại đây sau khi họ nộp bài
                      </p>
                      <Button
                        variant="outline-primary"
                        disabled
                        className="d-flex align-items-center mx-auto"
                        style={{ borderRadius: "8px" }}
                      >
                        📋 Danh sách bài tập
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InstructorScreen;
