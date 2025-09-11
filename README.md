# nanoBananaImageGen

nanoBananaImageGen is a web application that generates image prompts and images using various AI services. It features a React frontend and a Node.js backend.

## Features

-   Generate image prompts with OpenAI.
-   Generate images with OpenRouter.
-   Upload images to Google Drive.
-   Modern UI for interacting with the services.

## Tech Stack

-   **Frontend:** React, Vite
-   **Backend:** Node.js, Express
-   **Services:**
    -   OpenAI API
    -   OpenRouter AI
    -   Google Drive API

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nanoBananaImageGen.git
cd nanoBananaImageGen
```

### 2. Install dependencies

This command will install dependencies for both the server and the client.

```bash
npm run install-all
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# OpenRouter API Key
OPENROUTER_API_KEY=your-openrouter-api-key

# Google Drive API Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=your-google-redirect-uri
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
```

### 4. Running the Application

You can run the application in development mode, which will automatically rebuild the client and restart the server on file changes.

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

## Running with Docker

To run the application with Docker, first ensure you have Docker and Docker Compose installed. Then, from the root of the project, run:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3001`.

## API Endpoints

-   `POST /api/generate`: Generates image prompts.
-   `POST /api/generate-image`: Generates an image.
-   `POST /api/upload-image`: Uploads an image to Google Drive.

## License

This project is licensed under the MIT License.
