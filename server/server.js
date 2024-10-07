const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173"],  // Allowing requests from your frontend running on Vite
};

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "mango", "banana"] });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
}) 