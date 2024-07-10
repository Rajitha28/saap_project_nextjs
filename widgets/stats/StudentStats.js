import React from 'react';
import { Card } from 'react-bootstrap';
import { FileText, People } from 'react-bootstrap-icons'; // Using icons for question papers and students

// Hardcoded values
const numberOfQuestionPapers = 15; // Example number of question papers
const numberOfStudents = 120; // Example number of students

const QuestionPapersCard = () => {
  return (
    <Card className="h-100 col-12 col-lg-5">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="mb-0">Question Papers</h4>
          </div>
          <FileText size={36} className="text-primary" />
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="mt-3 mb-1 fw-bold">{numberOfQuestionPapers}</h1>
            <p>Number of Question Papers</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const StudentsCard = () => {
  return (
    <Card className="h-100 col-12 col-lg-5">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="mb-0">Students</h4>
          </div>
          <People size={36} className="text-primary" />
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="mt-3 mb-1 fw-bold">{numberOfStudents}</h1>
            <p>Number of Students</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const StudentStats = () => (
  <div className="d-flex gap-4 row">
    <QuestionPapersCard />
    <StudentsCard />
  </div>
);

export default StudentStats;
