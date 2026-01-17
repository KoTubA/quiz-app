/**
 * Quiz Application Configuration
 *
 * DATA_SOURCE options:
 * - "api" - Fetch questions from Contentful GraphQL API
 * - "local" - Load questions from local JSON file (src/data/quizData.json)
 */

export const quizConfig = {
  // Set your preferred data source here
  DATA_SOURCE: "local",

  // Contentful API Configuration (only used when DATA_SOURCE is "api")
  CONTENTFUL: {
    SPACE_ID: "",
    ACCESS_TOKEN: "",
    ENDPOINT: "",
  },

  // Local data file path (only used when DATA_SOURCE is "local")
  LOCAL_DATA_PATH: "../data/quizData.json",
};
