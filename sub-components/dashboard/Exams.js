// import node module libraries
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Card, Table, Dropdown, Row, Col, Pagination,Button } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import dynamic from 'next/dynamic';
import { Bullseye, ListTask, EyeFill } from 'react-bootstrap-icons';
import AverageScoreCard from "./AverageScoreCard";
import CompletedExamsCard from "./CompletedExamsCard";

import { useRouter } from "next/navigation";

// Dynamic import for Chart component
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Replace this with the actual base URL of your API
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Exams = () => {
    const router = useRouter()
    const [examsData, setExamsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [completedExams, setCompletedExams] = useState(0);
    const examsPerPage = 10;

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover">
            {children}
        </Link>
    ));

    CustomToggle.displayName = 'CustomToggle';

    const ActionMenu = () => {
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted" />
                </Dropdown.Toggle>
                <Dropdown.Menu align={'end'}>
                    <Dropdown.Item eventKey="1">
                        AI feedbacks
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">
                        Another action
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="3">
                        Something else here
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    const calculateAverageScore = (examsData) => {
        if (examsData.length === 0) {
            return 0;
        }

        const totalScore = examsData.reduce((sum, exam) => sum + exam.total_score, 0);
        return totalScore / examsData.length;
    };

    // const completedExams = examsData.length;
    const averageScore = calculateAverageScore(examsData);

    useEffect(() => {
        const fetchExamsData = async () => {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('access_token');
            const userId = localStorage.getItem('user_id');  // Retrieve token from local storage
            if (!token) {
                setError("User is not authenticated");
                setIsLoading(false);
                return;
            }
            if (!userId) {
                setError("User ID not found in local storage");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${apiUrl}/students/student_dashbord?user_id=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('You have not taken any exams yet');
                }
                const data = await response.json();
                const uniqueExamsMap = new Map();
                data.forEach(exam => {
                    if (!uniqueExamsMap.has(exam.question_paper_id)) {
                        uniqueExamsMap.set(exam.question_paper_id, exam);
                    }
                });
                const uniqueExams = Array.from(uniqueExamsMap.values());
                setCompletedExams(uniqueExams.length)
                setExamsData(data);
            } catch (error) {
                setError(error.toString());
            } finally {
                setIsLoading(false);
            }
        };
        fetchExamsData();
    }, []);

    // Pagination logic
    const indexOfLastExam = currentPage * examsPerPage;
    const indexOfFirstExam = indexOfLastExam - examsPerPage;
    const currentExams = examsData.slice(indexOfFirstExam, indexOfLastExam);
    // console.log(currentExams)

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(examsData.length / examsPerPage);

    const viewResultPageRoute = (examDetails) => {
        localStorage.setItem("examDetails",JSON.stringify(examDetails))
        router.push(`/view-result/${examDetails.result_id}`);
    }

    return (
        <>
            <Row>
                <Col xl={10} lg={12} md={12} xs={12} className="my-6">
                <div className="container-fluid">
                    <div className="d-flex row justify-content-between gap-3 gap-md-0">
                        <CompletedExamsCard
                            completedExams={completedExams}
                        />
                        <AverageScoreCard averageScore={averageScore} />
                    </div>
                    </div>
                </Col>
            </Row>
            <Card className="">
                <Card.Header className="bg-white py-4">
                    <h4 className="mb-0">Assessments taken</h4>
                </Card.Header>
                <Table responsive className="text-nowrap mh-100">
                    <thead className="table-light">
                        <tr>
                            <th>Subject</th>
                            {/* <th>Year</th> */}
                            <th>Specification</th>
                            <th>Topic</th>
                            <th>Score</th>
                            <th>Exam Date</th>
                            <th className="d-flex justify-content-center"><div>View result</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" className="text-center text-danger">{error}</td>
                            </tr>
                        ) : currentExams.length > 0 ? (
                            currentExams.map((item, index) => (
                                <tr key={index}>
                                    <td className="align-middle">{item.subject_name}</td>
                                    {/* <td className="align-middle">{item.year}</td> */}
                                    <td className="align-middle">{item.assessment_specification}</td>
                                    <td className="align-middle">{item.topic_name}</td>
                                    <td className="align-middle">{item.total_score}</td>
                                    <td className="align-middle">{new Date(item.exam_date).toLocaleDateString()}</td>
                                    <td className="align-middle ">
                                    {/* <Button variant="primary" className="text-white" href={`/view-result/${item.result_id}`}>
                                    View Result
                                    </Button> */}
                                    <div className="d-flex justify-content-center">
                                  <button className='btn' onClick={()=>{viewResultPageRoute(item)}} 
                                    // href={`./view-result/${item.result_id}`}
                                    ><i className="fe fe-eye text-primary" ></i></button>
                                    </div>

                                    </td>
                                     {/* <td className="align-middle">
                                        <ActionMenu />
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No Assessments found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Card.Footer className="bg-white text-center d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </Card.Footer>
            </Card>
        </>
    );
};

export default Exams;
