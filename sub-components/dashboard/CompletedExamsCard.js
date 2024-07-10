import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Card, Table, Dropdown, Row, Col } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import dynamic from 'next/dynamic';
import { Bullseye, ListTask } from 'react-bootstrap-icons';
import AverageScoreCard from "./AverageScoreCard";
import { getAllQuestionPapers } from 'services/assessment/assessment';

// Dynamic import for Chart component
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Replace this with the actual base URL of your API
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CompletedExamsCard = ({ completedExams }) => {
    const [totalExams, setTotalExams] = useState(0);

    useEffect(() => {
        const fetchTotalExams = async () => {
          try {
            const data = await getAllQuestionPapers();
            setTotalExams(data.length);
          } catch (error) {
            console.error('Error fetching total exams:', error);
          }
        };
    
        fetchTotalExams();
      }, []);

    const chartOptions = {
        dataLabels: { enabled: false },
        labels: ['Topics Covered'],
        colors: ['#28a745'],
        plotOptions: {
            radialBar: {
                startAngle: 0,
                endAngle: 360,
                hollow: {
                    size: '70%',
                },
                track: {
                    background: 'transparent',
                },
                dataLabels: {
                    show: true,
                    value: {
                        show: true,
                        formatter: function (val) {
                            return `${(val * totalExams / 100).toFixed(0)}/${totalExams}`;
                        }
                    }
                }
            }
        },
        chart: { type: 'radialBar' },
        stroke: { lineCap: 'round' },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 280
                    }
                }
            },
            {
                breakpoint: 1500,
                options: {
                    chart: {
                        height: 250
                    }
                }
            },
            {
                breakpoint: 5000,
                options: {
                    chart: {
                        height: 300
                    }
                }
            }
        ]
    };

    const chartSeries = [(completedExams / totalExams) * 100];

    return (
        <Card className="h-100 col-12  exams col-md-6 p-0">
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="mb-0">Topics Covered</h4>
                    </div>
                    <Bullseye size={36} className="text-success" />
                </div>
                <div className="d-lg-flex flex-xl-column flex-xxl-row align-items-center justify-content-between">
                <div className="mb-0">
                    {totalExams > 0 &&<Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="radialBar"
                        width="100%"
                    />}
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <h1 className="mt-3 mb-1 fw-bold">{completedExams}</h1>
                        <p> Topics Covered</p>
                    </div>
                </div>
                </div>
            </Card.Body>
        </Card>
    );
};
export default CompletedExamsCard;