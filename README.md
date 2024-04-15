# SecurePass - Password Manager App

SecurePass is a mobile app developed with React Native that allows users to securely store and manage their passwords. It uses MongoDB to store encrypted password data and communicates with a Node.js server for authentication and data management.

## Features

- User authentication: Users can create an account or login using their credentials.
- Password storage: Securely store passwords with encryption.
- Password generation: Generate strong, unique passwords for new accounts.
- Password management: View, edit, and delete stored passwords.
- Secure encryption: Passwords are encrypted using industry-standard encryption algorithms.
- Offline mode: Access stored passwords even when offline.

## Technologies Used

- React Native: Frontend framework for building mobile apps.
- MongoDB: NoSQL database for storing encrypted password data.
- Node.js: Backend server for handling authentication and data management.
- Express: Web framework for Node.js used to build the server.
- bcrypt: Library for hashing passwords before storing them in the database.

## Getting Started

To run the app locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-repo-url.git`
2. Install dependencies: `cd SecurePass && npm install`
3. Start the Node.js server: `cd server && npm start`
4. Start the React Native app: `cd ../app && npm start`

## Usage

- Register a new account or login with existing credentials.
- Add new passwords using the "Add Password" feature.
- View, edit, or delete passwords in the app.
- Generate new passwords for new accounts.
- Use the app securely to manage your passwords.

