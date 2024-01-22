import { useEffect, useState } from "react";

const Quiz = () => {
  const [questionData, setQuestionData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://graphql.contentful.com/content/v1/spaces/cl9vl6k6hgmo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer dpuA2Ad0frndDj9NbZhYlGeYBWp0Bfkq8f3BA8FcELw`,
          },
          body: JSON.stringify({
            query: `
              {
                quizAppCollection(order: [id_ASC], limit: 500) {
                  items {
                    id
                    titleQuestion
                    answerA
                    answerB
                    answerC
                    answerD
                    correctAnswer
                    photo {
                      url
                    }
                  }
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setQuestionData(result.data.quizAppCollection.items);

        if (storedCurrentQuestionIndex !== null) {
          let index = parseInt(storedCurrentQuestionIndex, 10);
          // Check if storedCurrentQuestionIndex exceeds the number of questions
          if (index < 0 || index >= result.data.quizAppCollection.items.length) {
            index = 0;
          }
          setCurrentQuestionIndex(index);
          setCurrentQuestion(shuffleAnswers(result.data.quizAppCollection.items[index]));
        } else {
          setCurrentQuestion(shuffleAnswers(result.data.quizAppCollection.items[0]));
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Wystąpił błąd podczas pobierania pytań. Spróbuj ponownie później.");
      }
    };

    const storedAnswers = JSON.parse(localStorage.getItem("quiz_answers")) || {};
    const storedCurrentQuestionIndex = localStorage.getItem("current_question_index");
    setUserAnswers(storedAnswers);

    fetchQuestions();
  }, []);

  // Function to save answers to localStorage
  const saveAnswerToLocalStorage = (questionId, selectedAnswer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  //Function to save currect question to localStorage
  const saveCurrentQuestionIndexToLocalStorage = (index) => {
    localStorage.setItem("current_question_index", index);
  };

  // Effect to monitor changes in userAnswers and save them to localStorage
  useEffect(() => {
    if (userAnswers) {
      localStorage.setItem("quiz_answers", JSON.stringify(userAnswers));
    }
  }, [userAnswers]);

  //const currentQuestion = questionData && questionData[currentQuestionIndex];

  const handleAnswerSelection = (index) => {
    // Check if an answer has already been selected
    if (selectedAnswer !== null) {
      return;
    }

    // Save the answer to localStorage upon selection
    saveAnswerToLocalStorage(currentQuestion.id, index);
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    // Reset to default values when loading a new question
    setSelectedAnswer(null);
    setError(null);

    // Move to the next question or go back to the first one if at the end
    const nextIndex = (currentQuestionIndex + 1) % (questionData.length || 1);

    setCurrentQuestionIndex(nextIndex);
    saveCurrentQuestionIndexToLocalStorage(nextIndex);
    // Set the current question based on the updated index
    setCurrentQuestion(shuffleAnswers(questionData[nextIndex]));
  };

  const handleRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionData.length);
    setCurrentQuestionIndex(randomIndex);
    saveCurrentQuestionIndexToLocalStorage(randomIndex);
    setSelectedAnswer(null);
    setError(null);
    setCurrentQuestion(shuffleAnswers(questionData[randomIndex]));
  };

  const handleQuestionItemClick = (index) => {
    // Switch to the question at the specified index
    setCurrentQuestionIndex(index);
    saveCurrentQuestionIndexToLocalStorage(index);
    // Reset the selected answer value
    setSelectedAnswer(null);
    // Reset any error messages
    setError(null);
    setCurrentQuestion(shuffleAnswers(questionData[index]));
  };

  // Function to reset the answer for the current question
  const handleResetCurrentQuestion = () => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.id]: null,
    }));
    // Remove the current question from localStorage
    const updatedAnswers = { ...userAnswers };
    delete updatedAnswers[currentQuestion.id];
    localStorage.setItem("quiz_answers", JSON.stringify(updatedAnswers));
    setCurrentQuestion(shuffleAnswers(questionData[currentQuestionIndex]));
    setSelectedAnswer(null);
  };

  // Function to reset localStorage
  const handleResetLocalStorage = () => {
    localStorage.removeItem("quiz_answers");
    setUserAnswers({});
    setCurrentQuestion(shuffleAnswers(questionData[currentQuestionIndex]));
    setSelectedAnswer(null);
  };

  // Elements needed for question randomization:
  // Answer labels used for assigning letters to answers (A, B, C, D)
  const answerLabels = ["A", "B", "C", "D"];

  // Answer counter used for assigning answer labels in order (A, B, C, D)
  let answerCounter = 0;

  // Function for shuffling answers in a question
  const shuffleAnswers = (question) => {
    const keys = Object.keys(question);
    keys.sort(() => Math.random() - 0.5);

    const shuffledObject = {};
    keys.forEach((key) => {
      shuffledObject[key] = question[key];
    });

    return shuffledObject;
  };

  return (
    <main className="flex justify-center lg:items-center text-white min-h-screen px-4 py-4 lg:py-12">
      <section className="max-w-3xl w-full">
        {error ? (
          <p className="text-error text-center text-xl font-medium md:text-2xl">{error}</p>
        ) : currentQuestion ? (
          <div className="flex md:flex-col flex-col-reverse md:gap-6 gap-12">
            <div className="flex flex-col">
              <div className="mb-6 max-h-36 overflow-y-auto bg-surface-brand-2 p-3 rounded-xl section-scroll">
                <ul className="flex flex-wrap w-full">
                  {questionData.map((question, index) => {
                    const userAnswer = userAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    const isWrong = userAnswer && userAnswer !== question.correctAnswer;

                    return (
                      <li key={index + 1} className={`flex justify-center items-center p-1 m-1 w-8 h-8 rounded-xl list-none cursor-pointer ${index === currentQuestionIndex && !isCorrect && !isWrong ? "bg-surface-accent-1 text-white" : isCorrect ? "bg-success" : isWrong ? "bg-error" : "bg-slate-100 text-slate-500"}`} onClick={() => handleQuestionItemClick(index)}>
                        {index + 1}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex w-full gap-3 flex-col md:flex-row justify-end">
                <button type="button" onClick={handleResetCurrentQuestion} className="rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
                  Zresetuj to pytanie
                </button>
                <button type="button" onClick={handleResetLocalStorage} className="rounded-xl border-2 border-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
                  Zresetuj odpowiedzi
                </button>
              </div>
            </div>
            <div>
              <div className="mb-6 flex flex-col gap-3">
                <div className="flex gap-2 justify-between">
                  <span className="text-sm md:text-xl italic text-foreground-brand/70">
                    Pytanie numer {currentQuestionIndex + 1} z {questionData.length}
                  </span>
                  <span className="text-sm md:text-xl italic text-foreground-brand/70">Pytanie ID: {currentQuestion.id}</span>
                </div>
                <p className="text-xl font-medium md:text-2xl">{currentQuestion.titleQuestion}</p>
              </div>
              {currentQuestion.photo && currentQuestion.photo.url && (
                <div className="mb-6">
                  <img src={currentQuestion.photo.url} alt="Quiz" className="w-full h-auto" />
                </div>
              )}
              <form
                method="POST"
                className="flex flex-col justify-center items-center gap-4 md:gap-8"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                {Object.entries(currentQuestion).map(([key, value], i) => {
                  if (key.includes("answer")) {
                    const counter = answerCounter++;
                    const index = key.slice(-1);
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const isWrong = index === selectedAnswer && index !== currentQuestion.correctAnswer;

                    return (
                      <div key={key} className="w-full">
                        <button className={`flex w-full ${selectedAnswer !== null ? "cursor-default" : "cursor-pointer"} items-center gap-4 rounded-xl border-2 bg-surface-brand-2 p-3 font-medium shadow md:gap-8 md:text-xl ${selectedAnswer !== null ? (isCorrect ? "border-success" : isWrong ? "border-error" : "border-surface-brand-2") : "border-surface-brand-2"}`} onClick={() => handleAnswerSelection(index)}>
                          <span className={`flex flex-shrink-0 justify-center items-center h-12 w-12 rounded-xl ${selectedAnswer !== null ? (isCorrect ? "bg-success text-white" : isWrong ? "bg-error text-white" : "bg-slate-100 text-slate-500") : "bg-slate-100 text-slate-500"}`}>{answerLabels[counter]}</span>
                          <span className="text-left break-words min-w-0">{value}</span>
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}
                <div className="flex w-full gap-3 flex-col md:flex-row">
                  <button type="button" onClick={handleRandomQuestion} className="w-full rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
                    Losuj pytanie
                  </button>
                  <button type="button" onClick={handleNextQuestion} className="w-full rounded-xl border-2 border-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
                    Kolejne pytanie
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl font-medium md:text-2xl">Ładowanie bazy pytań ...</p>
        )}
      </section>
    </main>
  );
};

export default Quiz;
