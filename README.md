# Catalog Management Application

This application is a full-stack web application designed for managing a product catalog. It consists of a React-based frontend and a Node.js-based backend.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Frontend Setup](#frontend-setup)
-   [Backend Setup](#backend-setup)
-   [Running the Application](#running-the-application)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

To install and run the Catalog Management Application, you'll need to have Node.js and npm (Node Package Manager) installed on your machine.

1.  **Clone the Repository:**

    ```bash
    git clone <repository_url>
    cd The-Catalog-Project
    ```

    Replace `<repository_url>` with the URL of your Git repository.

## Usage

The application allows users to:

-   View a catalog of products.
-   Add new products to the catalog.
-   Edit existing product details.
-   Delete products from the catalog.

## Frontend Setup

1.  **Navigate to the Frontend Directory:**

    ```bash
    cd catalog-management-app/client
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    * Create a `.env` file in the `client` directory.
    * Add the following environment variable:

        ```
        REACT_APP_API_BASE_URL=http://localhost:9000
        ```

        * This URL should point to your backend server.

## Backend Setup

1.  **Navigate to the Backend Directory:**

    ```bash
    cd catalog-server
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    * Create a `.env` file in the `server` directory.
    * Add the necessary environment variables, such as database connection details. Example using MongoDB:

        ```
        MONGODB_URI=mongodb://localhost:27017/catalog
        PORT=9000
        JWT_SECRET=your_secret_key
        ```

        * Replace `your_secret_key` with a strong, random secret.

4.  **Database Setup:**
    * Ensure your database (e.g. MongoDB) is running.
    * The backend will attempt to connect to the database using the connection string provided in the `.env` file.

## Running the Application

1.  **Start the Backend Server:**

    ```bash
    cd ../catalog-server
    npm run dev
    ```

    * This will start the Node.js server.

2.  **Start the Frontend Application:**

    ```bash
    cd ../catalog-management-app/client
    npm start
    ```

    * This will start the React development server.

3.  **Access the Application:**

    * Open your web browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.

