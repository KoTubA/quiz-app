import { useEffect, useState } from "react";

const Quiz = () => {
  const [questionData, setQuestionData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const fetchRandomQuestion = async () => {
    try {
      const randomQuestionIndex = Math.floor(Math.random() * totalQuestions) + 1;
      const response = await fetch("https://graphql.contentful.com/content/v1/spaces/cl9vl6k6hgmo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer w5Iho2RuaFEBtJh5OEopfU0Z-WKNzD0uZEu41CrCntk`,
        },
        body: JSON.stringify({
          query: `
            {
              quizAppCollection(where: {
                id: ${randomQuestionIndex}
              }) {
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
      setQuestionData(result.data.quizAppCollection.items[0]);
    } catch (error) {
      console.error("Error fetching question:", error);
      setError("Wystąpił błąd podczas pobierania pytania. Spróbuj ponownie później.");
    }
  };

  useEffect(() => {
    const fetchQuestionsCount = async () => {
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
                quizAppCollection(limit: 1, order: [id_DESC]) {
                  items {
                    id
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
        setTotalQuestions(result.data.quizAppCollection.items[0].id);
      } catch (error) {
        console.error("Error fetching questions count:", error);
      }
    };

    fetchQuestionsCount();
  }, []);

  //Wywołuje sie przy pobraniu ilosci pytań w bazie (w tym przypadku tylko na poczatku - w celu zaminy tego zachowania ponizszy kod rowniez trzeba przystosować)
  useEffect(() => {
    if (totalQuestions > 0) {
      // Wywołaj funkcję pobierającą losowe pytanie, jeśli jest co najmniej jedno pytanie
      fetchRandomQuestion();
    }
  }, [totalQuestions]);

  const handleAnswerSelection = (index) => {
    // Sprawdź, czy już wybrano odpowiedź
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    // Zresetowania do wartosci fabrycznych przy ładowaniu nowego pytania
    setSelectedAnswer(null);
    setQuestionData(null);
    setError(null);
    // Ładuj kolejne pytanie
    fetchRandomQuestion();
  };

  //Do sprawdzania działania aplikacji
  useEffect(() => {
    console.log("Nowe dane w questionData:", questionData);
  }, [questionData]);

  return (
    <main className="flex justify-center lg:items-center text-white min-h-screen p-4">
      <section className="max-w-2xl w-full">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : questionData ? (
          <>
            <div className="mb-6 flex flex-col gap-3 md:mb-10 md:gap-7">
              <p className="text-sm md:text-xl italic text-foreground-brand/70">Pytanie numer: {questionData.id}</p>
              <p className="text-xl font-medium md:text-2xl">{questionData.titleQuestion}</p>
            </div>
            <form
              method="POST"
              className="flex flex-col justify-center items-center gap-4 md:gap-8"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {Object.entries(questionData).map(([key, value]) => {
                if (key.includes("answear")) {
                  const index = key.slice(-1);
                  const isCorrect = index === questionData.correctAnswear;
                  const isWrong = index === selectedAnswer && index !== questionData.correctAnswear;

                  return (
                    <div key={key} className="w-full">
                      <input id={`answer-${index}`} name={`answer-${index}`} type="radio" value={index} className="hidden focus:outline-none" onChange={() => handleAnswerSelection(index)} />
                      <label className={`flex ${selectedAnswer !== null ? "cursor-default" : "cursor-pointer"} items-center gap-4 rounded-xl border-2 bg-surface-brand-2 p-3 font-medium shadow md:gap-8 md:text-xl ${selectedAnswer !== null ? (isCorrect ? "border-success" : isWrong ? "border-error" : "border-surface-brand-2") : "border-surface-brand-2"}`} htmlFor={`answer-${index}`}>
                        <span className={`flex flex-shrink-0 justify-center items-center h-12 w-12 rounded-xl ${selectedAnswer !== null ? (isCorrect ? "bg-success text-white" : isWrong ? "bg-error text-white" : "bg-slate-100 text-slate-500") : "bg-slate-100 text-slate-500"}`}>{index}</span>
                        <span>{value}</span>
                      </label>
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
          <p className="text-center">Ładowanie pytania...</p>
        )}
      </section>
    </main>
  );
};

export default Quiz;
