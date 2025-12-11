Intro:
StudyBuddy+ is a simple study and quiz application that helps users organize and review what they learn. Users can create topics, add their own practice questions, 
and take quick quizzes to test their understanding. The app also includes real-time study statistics that update as quizzes are completed, and an AI question generator 
that suggests new flashcard-style questions for each topic. These features make the app helpful for everyday studying, quick review sessions, and creating personalized study materials.

Tech Stack:
This project uses a full JavaScript tech stack with separate frontend and backend components. The frontend is built with React using Vite, and also includes React Router 
for navigation, Axios for API communication, Framer Motion for simple animations, and Socket.io Client for receiving real-time updates. The backend is built with Node.js 
and Express and uses MongoDB with Mongoose to store topics, questions, quiz attempts, and statistics. It also uses Socket.io to send real-time updates to the frontend and 
the OpenAI Node SDK to generate new practice questions based on the user’s chosen topic. The database is hosted using MongoDB Atlas.

Usage Instructions:
To run the application, start by cloning the repository and installing dependencies for both the backend and frontend. In the backend folder, install packages and create 
a .env file that includes your MongoDB connection string and OpenAI API key. Once the environment variables are set, start the backend server with npm run dev. 
In a separate terminal, go to the frontend folder, install its dependencies, and run npm run dev to launch the React application. Users can then begin using the application 
by creating a topic on the dashboard, then viewing the topic to add questions or generate AI-created ones. They can take quizzes, review their score, and see the live study 
statistics update automatically. The interface is simple to navigate, and all features (topic creation, question management, AI generation, live stats, and quiz-taking) are available 
through the web interface once both servers are running locally.
