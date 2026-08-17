const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = 3000;

const YUNO_API_URL = "https://api-sandbox.y.uno";

// Keep checkout-session details temporarily in memory
// for this local assessment demo.
const checkoutStore = new Map();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "frontend", "index.html")
    );
});

// --------------------------------------------------
// CREATE CUSTOMER + CHECKOUT SESSION
// --------------------------------------------------

app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const publicKey = process.env.YUNO_PUBLIC_KEY;
        const secretKey = process.env.YUNO_SECRET_KEY;
        const accountId = process.env.YUNO_ACCOUNT_ID;

        if (!publicKey || !secretKey || !accountId) {
            return res.status(500).json({
                error: "Missing Yuno environment variables"
            });
        }

        // ----------------------------
        // Create customer
        // ----------------------------

        const merchantCustomerId =
            `yunique-customer-${Date.now()}`;

        const customerResponse = await fetch(
            `${YUNO_API_URL}/v1/customers`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "public-api-key": publicKey,
                    "private-secret-key": secretKey
                },
                body: JSON.stringify({
                    merchant_customer_id:
                        merchantCustomerId,
                    first_name: "Test",
                    last_name: "Customer",
                    email:
                        `test-${Date.now()}@example.com`,
                    country: "US"
                })
            }
        );

        const customerText =
            await customerResponse.text();

        let customerData;

        try {
            customerData =
                JSON.parse(customerText);
        } catch {
            return res.status(502).json({
                error:
                    "Yuno customer API returned non-JSON",
                status:
                    customerResponse.status,
                response_preview:
                    customerText.slice(0, 300)
            });
        }

        if (!customerResponse.ok) {
            return res.status(
                customerResponse.status
            ).json({
                error:
                    "Yuno customer creation failed",
                details: customerData
            });
        }

        const customerId = customerData.id;

        if (!customerId) {
            return res.status(502).json({
                error:
                    "Customer ID was not returned",
                details: customerData
            });
        }

        console.log(
            "Yuno customer created:",
            customerId
        );

        // ----------------------------
        // Create checkout session
        // ----------------------------

        const merchantOrderId =
            `yunique-order-${Date.now()}`;

        const checkoutPayload = {
            account_id: accountId,
            merchant_order_id: merchantOrderId,
            payment_description:
                "Yunique Fashion Store test order",
            country: "US",
            customer_id: customerId,
            amount: {
                currency: "USD",
                value: 5000
            }
        };

        const checkoutResponse = await fetch(
            `${YUNO_API_URL}/v1/checkout/sessions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "public-api-key": publicKey,
                    "private-secret-key": secretKey
                },
                body: JSON.stringify(
                    checkoutPayload
                )
            }
        );

        const checkoutText =
            await checkoutResponse.text();

        let checkoutData;

        try {
            checkoutData =
                JSON.parse(checkoutText);
        } catch {
            return res.status(502).json({
                error:
                    "Yuno checkout API returned non-JSON",
                status:
                    checkoutResponse.status,
                response_preview:
                    checkoutText.slice(0, 300)
            });
        }

        if (!checkoutResponse.ok) {
            return res.status(
                checkoutResponse.status
            ).json({
                error:
                    "Yuno checkout session creation failed",
                details: checkoutData
            });
        }

        const checkoutSession =
            checkoutData.checkout_session;

        if (!checkoutSession) {
            return res.status(502).json({
                error:
                    "Checkout session was not returned",
                details: checkoutData
            });
        }

        // Save details needed for payment creation
        checkoutStore.set(checkoutSession, {
            customerId,
            merchantOrderId,
            amount: {
                currency: "USD",
                value: 5000
            },
            country: "US"
        });

        console.log(
            "Checkout session created:",
            checkoutSession
        );

        return res.json({
            customer_id: customerId,
            checkout_session: checkoutSession
        });

    } catch (error) {
        console.error(
            "Checkout-session error:",
            error
        );

        return res.status(500).json({
            error: "Unexpected backend error",
            message: error.message
        });
    }
});

// --------------------------------------------------
// CREATE PAYMENT FROM YUNO ONE-TIME TOKEN
// --------------------------------------------------

app.post("/api/create-payment", async (req, res) => {
    try {
        const {
            checkout_session,
            one_time_token
        } = req.body;

        if (!checkout_session) {
            return res.status(400).json({
                error:
                    "checkout_session is required"
            });
        }

        if (!one_time_token) {
            return res.status(400).json({
                error:
                    "one_time_token is required"
            });
        }

        const sessionData =
            checkoutStore.get(checkout_session);

        if (!sessionData) {
            return res.status(400).json({
                error:
                    "Checkout session not found in server memory"
            });
        }

        const publicKey =
            process.env.YUNO_PUBLIC_KEY;

        const secretKey =
            process.env.YUNO_SECRET_KEY;

        const accountId =
            process.env.YUNO_ACCOUNT_ID;

        if (!publicKey || !secretKey || !accountId) {
            return res.status(500).json({
                error:
                    "Missing Yuno environment variables"
            });
        }

        // Yuno requires a unique idempotency key
        const idempotencyKey =
            crypto.randomUUID();

        const paymentPayload = {
            account_id: accountId,

            merchant_order_id:
                sessionData.merchantOrderId,

            description:
                "Yunique Fashion Store test payment",

            country:
                sessionData.country,

            amount:
                sessionData.amount,

            checkout: {
                session:
                    checkout_session
            },

            customer_payer: {
                id:
                    sessionData.customerId
            },

            payment_method: {
                token:
                    one_time_token
            },

            workflow: "SDK_CHECKOUT"
        };

        console.log(
            "Creating Yuno payment..."
        );

        const paymentResponse = await fetch(
            `${YUNO_API_URL}/v1/payments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "public-api-key": publicKey,
                    "private-secret-key": secretKey,
                    "X-Idempotency-Key":
                        idempotencyKey
                },
                body: JSON.stringify(
                    paymentPayload
                )
            }
        );

        const paymentText =
            await paymentResponse.text();

        console.log(
            "Payment status:",
            paymentResponse.status
        );

        console.log(
            "Payment response:",
            paymentText.slice(0, 1000)
        );

        let paymentData;

        try {
            paymentData =
                JSON.parse(paymentText);
        } catch {
            return res.status(502).json({
                error:
                    "Yuno payment API returned non-JSON",
                status:
                    paymentResponse.status,
                response_preview:
                    paymentText.slice(0, 300)
            });
        }

        if (!paymentResponse.ok) {
            return res.status(
                paymentResponse.status
            ).json({
                error:
                    "Yuno payment creation failed",
                details:
                    paymentData
            });
        }

        console.log(
            "Yuno payment created successfully:",
            paymentData.id
        );

        return res.json({
            success: true,
            payment: paymentData,
            sdk_action_required:
                paymentData.sdk_action_required === true
        });

    } catch (error) {
        console.error(
            "Payment creation error:",
            error
        );

        return res.status(500).json({
            error:
                "Unexpected payment error",
            message:
                error.message
        });
    }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});