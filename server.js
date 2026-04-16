const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 PAYFAST CONFIG
const MERCHANT_ID = "YOUR_ID";
const MERCHANT_KEY = "YOUR_KEY";
const PASSPHRASE = "YOUR_PASSPHRASE";

// 📦 SAVE ORDER
app.post("/create-order", (req, res) => {
    const order = {
        id: Date.now(),
        items: req.body.cart,
        total: req.body.total,
        status: "pending"
    };

    let orders = [];
    if (fs.existsSync("orders.json")) {
        orders = JSON.parse(fs.readFileSync("orders.json"));
    }

    orders.push(order);
    fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

    res.json(order);
});

// 🔐 GENERATE PAYFAST SIGNATURE
function generateSignature(data) {
    let pfOutput = "";

    Object.keys(data).forEach(key => {
        if (data[key] !== "") {
            pfOutput += `${key}=${encodeURIComponent(data[key])}&`;
        }
    });

    pfOutput = pfOutput.slice(0, -1);
    pfOutput += `&passphrase=${encodeURIComponent(PASSPHRASE)}`;

    return crypto.createHash("md5").update(pfOutput).digest("hex");
}

// 💳 PAYFAST INIT
app.post("/payfast", (req, res) => {
    const { total, orderId } = req.body;

    const data = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        amount: total,
        item_name: "FYDT Order #" + orderId,
        return_url: "http://localhost:3000/success.html",
        cancel_url: "http://localhost:3000/cancel.html",
        notify_url: "http://localhost:5000/notify"
    };

    data.signature = generateSignature(data);

    res.json({
        url: "https://sandbox.payfast.co.za/eng/process",
        data
    });
});

// 🔁 PAYFAST NOTIFY (VERIFICATION)
app.post("/notify", (req, res) => {
    console.log("Payment notification received");

    // TODO: verify data with PayFast
    // update order status to "paid"

    res.sendStatus(200);
});

// 📊 ADMIN ORDERS
app.get("/orders", (req, res) => {
    if (!fs.existsSync("orders.json")) return res.json([]);
    const orders = JSON.parse(fs.readFileSync("orders.json"));
    res.json(orders);
});

app.listen(5000, () => console.log("Server running on port 5000"));