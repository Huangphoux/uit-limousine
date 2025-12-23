import React, { useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import "./SubmitAssignment.css";

const SubmitAssignment = ({ lesson }) => {
  const [file, setFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, 'success', 'error'

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSubmissionStatus(null); // Reset status on new file selection
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to submit.");
      return;
    }
    // Here you would handle the file upload logic
    console.log("Submitting file:", file.name, "for lesson:", lesson.title);

    // Mock submission logic
    setTimeout(() => {
      setSubmissionStatus("success");
    }, 1000);
  };

  return (
    <Card className="submit-assignment-card">
      <Card.Body>
        <Card.Title>Submit Your Assignment</Card.Title>
        <Card.Text>
          Upload your work for the assignment: <strong>{lesson.title}</strong>.
        </Card.Text>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select your assignment file</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!file}>
            Submit Assignment
          </Button>
        </Form>
        {submissionStatus === "success" && <Alert variant="success" className="mt-3">Assignment submitted successfully!</Alert>}
      </Card.Body>
    </Card>
  );
};

export default SubmitAssignment;