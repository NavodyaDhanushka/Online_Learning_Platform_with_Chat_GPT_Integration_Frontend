# Online Learning Platform with ChatGPT Integration

This document provides a complete and structured overview of your Online Learning Platform with ChatGPT Integration, including architecture, ER diagrams, backend and frontend setup, authentication, API endpoints, and deployment instructions for AWS EC2 (Linux).

## Documentation

[Documentation](https://drive.google.com/drive/folders/1v6Yr96CHGJX68iRE91g1YuhDwScRuC2E?usp=drive_link)


## Tech Stack

**Frontend:** React + Tailwind + React Router

**Backend:** Node.js + Express + MongoDB (Mongoose)

**AI Service:** OpenAI / ChatGPT API integration

**Auth:** Node.js + Express + MongoDB (Mongoose)

**Deployment:** AWS EC2 (Ubuntu)



## Features

- Browse courses
- View course details
- Enroll in courses
- Ask AI-powered questions using ChatGPT integration
- Admins can create/update/delete courses

## Run Locally

#### Clone the project frontend

```bash
  git clone https://github.com/NavodyaDhanushka/Online_Learning_Platform_with_Chat_GPT_Integration_Frontend.git
```

Go to the project directory

```bash
  cd vite-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
## Environment Variables
To run this project, you will need to add the following environment variables to your .env file for 
#### Frontend

`VITE_API_BASE_URL`= 

## Deployment

Your application is successfully deployed on an AWS EC2 instance, making it accessible over the internet through its public IP address. After configuring the server, installing required dependencies, and allowing the necessary inbound ports in the EC2 security group, the app is now live and running at:

👉 http://3.1.204.225:3000

## Demo

[Demo](https://drive.google.com/drive/folders/165_WSWGV3IcZmMqA3-ztrWa3m-oEG_f-?usp=drive_link)


## Feedback

If you have any feedback, please reach out to us at navodyadhanushka01@gmail.com