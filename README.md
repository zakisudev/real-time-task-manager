# Real-Time Task Manager

This project is a real-time task manager application built with a React frontend and an Express backend. It uses Socket.IO for real-time updates and MongoDB for data storage.

## Frontend

The frontend is built with React, TypeScript, and Vite. It uses Material-UI for UI components and Tailwind CSS for styling.

### Features

- Real-time task updates using Socket.IO
- Task creation, editing, and deletion
- Form validation
- Notifications for task updates

### Setup

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

### Building for Production

To build the frontend for production, run:
```sh
npm run build
```

### Linting

To lint the code, run:
```sh
npm run lint
```

## Backend

The backend is built with Express and uses MongoDB for data storage. It provides RESTful APIs for task management and uses Socket.IO for real-time communication.

### Features

- RESTful APIs for task management
- Real-time updates using Socket.IO
- MongoDB for data storage

### Setup

1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following content:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

### Running in Production

To start the backend server in production mode, run:
```sh
npm start
```

## Full Stack Setup

To run both the frontend and backend together:

1. Open two terminal windows or tabs.

2. In the first terminal, navigate to the `backend` directory and start the backend server:
   ```sh
   cd backend
   npm run dev
   ```

3. In the second terminal, navigate to the `frontend` directory and start the frontend development server:
   ```sh
   cd frontend
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## License

This project is licensed under the MIT License.