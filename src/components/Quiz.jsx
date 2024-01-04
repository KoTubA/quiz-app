import { useEffect, useState } from "react";

const Quiz = () => {
  const [questionData, setQuestionData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://graphql.contentful.com/content/v1/spaces/cl9vl6k6hgmo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer w5Iho2RuaFEBtJh5OEopfU0Z-WKNzD0uZEu41CrCntk`,
          },
          body: JSON.stringify({
            query: `
              {
                quizAppCollection(order: [id_ASC]) {
                  items {
                    id
                    titleQuestion
                    answearA
                    answearB
                    answearC
                    answearD
                    correctAnswear
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
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Wystąpił błąd podczas pobierania pytań. Spróbuj ponownie później.");
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questionData && questionData[currentQuestionIndex];

  const handleAnswerSelection = (index) => {
    // Sprawdź, czy już wybrano odpowiedź
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    // Zresetuj do wartości fabrycznych przy ładowaniu nowego pytania
    setSelectedAnswer(null);
    setError(null);

    // Przejdź do kolejnego pytania lub wróć do pierwszego, jeśli osiągnięto koniec
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % (questionData.length || 1));
  };

  const handleQuestionItemClick = (index) => {
    // Przełącz na pytanie o indeksie
    setCurrentQuestionIndex(index);
    // Zresetuj wartość wybranej odpowiedzi
    setSelectedAnswer(null);
    // Zresetuj ewentualne komunikaty o błędach
    setError(null);
  };

  // Do sprawdzania działania aplikacji
  useEffect(() => {
    console.log("Nowe dane w questionData:", questionData);
    console.log("Aktualne pytanie:", currentQuestion);
  }, [questionData, currentQuestion]);

  return (
    <main className="flex justify-center lg:items-center text-white min-h-screen px-4 py-4 lg:py-8">
      <section className="max-w-3xl w-full">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : currentQuestion ? (
          <>
            <div className="mb-6 max-h-36 overflow-y-auto bg-surface-brand-2 p-3 rounded-xl section-scroll">
              <ul className="flex flex-wrap w-full">
                {questionData.map((question, index) => (
                  <li key={index + 1} id={`question-${index + 1}`} className={`flex justify-center items-center p-1 m-1 w-8 h-8 rounded-xl list-none bg-slate-100 text-slate-500 cursor-pointer	${index === currentQuestionIndex ? "bg-surface-accent-1 text-white" : ""}`} onClick={() => handleQuestionItemClick(index)}>
                    {index + 1}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-8 flex flex-col gap-3">
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
              {Object.entries(currentQuestion).map(([key, value]) => {
                if (key.includes("answear")) {
                  const index = key.slice(-1);
                  const isCorrect = index === currentQuestion.correctAnswear;
                  const isWrong = index === selectedAnswer && index !== currentQuestion.correctAnswear;

                  return (
                    <div key={key} className="w-full">
                      <button id={`answer-${index}`} name={`answer-${index}`} className={`flex w-full ${selectedAnswer !== null ? "cursor-default" : "cursor-pointer"} items-center gap-4 rounded-xl border-2 bg-surface-brand-2 p-3 font-medium shadow md:gap-8 md:text-xl ${selectedAnswer !== null ? (isCorrect ? "border-success" : isWrong ? "border-error" : "border-surface-brand-2") : "border-surface-brand-2"}`} onClick={() => handleAnswerSelection(index)}>
                        <span className={`flex flex-shrink-0 justify-center items-center h-12 w-12 rounded-xl ${selectedAnswer !== null ? (isCorrect ? "bg-success text-white" : isWrong ? "bg-error text-white" : "bg-slate-100 text-slate-500") : "bg-slate-100 text-slate-500"}`}>{index}</span>
                        <span className="text-left">{value}</span>
                      </button>
                    </div>
                  );
                }
                return null;
              })}
              <button type="button" onClick={handleNextQuestion} className="w-full rounded-xl bg-surface-accent-1 p-3 font-medium shadow md:text-xl">
                Kolejne pytanie
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-xl font-medium md:text-2xl">Ładowanie bazy pytań ...</p>
        )}
      </section>
    </main>
  );
};

export default Quiz;
