"use client"

import { useState, useEffect } from 'react';
import { Col, Row, Container, Accordion } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

// import widget as custom components
import { PageHeading } from 'widgets'
import Select from 'react-select';
import '../../../styles/css/style.css'
import { getAllQuestionPapers, getSubject, getQuestionPaperById } from 'services/assessment/assessment';
import Link from 'next/link';
import Loader from 'components/loader/loader';
import { all } from 'axios';

export default function AssessmentPage() {

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isFocused ? '#529289' : '#B6E1DC', // Border color when focused
          borderWidth: '2px',  // Custom border width
          borderRadius: '8px',  // Custom border radius
          boxShadow: state.isFocused ? '0 0 0 1px #B6E1DC' : 'none', // Box shadow on focus
          '&:hover': {
            borderColor: '#B6E1DC', // Border color on hover
            color: 'white'  
          }
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999  // Ensures the menu appears above other elements
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#B6E1DC' : state.isFocused ? '#529289' : null,
          color: state.isSelected ? 'white' : 'black',
          '&:hover': {
            backgroundColor: '#529289',
            color:'white'
          }
        }),
        placeholder: (provided) => ({
          ...provided,
          color: 'black'
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'black'
        }),
        valueContainer: (provided) => ({
          ...provided,
          padding: '0px 8px'  // Custom padding for the value container
        })
      };

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [questionPapers, setQuestionPapers] = useState([]);
    const [subject, setSubject] = useState([]);
    const [allSubject, setAllSubject] = useState([]);
    

    let roleId = localStorage.getItem('role_id')


    useEffect(() => {
        getSubject().then(subjects => {
            let subjectList = subjects.map((subject)=>{
                return {
                    value: subject.id,
                    label: subject.subject_name
                }
            })
                setSubject(subjectList);
            }).catch((err) => {
    
            })
    }, []);

    useEffect(() => {   
        
        getAllQuestionPapers().then(papers => {
            setIsLoading(false);
            const groupedByYear = Object.values(papers.reduce((acc, topic) => {
                const { assessment_specification, ...rest } = topic;
                if (!acc[assessment_specification]) {
                    acc[assessment_specification] = { assessment_specification, items: [] };
                }
                acc[assessment_specification].items.push(rest);
                return acc;
            }, {}));
            setAllSubject(groupedByYear)
            setQuestionPapers(groupedByYear);
        }).catch((err) => {
            setIsLoading(false);
        });

        
    }, []);

    const subjectChange = (selectedOption) =>{
        setIsLoading(true)
        console.log("all",allSubject);
        getQuestionPaperById(selectedOption.value).then((response)=>{
            setIsLoading(false)
            console.log("response",response);
            const groupedByYear = Object.values(response.reduce((acc, topic) => {
                const { assessment_specification, ...rest } = topic;
                if (!acc[assessment_specification]) {
                    acc[assessment_specification] = { assessment_specification, items: [] };
                }
                acc[assessment_specification].items.push(rest);
                return acc;
            }, {}));
            setQuestionPapers(groupedByYear);
        }).catch((err) => {
            setIsLoading(false)
        })
        //   setQuestionPapers(filtered);

    }

    // if (isLoading) {
    //     return (
    //         <Container fluid className="px-6 py-4 h-75 d-flex align-items-center justify-content-center">
    //             <Loader />
    //         </Container>
    //     );
    // }

    return (
        <Container fluid className="py-6 px-2 px-md-6">

        {/* Page Heading */}
        <PageHeading heading="Assessment" />
        <Row className="mt-5 d-flex flex-column">
            <Col>
                <h4 className='mb-3 fw-bold'>Questions</h4>
            </Col>
            <Row>
                <Col className='mb-5' md={4}>
                    <Select
                     options={subject}
                     onChange={subjectChange}
                     styles={customStyles} 
                     placeholder="Select a Subject"
                    ></Select>
                </Col>
            </Row>
            <Col>
            {isLoading && <Loader />}
{!isLoading && questionPapers.length === 0 && <div>No assessment papers available.</div>}
{!isLoading && questionPapers.length > 0 && (
    <Accordion defaultActiveKey="0">
        {questionPapers.map((yearObj, index) => (
            <Accordion.Item key={`year_${index}`} eventKey={`year_${index}`}>
                <Accordion.Header>{yearObj.assessment_specification}</Accordion.Header>
                <Accordion.Body>
                    {yearObj.items.map((item, itemIndex) => (
                        <div key={`item_${item.id}`} style={{ marginBottom: itemIndex !== yearObj.items.length - 1 ? '20px' : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {/* Icon */}
                                <div style={{ marginRight: '10px' }}>
                                    <img style={{ width: "45px" }} src="images/svg/document-round-svgrepo-com.svg" alt="Assessment Icon" />
                                </div>
                                {/* Heading Text */}
                                <div style={{ flexGrow: '1' }}>
                                    <span className="h5">{item.topic_name}</span>
                                </div>
                                <div>
                                    {roleId === '1' && (
                                        <Link className="btn btn-primary h4 text-light mx-2" href={"/assessment/" + item.id}>Start Exam</Link>
                                    )}
                                    {roleId === '2' && (
                                        <Link className="btn btn-primary h4 text-light mx-2" href={"/questions-prompt/" + item.id}>Add Prompt</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        ))}
    </Accordion>
)}

            </Col>
        </Row>
    </Container>
    

    );
}
