# Goodcash-web

# Project Overview: User Onboarding & Account Management Web App

## Introduction

This web app facilitates user onboarding and empowers users to manage their accounts with ease. It provides easy access to account details, card features, and transaction tracking, offering a personalized and secure financial experience.

## Key Features

- **Firebase Auth:** The app utilizes Firebase for phone authentication, leveraging dummy numbers during testing for enhanced security and user convenience. This choice streamlines onboarding with scalability, multi-platform support, and diverse authentication options, improving the overall user experience, and exclusively supports US phone numbers.

Our onboarding offers versatility with two user registration methods: linking a bank account through secure integrations like Plaid Link or directly linking a debit card via Stripe. This dual approach ensures a seamless experience, accommodating diverse user preferences.

- **Bank Account Linking:** In onboarding, our app uses Plaid Link for a secure and user-friendly connection to users' bank accounts, ensuring a smooth and efficient process with robust functionality and enhanced reliability.

- **Debit Card Linking:**In onboarding, our app uses Stripe for secure card storage, enabling users to save card details without immediate bank authentication. This feature allows convenient later charges without repeated authentication, ensuring data confidentiality and integrity for a seamless payment experience.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Development](#development)
  - [Sandbox](#sandbox)
  - [Build](#build)
  - [Start](#start)
  - [Lint](#lint)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Make sure you have the Vercel CLI installed. If not, you can install it globally using npm: `npm install -g vercel` or yarn: `yarn global add vercel`

### Installation

Provide step-by-step instructions on how to install and set up your project locally.

```bash
# Clone the repository
[git clone https://github.com/your-username/your-project.git](https://github.com/GoodCashInc/goodcash-web.git)

# Change directory
cd your-project

# Install dependencies
yarn install
```

## Usage

Below are the different build types for the project:

### Development

To run the web app in dev mode:

```bash
yarn dev
```

this environment uses a local backend server which should be running in port 3000

to run backend server locally please refer to `https://github.com/GoodCashInc/goodcash-server-v2`

we use docker to run postgres image and google-cloud pubsub.

This will start the server at [http://localhost:3001](http://localhost:3001).

### Sandbox

For a sandbox environment:

```bash
yarn sandbox
```

This will start a sandbox build connected to the sandbox server
`https://goodcash-sandbox.goodcashapis.com`

### Build

To build the project:

```bash
yarn build
```

This will create a local build with the specified .env file, this is mostly used for testing builds.

### Start

To start the project:

```bash
yarn start
```

### Lint

To run linting:

```bash
yarn lint
```

## Environment Variables

This project utilizes the Vercel CLI to conveniently pull environment variables from the Vercel hosting environment.

To access environment variables using the Vercel CLI, follow these steps:

1. Make sure you have the Vercel CLI installed. If not, you can install it globally using npm: `npm install -g vercel` or yarn: `yarn global add vercel`

2. Make sure you are logged in with vercel account and linked your local directory with it. (It will prompt you to login into vercel account when you run `yarn dev` script).

3. You may have to change the selected project in vercel cli to `goodcash-web` using `vercel switch` command. For more information please refer to [https://vercel.com/docs/cli](https://vercel.com/docs/cli)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to create an Account

1. **Login/Signup with a US phone number:**

   - Users provide their US phone number to create an account. This step helps ensure that users are associated with a valid and accessible phone number.

2. **Enter OTP:**

   - After providing the phone number, users receive a one-time password (OTP) to verify their identity. This adds an extra layer of security to the account creation process.

3. **Complete KYC via Plaid IDV:**

   - Know Your Customer (KYC) is a process to verify the identity of users. Plaid Identity Verification (IDV) is likely used to streamline and enhance this process, ensuring that users are who they claim to be.

4. **Connect Bank Account or Debit Card:**

   - Users link their bank account or debit card to the GoodCash app. This step is essential for financial apps to facilitate transactions and provide services related to banking.

5. **Accept Privacy Policy and Terms of Use:**

   - Users agree to the app's privacy policy and terms of use. This is a standard practice to inform users about how their data will be handled and the rules governing app usage.

6. **Digitally Sign the Documents:**

   - Users may need to digitally sign relevant documents, such as agreements or contracts. This step ensures legal compliance and user acknowledgment of specific terms and conditions.

7. **Download the App and Login:**
   - After completing the above steps, users can download the GoodCash app and log in using the newly created account. This finalizes the account creation process, allowing users to access the app's features and services.

### Sandbox account testing

We use Firebase Phone Authentication for user sign-in. We've added dummy phone numbers that come with predefined OTPs, making it easy to create test accounts for evaluation purposes.

Retool dashboard can be used to perform account modifications and deletions.
