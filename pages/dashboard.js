"use client"
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row, Spinner } from 'react-bootstrap';

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import {
    ActiveProjects, Teams,
    TasksPerformance
} from "sub-components";

// import required data files
// import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import Exams from "sub-components/dashboard/Exams";
import ExamPapers from "sub-components/dashboard/ExamPapers";
import Students from "sub-components/dashboard/Students";
import { useRouter } from "next/navigation";
import { getToken } from "next-auth/jwt"
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useContext } from 'react';
import Image from "next/image";
import StudentStats from "widgets/stats/StudentStats";
export default function Dashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    // {
    //     required: true,
    //     onUnauthenticated() {
    //         router.push('/authentication/sign-in');
    //     },
    //   }
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (status === "authenticated") {
            const email = session?.user?.email;
            fetch(`${apiUrl}/auth/get_by_user?email=${email}`)
                .then(response => response.json())
                .then(data => {
                    setUserData(data);
                    const user_id = data.id;
                    localStorage.setItem('user_id', user_id)
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setIsLoading(false);
                });
        } else {
            const registered = localStorage.getItem('registered');
            if (status === "unauthenticated" || registered !== "yes") {
                router.push('/authentication/sign-in');
            }
        }
    }, [session, status, apiUrl, router]);

    if (!userData) {
        return (
            <Fragment>
                <Container fluid className="bg-white pt-10 pb-21 h-100 d-flex align-items-center justify-content-center">
                    <Row>
                        <Col lg={12} md={12} xs={12}>
                            <div className="d-flex">
                                <h2 className="text-center text-primary me-3"> loading user data.</h2>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }

    const { name, role_id } = userData;

    if (isLoading) {
        return <Fragment>
            <Container fluid className="bg-white pt-10 pb-21 h-100 d-flex align-items-center justify-content-center">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className="d-flex">
                            <h2 className="text-center text-primary me-3">Loading... </h2>
                            <Spinner animation="border" variant="primary" />
                        </div>
                    </Col>

                </Row>
            </Container>
        </Fragment>;
    }
    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        {/* Page header */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-white">Welcome back! {name}</h3>
                                </div>
                                <div>
                                    {/* <Link href="#" className="btn btn-white">Create New Project</Link> */}
                                </div>
                            </div>
                        </div>
                    </Col>
                    {/* {ProjectsStatsData.map((item, index) => {
                        return ( */}
                    {role_id === 1 && (
                        <><Col xl={6} lg={12} md={12} xs={12} className="mt-6" >
                            <StatRightTopIcon />
                            {/* <StudentStats /> */}
                        </Col>
                        </>)}
                    {role_id === 2 && (
                        <><Col xl={6} lg={12} md={12} xs={12} className="mt-6" >
                            {/* <StatRightTopIcon /> */}
                            <StudentStats />
                        </Col>
                        </>)}
                    {/* )
                    })} */}
                    {/* <img className="w-100 h-100" src="/images/avatar/student-illustration.jpg"/> */}
                </Row>

                {/* Active Projects  */}
                {/* <ActiveProjects /> */}
                {/* <ExamPapers /> */}
                {/* <Students /> */}
                {role_id === 2 && (
                    <>
                        <Students />
                    </>)}

                <Row className="my-6">
                    <Col xl={3} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">

                        {/* Tasks Performance  */}
                        {/* <TasksPerformance /> */}

                    </Col>
                    {/* card  */}
                    <Col xl={12} lg={12} md={12} xs={12}>

                        {/* Teams  */}
                        {/* <Teams /> */}
                        {role_id === 1 && (
                            <>
                                <Exams />
                            </>)}

                    </Col>
                </Row>
            </Container>
        </Fragment>

    );
}