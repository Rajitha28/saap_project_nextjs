"use client"
import { Col, Row, Container, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { getResult,aiExamModeResponse } from 'services/results/result';
import { useState, useEffect } from 'react';

export default function ResultsPage({ params }) {
  const [result, setResult] = useState([]);

  function formatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes ${remainingSeconds} seconds`;
  }

  useEffect(() => {

  }, [params.id]);

  console.log("params", params);
  // Sample data for demonstration purposes

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Assessment Results</h1>
      <Card>
  <Card.Body>
    <Card.Title className='text-center'>Congratulations on completing the exam!</Card.Title>
    <div className="text-center">
    <p>{"Your assessment is being graded. While it's being processed, you can review some course materials or take a break!"}</p>
      <p>{"Once complete, you'll be able to view your results and detailed feedback in the dashboard."}</p>

      <Link href="/" className="btn btn-primary text-light">Go to Dashboard</Link>
    </div>
  </Card.Body>
</Card>

    </Container>
  );
}
