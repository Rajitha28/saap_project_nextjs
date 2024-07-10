'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import { getQuestionPaper } from "services/assessment/assessment"
import { PageHeading } from "widgets"
import Loader from "components/loader/loader"

export default function ExamPage({ params }) {

  const router = useRouter();

  const [questionPaper, setQuestionPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getQuestionPaper(params.id).then((res) => {
      localStorage.setItem("examDetails", JSON.stringify(res))
      setQuestionPaper(res);
      setIsLoading(false);
    }).catch((err) => {
      setQuestionPaper(undefined);
      setIsLoading(false);
    })
  }, [params.id]);

  const examRoute = (type) => {
    if (type == 'instant') {
      localStorage.setItem('examMode', type)
      router.push('/assessment-page')
    } else if (type == 'exam') {
      localStorage.setItem('examMode', type)
      router.push('/assessment-page')
    }
  }

  
  if (isLoading) {
    return (
      <Container fluid className="px-6 py-4 h-100 d-flex align-items-center justify-content-center">
        <Loader />
      </Container>
    );
  }


  return (
    questionPaper && (
      <Container fluid className="py-6 px-2 px-md-6">
        <PageHeading heading="Choose Mode of Exam" />
        <Card className="p-3 p-lg-4">
          <div>
            <h4 className="mb-0 fw-bold">
              {questionPaper?.title}
            </h4>
            <h5 className="mt-4 mb-0 fw-bold">Instant Mode</h5>
            <p className="mt-4" style={{ textAlign: 'justify' }} >
            In Instant Mode, you will receive immediate feedback after answering each question. This mode allows you to know right away whether your answer was correct or incorrect, along with detailed feedback. Additionally, you have the option to revisit and revise your answers at any point during the assessment.
            </p>
            <h5 className="mt-4 mb-0 fw-bold">Exam Mode</h5>
            <p className="mt-4" style={{ textAlign: 'justify' }} >
            In Exam Mode, you will take the entire assessment without receiving immediate feedback after each question. Instead, your marks and feedback will be provided at the end of the assessment. This mode simulates a traditional exam setting, helping you to focus on completing all questions before reviewing your performance.
            </p>
          </div>
          <Row>
            <Col>
              <div className="d-flex justify-content-center align-items-center">
                <button onClick={()=>{examRoute('instant')}} className="btn text-light mx-1 mx-lg-3 btn-primary col col-md-3 col-lg-2" href="../assessment-page/">
                  Instant Mode
                </button>
                <button onClick={() => {examRoute('exam')}} className="btn mx-1 mx-lg-3 text-light btn-primary col col-md-3 col-lg-2 " href="../assessment-page/">
                  Exam Mode
                </button>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    )
  );
}
