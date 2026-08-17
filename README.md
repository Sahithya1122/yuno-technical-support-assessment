# Yuno Technical Support Analyst Assessment

## Yunique Fashion Store – Payment Integration

This project demonstrates an end-to-end payment integration using Yuno Full Checkout for the Yunique Fashion Store.

The implementation includes Yuno Dashboard configuration, payment routing, Checkout Builder configuration, a Node.js/Express backend, Yuno Web SDK Full Checkout, Credit Card processing, and a successful test transaction using the Yuno Testing Gateway.

## Project Objective

Build a generic checkout experience that:

- Uses Yuno Full Checkout.
- Embeds the Yuno checkout inside a web page.
- Supports Credit Card payments.
- Creates a Yuno customer.
- Creates a Yuno checkout session.
- Generates a one-time payment token through the Yuno Web SDK.
- Creates the payment through the Yuno API.
- Routes the payment through the Yuno Testing Gateway.
- Completes a successful end-to-end test transaction.

## Technology Stack

- HTML5
- JavaScript
- Node.js
- Express.js
- Yuno Web SDK
- Yuno Sandbox / Testing Environment
- Yuno Testing Gateway
- Git / GitHub

## Project Structure

```text
yuno-technical-support-assessment/
│
├── backend/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   └── index.html
│
└── README.md
```

## Solution Architecture

```text
Customer
   ↓
Generic Checkout Page
   ↓
Yuno Web SDK - Full Checkout
   ↓
Node.js / Express Backend
   ↓
Yuno Customer API
   ↓
Yuno Checkout Session API
   ↓
Embedded Credit Card Checkout
   ↓
One-Time Payment Token
   ↓
Node.js / Express Backend
   ↓
Yuno Payment API
   ↓
Yuno Testing Gateway
   ↓
Transaction Approved
```

## Yuno Dashboard Configuration

The following configuration was completed in the Yuno test environment:

1. Yuno Test Payment Gateway connection.
2. Credit Card payment method configuration.
3. Card routing configuration.
4. Published Card route.
5. Checkout Builder configuration with Credit Card enabled.

## Backend Implementation

The backend is implemented using Node.js and Express.js.

### Backend responsibilities

1. Create a Yuno customer.
2. Create a Yuno checkout session.
3. Return the checkout session to the frontend.
4. Receive the Yuno one-time payment token.
5. Create the payment through the Yuno Payment API.
6. Use an idempotency key for payment creation.

### Main API flow

```text
POST /api/create-checkout-session
        ↓
Create Yuno customer
        ↓
Create Yuno checkout session
        ↓
Return checkout session
```

```text
POST /api/create-payment
        ↓
Receive one-time payment token
        ↓
Call Yuno Payment API
        ↓
Return payment result
```

## Frontend Implementation

The frontend is implemented using HTML and JavaScript.

The page provides a generic product and checkout experience.

The Yuno Web SDK is used to:

1. Initialize Yuno using the Organization Public Key.
2. Request a checkout session from the backend.
3. Start Full Checkout.
4. Mount the embedded checkout.
5. Display the Credit Card payment form.
6. Receive the one-time payment token.
7. Send the token to the backend.
8. Continue the payment flow.

## Payment Flow

```text
1. Customer opens the checkout page.
2. Frontend requests a checkout session.
3. Backend creates a Yuno customer.
4. Backend creates a Yuno checkout session.
5. Checkout session is returned to the frontend.
6. Yuno Full Checkout is embedded.
7. Customer selects Credit Card.
8. Customer enters the test card details.
9. Yuno generates a one-time payment token.
10. Frontend sends the token to the backend.
11. Backend creates the payment through Yuno.
12. Yuno Testing Gateway processes the transaction.
13. Transaction is approved.
```

## Test Environment

The application uses the Yuno Sandbox / Test environment.

The Credit Card transaction was tested using the Yuno Testing Gateway.

Final test result:

**Transaction approved**

## Security

Sensitive credentials are stored in environment variables and are excluded from Git.

The following files are intentionally not committed to GitHub:

```text
backend/.env
backend/node_modules/
```

The Yuno Secret Key is kept only on the backend and is never exposed in the frontend.

## Troubleshooting Performed

During implementation, the following issues were investigated and resolved:

### 1. Node.js command not recognized

Node.js and npm were initially unavailable.

Resolution:
- Installed Node.js LTS.
- Verified with `node --version` and `npm --version`.

### 2. Incorrect working directory

Some commands were initially run from the wrong directory.

Resolution:
- Organized the project into `backend` and `frontend`.
- Ran the backend from the `backend` folder.

### 3. Yuno checkout API 403 Forbidden

The checkout-session API initially returned HTTP 403.

Resolution:
- Verified API credentials and Account ID.
- Reviewed the request payload.
- Simplified the checkout request to the required fields.
- Retested successfully.

### 4. Yuno sandbox service availability

A temporary `SERVICE_UNAVAILABLE` response was observed from the sandbox customer API.

Resolution:
- Verified the configuration.
- Retried the request after the sandbox service became available.

### 5. Yuno Web SDK loading issue

The frontend initially reported:

`Yuno is not defined`

Browser Developer Tools showed that the SDK script was blocked.

Resolution:
- Corrected the SDK loading configuration.
- Verified the SDK loaded successfully.
- Verified the embedded Credit Card checkout rendered.

### 6. GitHub setup

Git was installed and configured locally.

The project was committed and pushed to GitHub while excluding:

```text
.env
node_modules/
```

## Verification

The following checkpoints were successfully verified:

- Yuno Dashboard configuration
- Yuno Test Payment Gateway
- Card routing
- Published Card route
- Checkout Builder configuration
- Node.js backend
- Yuno customer creation
- Yuno checkout session creation
- Yuno Web SDK loading
- Embedded Credit Card checkout
- One-time payment token flow
- Payment API integration
- Successful end-to-end test transaction

## Result

The implementation successfully completed an end-to-end Credit Card payment using:

**Yuno Full Checkout + Node.js/Express + Yuno Testing Gateway**

Final result:

> Transaction approved

## Local Setup

### Prerequisites

- Node.js LTS
- Git

### Clone the repository

```bash
git clone https://github.com/Sahithya1122/yuno-technical-support-assessment.git
cd yuno-technical-support-assessment
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Configure environment variables

Create a `.env` file inside the `backend` folder:

```text
YUNO_PUBLIC_KEY=YOUR_PUBLIC_KEY
YUNO_SECRET_KEY=YOUR_SECRET_KEY
YUNO_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

Do not commit the `.env` file.

### Start the backend

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

## Notes

This project is intended for the Yuno assessment/test environment.

For a production deployment, use secure secret management, HTTPS, persistent storage where required, monitoring, logging, and production credentials.

## Author

Sahithya Ayla

Yuno Technical Support Analyst Assessment
