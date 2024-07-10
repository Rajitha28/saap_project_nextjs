import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import dynamic from 'next/dynamic';
import { Bullseye, ListTask } from 'react-bootstrap-icons';

// Dynamic import for Chart component
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Hardcoded values
const completedExams = 8;
const totalExams = 12;
const averageScore = 84.25; // Example average score

// Custom toggle for Dropdown
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="text-muted text-primary-hover"
  >
    {children}
  </a>
));

CustomToggle.displayName = 'CustomToggle';

// const ActionMenu = () => (
//   <Dropdown>
//     <Dropdown.Toggle as={CustomToggle}>
//       <MoreVertical size="15px" className="text-muted" />
//     </Dropdown.Toggle>
//     <Dropdown.Menu align="end">
//       <Dropdown.Item eventKey="1">Action</Dropdown.Item>
//       <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
//       <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
//     </Dropdown.Menu>
//   </Dropdown>
// );

const CompletedExamsCard = () => {
  const chartOptions = {
    dataLabels: { enabled: false },
    labels: ['Completed Exams'],
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
            height: 300
          }
        }
      },
      {
        breakpoint: 5000,
        options: {
          chart: {
            height: 320
          }
        }
      }
    ]
  };

  const chartSeries = [(completedExams / totalExams) * 100];

  return (
    <Card className="h-100 col-12 col-lg-5">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="mb-0">Completed Exams</h4>
          </div>
          <Bullseye size={36} className="text-success" />
          {/* <ActionMenu /> */}
        </div>
        <div className="mb-0">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
            width="100%"
          />
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="mt-3 mb-1 fw-bold">{completedExams}</h1>
            <p> Exams Completed</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const AverageScoreCard = () => {
  const chartOptions = {
    dataLabels: { enabled: false },
    labels: ['Average Score'],
    colors: ['#ffc107'],
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
              return val.toFixed(2);
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
            height: 300
          }
        }
      },
      {
        breakpoint: 5000,
        options: {
          chart: {
            height: 320
          }
        }
      }
    ]
  };

  const chartSeries = [averageScore];

  return (
    <Card className="h-100 col-12 col-lg-5">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="mb-0">Average Score</h4>
          </div>
          <ListTask size={36} className="text-warning" />
          {/* <ActionMenu /> */}
        </div>
        <div className="mb-0">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
            width="100%"
          />
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="mt-3 mb-1 fw-bold">{averageScore.toFixed(2)}</h1>
            <p>Average Score</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const PerformanceCharts = () => (
  <div className="d-flex gap-4 row">
    <CompletedExamsCard />
    <AverageScoreCard />
  </div>
);

export default PerformanceCharts;
