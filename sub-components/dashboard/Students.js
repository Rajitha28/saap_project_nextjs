import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Col, Row, Card, Table, Button, Pagination, Dropdown, Form, Container } from 'react-bootstrap';
import { FileText, People, Bullseye, ListTask } from 'react-bootstrap-icons';
import { getQuestionPaperById } from 'services/assessment/assessment';
import AverageScoreCard from './AverageScoreCard'
import CompletedExamsCard from './CompletedExamsCard';
import '../../styles/css/style.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentExams, setStudentExams] = useState([]);
  const [examCurrentPage, setExamCurrentPage] = useState(1);
  const [studentsCurrentPage, setStudentsCurrentPage] = useState(1);
  const [examsPerPage, setExamsPerPage] = useState(5);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [numberOfQuestionPapers, setNumberOfQuestionPapers] = useState(0);
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [totalCompletedExams, setTotalCompletedExams] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
    fetchNumberOfQuestionPapers();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [studentExams]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      // console.log(token)
      const fetchStudentsUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${fetchStudentsUrl}/students/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);
      setNumberOfStudents(data.length);

      if (data.length > 0) {
        await fetchStudentExams(data[0].id);
        setSelectedStudent(data[0]);
      }
    } catch (error) {
      console.error('Error fetching students: ', error);
    }
  };

  const fetchNumberOfQuestionPapers = async () => {
    try {
      // const questionPaperList = process.env.NEXT_PUBLIC_BASE_URL;
      // const response = await fetch(`${questionPaperList}/question-paper?subject_id=1`);
      // const data = await response.json();
      const data = await getQuestionPaperById(1);
      setNumberOfQuestionPapers(data.length);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const fetchStudentExams = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      const fetchStudentExamsUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${fetchStudentExamsUrl}/students/student_dashbord?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student exams');
      }

      const data = await response.json();
      const uniqueExamsMap = new Map();
                data.forEach(exam => {
                    if (!uniqueExamsMap.has(exam.question_paper_id)) {
                        uniqueExamsMap.set(exam.question_paper_id, exam);
                    }
                });
                const uniqueExams = Array.from(uniqueExamsMap.values());
                setTotalCompletedExams(uniqueExams.length)
      // console.log(data)
      setStudentExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching student exams: ', error);
    }
  };

  const calculateStatistics = () => {
    if (!studentExams || studentExams.length === 0) {
      setTotalCompletedExams(0);
      setAverageScore(0);
      return;
    }

    const completedExams = studentExams.length;
    const totalScore = studentExams.reduce((acc, exam) => acc + exam.total_score, 0);
    const avgScore = (totalScore / completedExams);
    

    // setTotalCompletedExams(completedExams);
    setAverageScore(avgScore);
  };

  const onViewExams = async (student) => {
    setSelectedStudent(student);
    await fetchStudentExams(student.id);
    setExamCurrentPage(1);
  };

  const indexOfLastExam = examCurrentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = studentExams.slice(indexOfFirstExam, indexOfLastExam);

  const paginateExams = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(studentExams.length / examsPerPage)) {
      setExamCurrentPage(pageNumber);
    }
  };

  const viewResultPageRoute = (examDetails) => {
    localStorage.setItem("examDetails",JSON.stringify(examDetails))
    router.push(`/view-result/${examDetails.result_id}`);
}

  const StudentExams = ({ student, exams }) => {
    const isFirstExamPage = examCurrentPage === 1;
    const isLastExamPage = examCurrentPage === Math.ceil(exams.length / examsPerPage);
    return (
      <Card className="">
        <Card.Header className="bg-white  py-4 d-flex justify-content-between">
          <h4 className="d-flex align-items-center">Assessments taken by {student.name}</h4>
        </Card.Header>
        <Table responsive className="text-nowrap mb-0">
          <thead className="table-light">
            <tr>
              <th>Subject</th>
              <th>Specification</th>
              <th>Topic</th>
              <th>Score</th>
              <th>Exam date</th>
              <th className="d-flex justify-content-center"><div>View Result</div></th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              currentExams.map((exam, index) => (
                <tr key={index}>
                  {/* <div>{JSON.stringify(exam)}</div> */}
                  <td className="align-middle">{exam.subject_name}</td>
                  <td className="align-middle">{exam.assessment_specification}</td>
                  <td className="align-middle">{exam.topic_name}</td>
                  <td className="align-middle">{exam.total_score}</td>
                  <td className="align-middle">{new Date(exam.exam_date).toLocaleDateString()}</td>
                  <td className="align-middle ">
                    <div className='d-flex justify-content-center'>
                    {/* <Link href={`./view-result/${exam.result_id}`}>Result</Link> */}
                    {/* <Link href={`./view-result/${exam.result_id}`}><i className="fe fe-eye text-primary" ></i></Link> */}
                    <button className='btn' onClick={()=>{viewResultPageRoute(exam)}}><i className="fe fe-eye text-primary" ></i></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  <h4>The student has not attended any exams yet.</h4>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Card.Footer className="bg-white text-center d-flex justify-content-center">
          <Pagination>
            <Pagination.First onClick={() => paginateExams(1)} disabled={isFirstExamPage} />
            <Pagination.Prev onClick={() => paginateExams(examCurrentPage - 1)} disabled={isFirstExamPage} />
            {exams.length > 0 && (
              Array.from({ length: Math.ceil(exams.length / examsPerPage) }, (_, i) => (
                <Pagination.Item
                  key={i}
                  active={i + 1 === examCurrentPage}
                  onClick={() => paginateExams(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))
            )}
            <Pagination.Next onClick={() => paginateExams(examCurrentPage + 1)} disabled={isLastExamPage} />
            <Pagination.Last onClick={() => paginateExams(Math.ceil(exams.length / examsPerPage))} disabled={isLastExamPage} />
          </Pagination>
        </Card.Footer>
      </Card>
    );
  };

  const indexOfLastStudent = studentsCurrentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const filteredStudents = students.filter(
    (student) =>
      student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginateStudents = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredStudents.length / studentsPerPage)) {
      setStudentsCurrentPage(pageNumber);
    }
  };

  const isFirstStudentPage = studentsCurrentPage === 1;
  const isLastStudentPage =
    studentsCurrentPage === Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <Row className="d-lg-flex justify-content-around mt-6 mb-4">
      <Col xxl={5} xl={12} lg={12} md={12} xs={12} className='topics-students'>
        <div className='d-flex justify-content-between mb-4'>
          <Card className="h-100 col-lg-5 exams">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-0">Topics</h4>
                </div>
                <FileText size={36} className="text-primary" />
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="mt-3 mb-1 fw-bold">{numberOfQuestionPapers}</h1>
                  {/* <p>Number of Question Papers</p> */}
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card className="h-100 col-lg-5 exams">
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
                  {/* <p>Number of Students</p> */}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className=''>
          <Card>
            <Card.Header className="bg-white py-4 d-md-flex justify-content-between">
              <h4 className="d-flex align-items-center">Students</h4>
              <Dropdown>
                <Dropdown.Toggle variant="primary" className="text-white" id="studentsPerPageDropdown">
                  Students per Page
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setStudentsPerPage(5)}>5</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStudentsPerPage(10)}>10</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStudentsPerPage(20)}>20</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Card.Body>
            <Table responsive className="text-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="d-flex justify-content-center"><div>View Performance</div></th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student, index) => (
                    <tr key={index}>
                      <td className="align-middle">{student.name}</td>
                      <td className="align-middle">{student.email}</td>
                      <td className="align-middle">
                        {/* <Button variant="primary" className="text-white" onClick={() => onViewExams(student)}>
                          View Performance
                        </Button> */}
                        <div className='d-flex justify-content-center'> 
                        <button className='btn' onClick={() => onViewExams(student)}><i className="fe fe-eye text-primary"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      <h4>No students found</h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Card.Footer className="bg-white text-center d-flex justify-content-center">
              <Pagination>
                <Pagination.First
                  onClick={() => paginateStudents(1)}
                  disabled={isFirstStudentPage}
                />
                <Pagination.Prev
                  onClick={() => paginateStudents(studentsCurrentPage - 1)}
                  disabled={isFirstStudentPage}
                />
                {filteredStudents.length > 0 &&
                  Array.from(
                    { length: Math.ceil(filteredStudents.length / studentsPerPage) },
                    (_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i + 1 === studentsCurrentPage}
                        onClick={() => paginateStudents(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    )
                  )}
                <Pagination.Next
                  onClick={() => paginateStudents(studentsCurrentPage + 1)}
                  disabled={isLastStudentPage}
                />
                <Pagination.Last
                  onClick={() =>
                    paginateStudents(Math.ceil(filteredStudents.length / studentsPerPage))
                  }
                  disabled={isLastStudentPage}
                />
              </Pagination>
            </Card.Footer>
          </Card>
        </div>
      </Col>




      <Col  xxl={7} xl={12} lg={12} md={12} xs={12}>
        <h2 className=' text-secondary my-3 text-light'>Student Performance Summary</h2>
        {/* <div className='d-flex gap-4 mb-4'>
          <Card className="h-100 col-lg-5">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-0">completed Exams</h4>
                </div>
                <Bullseye size={36} className="text-success" />
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="mt-3 mb-1 fw-bold">{totalCompletedExams}</h1>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card className="h-100 col-lg-5">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-0">Average Score</h4>
                </div>
                <ListTask size={36} className="text-warning" />
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="mt-3 mb-1 fw-bold">{averageScore}</h1>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div> */}
        <Container fluid>
        <Row className='mb-6 justify-content-between gap-3 gap-md-0'>
        <CompletedExamsCard
            completedExams={totalCompletedExams}
          />
          <AverageScoreCard averageScore={averageScore} />
        </Row>
        </Container>
        <div className=''>
          {selectedStudent && <StudentExams student={selectedStudent} exams={studentExams} />}
        </div>
      </Col>
    </Row>
  );
};

export default Students;