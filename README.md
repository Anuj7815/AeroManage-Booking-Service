✈️ AeroManage Booking Service
📦 This repository is part of the AeroManage - Airline Booking System project.
🎟️ Provides functionality to:
   > Book flight tickets
   > Make payments
   > Cancel tickets (with an extended cancellation window)
🔒 Pessimistic locks implemented to handle concurrent bookings and avoid race conditions.
🧾 Idempotent APIs ensure duplicate payments are prevented even if requests are repeated.

## Project Structure

The `src` folder contains all the actual source code for the project, and it does **not** include any kind of tests.

### Folder Breakdown

1. **`config`**  
   In this folder, all configuration and setup for libraries or modules are managed.
   - Example: Setting up a logging library to help prepare meaningful logs.

2. **`routes`**  
   This folder contains route definitions. In the `routes` folder, we register routes and associate them with corresponding middleware and controllers.

3. **`controllers`**  
   Controllers are responsible for receiving incoming requests, passing data to the business layer, and structuring the API response.
   - Controllers call the business logic after receiving requests and data, then return the response after the business layer completes the processing.

4. **`repositories`**  
   This folder contains the logic to interact with the database. All raw queries or ORM queries are written here.

5. **`services`**  
   The services folder contains the business logic. Services interact with repositories to retrieve data from the database and execute the business rules.

6. **`utils`**  
   Utility folder for helper methods, error classes, and other commonly used code across the project.

## Project Setup

To set up the project on your local machine, follow these steps:

### 1. Clone the project:
Clone this repository to your local machine:

```bash
git clone <repository_url>
```

### 2. Initialize the project:
Go inside the folder path and execute the following command:

```bash
npm install
```

### 3. Setting up .env file:
In the root directory create a '.env' file and add the following env vaiables

```bash
  1. PORT=<port of your choice>
```

### 4. Setting up sequelize:
Inside the 'src/config' folder create a file name as config.json and go inside the src folder in terminal and write the following command: 

```bash
npx sequelize init
```

By executing the above command you will get migrations and seeders folder along with config.json inside the config folder
If you are setting up your development environment, then write the username of your DB and password of your DB and in dialect mention whatever DB you are using (eg: mysql, mariadb, etc).
If you are setting up test or prod environment, make sure you also replace the host with the hosted DB URL.

### 5. Starting the server:
To start the server, run the following command:

```bash
npm run dev
```
