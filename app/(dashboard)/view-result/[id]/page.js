"use client"

import { useEffect, useState, useCallback } from "react"
import { viewResult, aiExamModeResponse } from "services/results/result"
import { getQuestions } from "services/assessment/assessment"
import { Col, Row, Container, Image, Card, Button, Form } from 'react-bootstrap';
import '../../../../styles/css/style.css'
import TypingAnimation from 'components/animation-text/animated-text';
import React from 'react';
import Loader from "components/loader/loader";
import parse from 'react-html-parser';

export default function ViewResult({ params }) {


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [questionPaper, setQuestionPaper] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiFeedBack, setAiFeedBack] = useState('')
  const [nextBtnVisibility, setNextBtnVisibility] = useState(true)
  const [finishBtnVisibility, setFinishBtnVisibility] = useState(true)
  const [feedBackBtnVisibility, setFeedBackBtnVisibility] = useState(false)


  useEffect(() => {

    let examDetails = JSON.parse(localStorage.getItem('examDetails'))

    getQuestions(examDetails.id ? examDetails.id : examDetails.question_paper_id, examDetails.subject_id, 'view').then((res) => {
      setQuestionPaper(res);
      setCurrentSection(res[0]?.sections[0]);
      setIsLoading(false);
    }).catch((err) => {
      setQuestionPaper(undefined);
      setIsLoading(false);
    })

    viewResult(params.id).then((res) => {
      setAnswers(res.answers)
    })
    // aiExamModeResponse(params.id).then((res)=>{
    //   console.log(res);
    // })
  }, [params.id])

  const currentQuestion = questionPaper[0]?.sections.flatMap((section) => section.questions)[currentQuestionIndex];
  const handleNextQuestionNavigation = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextQuestionIndex);
    updateCurrentSection(nextQuestionIndex + 1);
    //   instanceModeVisibility();
  };
  
  const handlePreviousQuestionNavigation = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    updateCurrentSection(currentQuestionIndex - 1);
  };

  const updateCurrentSection = useCallback(
    (index) => {
      const totalQuestions = questionPaper[0]?.sections.reduce((total, section) => total + section.questions.length, 0);
      const newSection = questionPaper[0]?.sections.find((section) => index < totalQuestions);
      setCurrentSection(newSection || null);
    },
    [questionPaper]
  );

  useEffect(() => {
    updateCurrentSection(currentQuestionIndex);
  }, [currentQuestionIndex]);


  const renderCheckboxInput = (options) => {
    const labels = generateLabels(options.length);
    return (
      <Form>
        {options?.map((option) => (
          <div key={option.id} className="checkbox">
            <label className="checkbox-wrapper w-100 mb-4">
              <input
                type="checkbox"
                className="checkbox-input"
                name="options"
                id={`option-${option.id}`}
                value={option.id}
                disabled
              />
              <span className="checkbox-tile w-100">
                <span className="checkbox-icon">
                  <div>{parse(labels[index] + ". " + option.label?.replace(/<p>/g, '<span>').replace(/<\/p>/g, '</span>'))}</div>
                  {/* <div dangerouslySetInnerHTML={{ __html: labels[index] + ". " + option.label?.replace(/<p>/g, '<span>').replace(/<\/p>/g, '</span>') }} /> */}
                </span>
              </span>
            </label>
          </div>
        ))}
      </Form>
    );
  };


  const renderTextArea = (questionId) => {
    const answer = answers.find(ans => ans.id === questionId);

    return (
      <>
        <Form.Control
          as="textarea"
          className="result-textarea"
          value={answer?.response}
          disabled
          onChange={(event) => handleTextareaChange(event, questionId)}
        />
        <div className="my-3">
          <h5 className="mb-0 fw-bold">Ai Evaluation :</h5>
          {/* {JSON.stringify(answer)} */}
          <span>{parse(answer?.feedback?.correctness?.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\\\(0.0\/3\\\)/g, '0.0/3').replaceAll("###",''))}</span> 
        </div>
      </>
    );
  };

  const generateLabels = (length) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, (_, i) => alphabet[i % 26]);
  };

  const renderRadioInput = (options, questionId) => {
    const answer = answers.find(ans => ans.id === questionId);
    const labels = generateLabels(options.length);
    return (
      <Form className='mt-4'>
        {options?.map((option, index) => {
          // Determine if the current option is selected
          const isSelected = answer?.response.includes(option.id.toString());
          // Determine if the current option is the correct answer
          const isCorrect = answer?.correct_answer.toString() === option.id.toString();

          // Define the class name based on selection and correctness
          let className = "checkbox-tile w-100";
          if (isSelected && isCorrect) {
            className += " correct-selected";
          } else if (isSelected && !isCorrect) {
            className += " incorrect-selected";
          }
          if (isCorrect) {
            className += " correct-answer";
          }

          return (
            <div className="checkbox" key={option.id}>
              <label className="checkbox-wrapper w-100 mb-4">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  name={`option-${questionId}`}
                  id={`option-${option.id}`}
                  value={option.id}
                  checked={isSelected || isCorrect}
                  disabled
                />
                <span className={className}>
                  <div>{parse(labels[index] + ". " + option.label.replace(/<p>/g, '<span>').replace(/<\/p>/g, '</span>'))}</div>
                  {/* <div dangerouslySetInnerHTML={{ __html: labels[index] + ". " + option.label.replace(/<p>/g, '<span>').replace(/<\/p>/g, '</span>') }} /> */}
                </span>
              </label>
            </div>
          );
        })}
      </Form>
    );
  };

  const renderSectionTitleAndInstructions = (currentSection, questionIndex) => {
    if (currentSection?.questions[0] && questionIndex === 0) {
      return (
        <>
          <div className="text-center">
            <div dangerouslySetInnerHTML={{ __html: currentSection.name }} />
          </div>
          {currentSection?.title.map((titleItem, index) => (
            <Card.Title key={index} className="text-center">
              <div dangerouslySetInnerHTML={{ __html: titleItem }} />
            </Card.Title>
          ))}
        </>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Container fluid className="px-6 py-4 h-100 d-flex align-items-center justify-content-center">
      <Loader />
    </Container>
    );
  }

  const getScore = (answers, question) => {
    // Use find instead of map to find the specific answer
    const answer = answers.find((answer) => answer.id === question.question_id);
  
    if (answer) {
      return (
        <div className='text-end' key={answer.id}>
          <span>
            (Score : {answer.rating ? answer.rating : 0}/{question?.score})
          </span>
        </div>
      );
    } else {
      return null; // Return null if the answer with the specified ID is not found
    }
  }
  


  return questionPaper[0] && (
    <>
      <Container fluid className="px-6 py-4">
        {/* <h6 className="text-end">Timer: {formatTime(timer)}</h6> */}
        <Card>
          <Card.Body>
            <Card.Title>{questionPaper[0].paperName}</Card.Title>
            <Row>
              {/* Determine the current section and question index */}
              {questionPaper[0].sections.map((section, sectionIndex) =>
                section.questions.map((question, questionIndex) => {
                  if (question.question_id === currentQuestion?.question_id) {
                    // const totalScore = answers.reduce((acc, answer) => acc + (answer.rating || 0), 0);
                    // const totalScore = answers.map(( answer) => (answer.rating));
                    // console.log("answers", answers) 
                    return (
                      
                      <React.Fragment key={question.question_id}>
                        {renderSectionTitleAndInstructions(section, questionIndex)}
                       
                        {/* <div className='text-end'><span>(Score : {getScore(answers,currentQuestion.question_id)}/{currentQuestion?.score})</span></div> */}
                       {getScore(answers,currentQuestion)}
                        <div dangerouslySetInnerHTML={{ __html: currentQuestion?.question_number + ". " + currentQuestion?.question.replaceAll("src='uploads\\", `src='${process.env.NEXT_PUBLIC_API_URL}/uploads/`).replaceAll(/\\/g, '/').replaceAll("'>", "' class='w-50'>").replace(/(<img[^>]+>)/g, "<div class='d-flex justify-content-center'>$1</div>").replace(/<p>/g, "<span>").replace(/<\/p>/g, "</span>") }} />
                        {currentQuestion?.source_text && (
                          <small className="text-center">
                            ( Source adapted from :{' '}
                            {isLink(currentQuestion.source_text) ? (
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={currentQuestion.source_text}
                              >
                                {currentQuestion.source_text}
                              </a>
                            ) : (
                              <p>{currentQuestion.source_text}</p>
                            )}{' )'}
                          </small>
                        )}

                        {(() => {
                          switch (currentQuestion.question_type) {
                            case 1:
                              return renderRadioInput(currentQuestion.options, currentQuestion.question_id);
                            case 5:
                              return renderTextArea(currentQuestion.question_id);
                            case 3:
                              return renderCheckboxInput(currentQuestion.options, currentQuestion.question_id);
                            default:
                              return null;
                          }
                        })()}

                        {currentQuestion?.sub_questions &&
                          currentQuestion?.sub_questions.map((subQuestion, index) => (
                            <div key={index}>
                              {/* <div className='mb-3' dangerouslySetInnerHTML={{ __html: subQuestion?.sub_question_label + ". " + subQuestion.question }} /> */}
                              {/* {<div className='text-end'><span>(Scored : {totalScore}/{subQuestion?.score})</span></div>} */}
                              {getScore(answers,subQuestion)}
                              <div className='mb-3' dangerouslySetInnerHTML={{ __html: `${currentQuestion.question_number}. ${String.fromCharCode(97 + index)}.  ${subQuestion?.question?.replace(/<p>/g, "<span>").replace(/<\/p>/g, "</span>")}` }} />
                              {(() => {
                                switch (subQuestion.question_type) {
                                  case 1:
                                    return renderRadioInput(subQuestion.options);
                                  case 5:
                                    return renderTextArea(subQuestion.question_id);
                                  case 3:
                                    return renderCheckboxInput(subQuestion.options);
                                  default:
                                    return null;
                                }
                              })()}
                            </div>
                          ))
                        }

                        {/* {aiFeedBack && <TypingAnimation text={aiFeedBack} improvements={aiImprovements} />} */}
                      </React.Fragment>
                    );
                  }
                  return null;
                })
              )}
            </Row>
          </Card.Body>
        </Card>
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="primary"
            className="text-light"
            onClick={handlePreviousQuestionNavigation}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {nextBtnVisibility &&
            currentQuestionIndex !== questionPaper[0].sections.flatMap((section) => section.questions).length - 1 && (
              <Button variant="primary" className="text-light" onClick={handleNextQuestionNavigation}>
                Next
              </Button>
            )}
          {/* {finishBtnVisibility &&
            currentQuestionIndex === questionPaper[0].sections.flatMap((section) => section.questions).length - 1 && (
              <Button variant="success" onClick={handleFinish}>
                Finish
              </Button>
            )} */}
          {/* {feedBackBtnVisibility &&
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleClick}
              disabled={isBtnLoading} // Disable the button when isLoading is true
            >
              Feedback
              {isBtnLoading && (
                <>
                  <span className="spinner-border spinner-border-sm ms-1" role="status" aria-hidden="true"></span>
                  <span className="visually-hidden">Feedback</span>
                </>
              )}
            </button>
          } */}
        </div>
      </Container>
    </>
  );

}