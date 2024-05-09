![Chatzo](/client/public/Chatzo_BE.png)

### [🏠 Home](../README.md)
### [💻 Frontend Setup](../client/README.md)


Our Chat App backend, powered by Node.js with Express, Mongoose, Socket.io, Cloudinary, and Express Validator, ensures real-time communication, efficient data management, and secure file uploads. Leveraging these technologies, we've built a scalable and robust backend system for seamless chat functionality.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Results](#results)
- [Usage](#usage-notes)

## Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **npm (Node Package Manager)**: Required for installing dependencies.
- **Add environment variable**: sample environment variable file is provide add 

## Getting Started

1. Clone or download this repository to your local machine:
```bash
sudo git clone https://github.com/Sakibdevlekar/Chatzo-The-Real-Time-Chatting-App.git
```

- Open a terminal window and navigate to the client directory.

```bash
cd server
```
### **Create the .env File:**
- Start by creating a new file named .env in the server directory of project.

- Copy Sample Variables:
Open the [⚙️ .env.sample](../server/sample.env) file and copy its contents. These are sample environment variables that your application needs.

- Paste into .env:
Paste the copied variables into your .env file. These variables typically include sensitive information like API keys, database credentials, and other configurations.



- Install the dependency's

```javascript
npm install
```

- Run the script by entering the following command:

```javascript
npm run dev
```
## Results
Once the backend server is running, you can start using the Chatzo Chat App's features. To access the backend functionalities, you typically don't interact directly via a browser but through API endpoints using tools like Postman or through your frontend application's code.


### Usage Notes
- For detailed information about available API endpoints, request formats, authentication requirements, and response structures, refer to the **[Chatzo Backend API Documentation](https://your-deployment-link.com)**.

- Use this documentation to understand and integrate the backend API into your frontend application effectively.

- Feel free to explore and enhance the Chatzo backend as needed. If you have any suggestions or improvements for this README, please let us know!