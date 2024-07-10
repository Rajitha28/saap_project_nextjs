import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgressBar, Col, Row, Card, Table, Image, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';

const ExamPapers = () => {
  const [selectedSubject, setSelectedSubject] = useState({ id: null, subject_name: "" });
  const [subjects, setSubjects] = useState([]);
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const subjectList = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${subjectList}/subject/get`);
      const data = await response.json();
      setSubjects(data);
      if (data.length > 0) {
        setSelectedSubject(data[0]);
        fetchData(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching subjects: ', error);
    }
  };

  const fetchData = async (subjectId) => {
    try {
      const questionPaperList = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${questionPaperList}/question-paper?subject_id=${subjectId}`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    fetchData(subject.id);
    setSearchTerm(''); // Reset search term when changing subject
  };

  const filteredPapers = papers.filter((paper) =>
    (paper.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Row className="mt-6">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="bg-white py-4">
            <div className='d-flex align-items-center'>
              <h4 className="me-3">Exam Papers</h4>
              <DropdownButton className='text-light' id="dropdown-basic-button" title={selectedSubject.subject_name} >
                {subjects.map((subject, index) => (
                  <Dropdown.Item key={index} onClick={() => handleSubjectChange(subject)}>
                    {subject.subject_name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </Card.Header>
          <Card.Body>
            <Form.Control
              type="text"
              placeholder="Search question papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card.Body>
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>Topic</th>
                <th>Year</th>
                <th>Month</th>
                <th>Paper</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.length > 0 ? (
                filteredPapers.map((paper, index) => (
                  <tr key={index}>
                    <td className="align-middle">{paper.title}</td>
                    <td className="align-middle">{paper.year}</td>
                    <td className="align-middle">{paper.month}</td>
                    <td className="align-middle">
                      <Button variant="primary text-light">Start Exam</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    <h4>No question papers found.</h4>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {/* <Card.Footer className="bg-white text-center">
            <Link href="#" className="link-primary">View All Papers</Link>
          </Card.Footer> */}
        </Card>
      </Col>
    </Row>
  );
};

export default ExamPapers;