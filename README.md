# Social Media Project (ISA1)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Issues](https://img.shields.io/github/issues/mrparsekar/SocialMediaISA1)](https://github.com/mrparsekar/SocialMediaISA1/issues)
[![Forks](https://img.shields.io/github/forks/mrparsekar/SocialMediaISA1)](https://github.com/mrparsekar/SocialMediaISA1/network/members)
[![Stars](https://img.shields.io/github/stars/mrparsekar/SocialMediaISA1)](https://github.com/mrparsekar/SocialMediaISA1/stargazers)

A full-stack social media application built with React, Vite, Node.js, and MySQL, featuring secure user authentication via Google OAuth 2.0.

**🚀 [Live Demo](https://your-live-demo-url.com) »**

**[Explore the API](https://your-api-docs-link.com) »**

![Project Screenshot]()
*<p align="center">Add a screenshot of your project's homepage here!</p>*

---

### About The Project

This project was built to demonstrate a full-stack implementation of Google OAuth 2.0 in a modern web application using a SQL database. It provides a foundational structure for a social media platform where users can securely log in, create posts, and interact with a community feed.

The repository is structured as a monorepo with two distinct parts:
* `oauth-backend`: A RESTful API built with Node.js and Express.
* `oauth-frontend`: A dynamic single-page application built with React and Vite.

### Key Features

-   ✅ **Secure Google OAuth 2.0:** One-click sign-in and registration.
-   📝 **Post Creation:** Authenticated users can create and view posts.
-   🌐 **Interactive Feed:** A central feed to see posts from all users.
-   🏗️ **Monorepo Structure:** Clean separation of frontend and backend concerns.
-   🔒 **RESTful API:** A well-structured backend API to handle all data operations.

### Built With

Here are the major frameworks and libraries used in this project:

* **Backend:**
    * ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
    * ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
    * ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
    * ![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)
* **Frontend:**
    * ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
    * ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have Node.js (v16+) and npm installed on your machine.
* [Node.js & npm](https://nodejs.org/en/download/)

### Installation Guide

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/mrparsekar/SocialMediaISA1.git](https://github.com/mrparsekar/SocialMediaISA1.git)
    ```
2.  **Navigate into the project directory:**
    ```sh
    cd SocialMediaISA1
    ```

#### Backend Setup

1.  Navigate to the backend folder:
    ```sh
    cd oauth-backend
    ```
2.  Install all required packages:
    ```sh
    npm install
    ```
3.  Create a `.env` file in this directory and add your environment variables for your MySQL database:
    ```env
    # Server Port
    PORT=5000

    # MySQL Database Connection
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```
4.  Start the backend server:
    ```sh
    npm start
    ```
    The server will be running at `http://localhost:5000`.

#### Frontend Setup

1.  Open a **new terminal** and navigate to the frontend folder from the project root:
    ```sh
    cd oauth-frontend
    ```
2.  Install all required packages:
    ```sh
    npm install
    ```
3.  Start the frontend development server:
    ```sh
    npm run dev
    ```
    The application will be running at `http://localhost:5173` (or another port specified by Vite).

---

### License

Distributed under the MIT License. See `LICENSE.txt` for more information.

### Contact

Shreyash Parsekar - [@mrparsekar](https://github.com/mrparsekar)

Project Link: [https://github.com/mrparsekar/SocialMediaISA1](https://github.com/mrparsekar/SocialMediaISA1)
