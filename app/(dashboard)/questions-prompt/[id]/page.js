"use client";
import React, { useState, useEffect } from 'react';
import { Col, Row, Container, Button, Card, Form } from 'react-bootstrap';
import { getAllEssayQuestions } from 'services/questions-prompt/prompt';
import Loader from 'components/loader/loader';
import Link from 'next/link';
import { updatePrompt } from 'services/questions-prompt/prompt';
import { useRouter } from 'next/navigation';

const PromptAdd = ({ params }) => {
    const [essayQuestions, setEssayQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [paperName, setPaperName] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [papers, setPapers] = useState('');
    const [sectionTitle, setSectionTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [visible, setVisible] = useState(false);

    const router = useRouter();

    /* The `useEffect` hook in the provided code snippet is responsible for fetching data and setting
    initial states when the component mounts or when the `params.id` value changes. */
    useEffect(() => {
        const questionPapers = JSON.parse(localStorage.getItem("questionPaper"));
        if (questionPapers && questionPapers.subject_id) {
            getAllEssayQuestions(params.id, questionPapers.subject_id).then((response) => {
                setIsLoading(false)
                const paper = response.data.questions;
                setPapers(paper);
                setPaperName(paper[0]?.paper_name);
                setSectionName(paper[0]?.sections[0].name);
                setSectionTitle(paper[0]?.sections[0].title);
                const allQuestions = paper[0]?.sections.flatMap(section => section.questions.map(q => ({ ...q, sectionName: section.name, sectionTitle: section.title })));
                setEssayQuestions(allQuestions);
                let prompts = response.prompt.map((value) => {
                    return {
                        questionId: value.question_id,
                        value: value.value
                    }
                })
                setAnswers(prompts)
            });
        }
    }, [params.id]);

    /* The `useEffect` hook in the provided code snippet is responsible for updating the `sectionName` and
    `sectionTitle` states based on the current question index and the array of essay questions
    (`essayQuestions`). */
    useEffect(() => {
        if (essayQuestions?.length > 0) {
            const currentQuestion = currentQuestionIndex ? essayQuestions[currentQuestionIndex - 1] : essayQuestions[currentQuestionIndex];
            setSectionName(currentQuestion?.sectionName);
            setSectionTitle(currentQuestion?.sectionTitle);
        }
    }, [currentQuestionIndex, essayQuestions]);

    useEffect(() => {
        setSaveDisabled(answers.every(answer => answer.value === ''));
    }, [answers]);

    /**
     * The function `handleTextareaChange` updates answers in state based on question ID and value,
     * storing the updated answers in local storage.
     * @param questionId - The `questionId` parameter in the `handleTextareaChange` function represents
     * the unique identifier of the question for which the value is being updated in the answers array.
     * It is used to identify which question the user is providing an answer for.
     * @param value - The `value` parameter in the `handleTextareaChange` function represents the new
     * value of the textarea input for a specific question identified by the `questionId`. This value is
     * used to update or create an answer object in the `prevAnswers` array based on the `questionId`.
     */
    const handleTextareaChange = (questionId, value) => {
        setAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(answer => answer.questionId === questionId);
            let updatedAnswers = [...prevAnswers];
            if (existingAnswerIndex >= 0) {
                updatedAnswers[existingAnswerIndex].value = value;
            } else {
                updatedAnswers = [...prevAnswers, { questionId, value }];
            }
            // setSaveDisabled(updatedAnswers.every(answer => answer.value === ''));
            return updatedAnswers;
        });
    };

    /**
     * The function `renderSubQuestions` takes an array of subQuestions, along with a questionId, and
     * renders each subQuestion with a corresponding textarea for user input.
     * @param [subQuestions] - The `subQuestions` parameter is an array containing objects representing
     * sub-questions. Each object in the array has the following properties:
     * @param questionId - The `questionId` parameter in the `renderSubQuestions` function is used to
     * identify the parent question to which the sub-questions belong. It is passed as an argument to
     * the function to help in rendering and managing the sub-questions associated with a specific
     * parent question.
     * @returns The `renderSubQuestions` function returns an array of JSX elements representing sub
     * questions. Each sub question is displayed with its index, a letter corresponding to the index,
     * the question text with HTML formatting, and a textarea input for the user to provide an answer.
     */
    const renderSubQuestions = (subQuestions = [], questionId) => {
        return subQuestions.map((subQuestion, index) => (
            <div key={subQuestion.question_id} className="mb-3">
                {`${index + 1}. ${String.fromCharCode(97 + index)}. `}
                <span dangerouslySetInnerHTML={{ __html: subQuestion.question_text.replace(/<p>/g, "<span>").replace(/<\/p>/g, "</span>") }} />
                <Form.Group className="mt-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={answers.find(answer => answer.questionId === subQuestion.question_id)?.value || ''}
                        onChange={(e) => handleTextareaChange(subQuestion.question_id, e.target.value)}
                        placeholder="Add Your Prompt here"
                    />
                </Form.Group>
            </div>
        ));
    };

    /**
     * The `renderQuestion` function in JavaScript is used to render a question with dynamic content and
     * handle user input for a form field if the question type is 5.
     * @param question - The `renderQuestion` function takes a `question` object as a parameter. The
     * function then renders the question content based on the properties of the `question` object.
     * @returns The `renderQuestion` function is returning JSX elements based on the `question` object
     * passed as a parameter. It includes a div with the question content, which may contain HTML content
     * that is modified using various string manipulation methods like `replaceAll`, `replace`, and
     * regular expressions. If the question type is 5, it also includes a textarea element for adding
     * prompts. Additionally, if there are sub-
     */
    const renderQuestion = (question) => {
        return (
            <React.Fragment key={question?.question_id}>
                <div className="question-content">
                    <div dangerouslySetInnerHTML={{ __html: question?.question_text.replaceAll("src='uploads\\", `src='${process.env.NEXT_PUBLIC_API_URL}/uploads/`).replaceAll(/\\/g, '/').replaceAll("'>", "' class='w-50'>").replace(/(<img[^>]+>)/g, "<div class='d-flex justify-content-center'>$1</div>").replace(/<p>/g, "<span>").replace(/<\/p>/g, "</span>") }} />
                </div>
                {question?.question_type == 5 && <Form.Group className="my-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={answers.find(answer => answer.questionId === question?.question_id)?.value || ''}
                        onChange={(e) => handleTextareaChange(question?.question_id, e.target.value)}
                        placeholder="Add Your Prompt here"
                    />
                </Form.Group>}
                {question?.sub_questions && renderSubQuestions(question?.sub_questions, question?.question_id)}
                <div className='d-flex justify-content-end'>
                    <Button
                        className='w-24'
                        variant="primary text-light"
                        onClick={handleSave}
                        disabled={saveDisabled}
                    >
                        Save
                        {visible && (
                            <svg aria-hidden="true" role="status" className="inline w-1 h-1 mx-2 text-white animate-spin" width={18} height={18} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        )}
                    </Button>
                </div>
            </React.Fragment>
        );
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex(prevIndex => {
            const newIndex = Math.max(prevIndex - 1, 0);
            return newIndex;
        });
    };

    const handleNext = () => {
        setCurrentQuestionIndex(prevIndex => {
            const newIndex = Math.min(prevIndex + 1, essayQuestions.length - 1);
            // localStorage.setItem("currentPage", newIndex);
            return newIndex;
        });
    };

    const handleFinish = () => {
        setIsDisabled(true);
        let promptArray = {}
        promptArray.data = answers.map((answer) => {
            return {
                id: answer.questionId,
                prompt_text: answer.value
            }
        })

        updatePrompt(promptArray).then((res) => {
            setIsDisabled(false);
            console.log("res", res);
        }).catch((err) => {
            setIsDisabled(false);
            console.log("err", err);
        })

        router.push('/questions-prompt');
    }
    const currentQuestions = papers ? papers[0]?.sections?.flatMap((section) => section.questions)[currentQuestionIndex] : '';

    const renderSectionTitleAndInstructions = (currentSection, questionIndex) => {
        if (currentSection?.questions[0] && questionIndex === 0) {
            return (
                <>
                    <div className="text-center">
                        <div dangerouslySetInnerHTML={{ __html: currentSection.name }} />
                    </div>
                    {/* {currentSection?.title.map((titleItem, index) => (
                <Card.Title key={index} className="text-center">
                  <div dangerouslySetInnerHTML={{ __html: titleItem }} />
                </Card.Title>
              ))} */}
                </>
            );
        }
        return null;
    };

    const handleSave = () => {
        setSaveDisabled(true);
        setVisible(true)
        let promptArray = {}
        promptArray.data = answers.map((answer) => {
            return {
                id: answer.questionId,
                prompt_text: answer.value
            }
        })
        updatePrompt(promptArray).then((res) => {
            setIsDisabled(false);
            setSaveDisabled(false);
            setVisible(false)
            console.log("res", res);
        }).catch((err) => {
            setIsDisabled(false);
            setSaveDisabled(false);
            setVisible(false)
            console.log("err", err);
        })
    }

    if (isLoading) {
        return (
            <Container fluid className="error-msg d-flex align-items-center justify-content-center">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <Loader />
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        /* The above code is a React component that renders a set of essay questions within a Card
        component. It checks if there are any essay questions available, and if so, it displays the
        questions one at a time with navigation buttons for moving to the previous or next question.
        It also includes a "Finish" button. If there are no essay questions available, it displays a 
        message indicating so and provides a link to choose another assessment. */
        <Container fluid className="px-6 py-4">
            {essayQuestions?.length > 0 ? (
                <>
                    <Card>
                        <Card.Body>
                            <Card.Title className='text-center my-5'>
                                {papers[0].sections?.map((section, sectionIndex) =>
                                    section.questions.map((question, questionIndex) => {
                                        if (question.question_id === currentQuestions?.question_id) {
                                            return (
                                                <React.Fragment key={question.question_id}>
                                                    {renderSectionTitleAndInstructions(section, questionIndex)}
                                                </React.Fragment>
                                            );
                                        }
                                        return null;
                                    })
                                )}
                                {/* {currentQuestionIndex == 0 && <div dangerouslySetInnerHTML={{ __html: sectionName }} />} */}
                                <div dangerouslySetInnerHTML={{ __html: sectionTitle }} />
                            </Card.Title>
                            <Row>
                                {renderQuestion(essayQuestions[currentQuestionIndex])}
                            </Row>
                        </Card.Body>
                    </Card>
                    <div className="d-flex justify-content-between mt-3">
                        <Button
                            variant="primary text-light"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}>
                            Previous
                        </Button>
                        {/* <Button
                            variant="primary text-light"
                            onClick={handleSave}
                        >
                            Save Draft
                        </Button> */}
                        {currentQuestionIndex < essayQuestions.length - 1 ? (
                            <Button
                                variant="primary"
                                onClick={handleNext}
                                className='text-light'
                                disabled={currentQuestionIndex === essayQuestions.length - 1}>
                                Next
                            </Button>
                        ) : (
                            <Button variant="success" onClick={handleFinish} disabled={isDisabled} >
                                Finish
                                {isDisabled && <span className="spinner-border spinner-border-sm ms-1 mx-1" role="status" aria-hidden="true"></span>}
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div fluid className="error-msg d-flex align-items-center justify-content-center">
                        <Row className='justify-content-center align-items-center'>
                            <Col sm={6}>
                                <Card>
                                    <Card.Body className='my-5 text-center'>
                                        {`We're sorry, but there are currently no questions available for this assessment. Please check back later or choose another assessment.`}
                                        <div className='mt-5'>
                                            <Link className='btn btn-primary text-light' href={'/assessment'}>Choose Assessment</Link>
                                        </div>
                                    </Card.Body>

                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </Container>
    );
};

export default PromptAdd;
