# E-commerce Auth Page

A modern, responsive, and fully functional authentication application inspired by typical e-commerce platforms (like SHEIN). This project provides a complete flow for user sign-in and registration, integrated smoothly with Firebase Authentication.

## Features

- **Responsive Design**: Beautiful two-column layout on desktop screens featuring a large cover image, scaling seamlessly to a focused, single-column form on mobile devices.
- **Email & Password Authentication**: Full support for creating new accounts and signing in with existing credentials, complete with form validation (e.g., password confirmation).
- **Social Login**: Integrated with Firebase's `signInWithPopup` to support seamless authentication via:
  - Google
  - Facebook
- **State Management**: Real-time authentication state listening using Firebase `onAuthStateChanged`.
- **User Dashboard**: A localized, temporary dashboard view that greets users upon successful login, displaying their profile picture (if available from social logins), display name, and email address.
- **Polished UI/UX**: Built with Tailwind CSS, featuring subtle transitions, loading indicators, custom fonts (Inter), and high-quality iconography (Lucide React).

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Auth**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Language**: TypeScript

## Getting Started

### Prerequisites

You need Node.js installed to run the development server.

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:

   ```bash
   npm install
   ```

### Firebase Configuration

The project is already wired to use Firebase. The configuration is located securely in `src/lib/firebase.ts`. If you intend to use your own Firebase project, you will need to replace the `firebaseConfig` object inside that file with your own Firebase project credentials and ensure the following providers are enabled in your Firebase Console:
- Email/Password
- Google
- Facebook

### Running the App

To start the development server:

```bash
npm run dev
```

This will run the app typically on `http://localhost:3000`.

To build the app for production:

```bash
npm run build
```

## Project Structure

- `src/App.tsx`: The main application component handling the UI rendering, form state, and authentication logic.
- `src/lib/firebase.ts`: Firebase SDK initialization and provider setup.
- `src/index.css`: Global stylesheet containing the Tailwind CSS import and custom font configuration.
- `src/main.tsx`: The React entry point.
