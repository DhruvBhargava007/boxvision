# Image Analyzer

A React application that can analyze images using OpenAI's Vision API. The app allows users to capture images using their device's camera or upload images from their computer.

## Features

- Camera capture using device webcam
- Image file upload
- Image analysis using OpenAI's GPT-4 Vision API
- Responsive design with Chakra UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key with access to GPT-4 Vision API

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## Usage

1. When you first open the app, you'll be prompted to enter your OpenAI API key
2. The API key will be saved in your browser's local storage for convenience
3. You can either:
   - Use your device's camera to capture an image
   - Upload an image from your computer
4. Click the "Analyze Image" button to get a detailed description of the image

## Security Note

The app currently runs the OpenAI API calls directly from the browser. In a production environment, these calls should be made through a backend server to protect your API key.

## Technologies Used

- React
- TypeScript
- Vite
- Chakra UI
- react-webcam
- OpenAI API
