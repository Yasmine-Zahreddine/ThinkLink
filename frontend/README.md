Frontend Setup Guide
Prerequisites
Before running the frontend, ensure you have the following installed:

1-Node.js (Recommended version: LTS)
2-npm (Comes with Node.js)
Installation & Running the Project
Follow these steps to install and run the frontend:

1-Install Node.js (if not already installed).
2-Navigate to the frontend directory: cd frontend 
3-Install dependencies: npm install
4-Start the development server: npm run dev

The application will now be running, and you can access it at http://localhost:5173/ (or the port specified by Vite).

Frontend Overview
This project is built using React.js with Vite, a fast and lightweight development server. It follows a component-based architecture, ensuring modularity and reusability.

Key features:

State Management: Uses React's built-in state management (useState, useEffect) or external state management if applicable.
Routing: Utilizes React Router (if implemented) for navigation.
Styling: Uses CSS.
API Integration: Communicates with the backend via RESTful APIs or Supabase.
For further development, you can modify the components inside the src/ folder and configure environment variables in .env if needed.
