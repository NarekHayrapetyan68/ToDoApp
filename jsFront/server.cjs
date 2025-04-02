const express = require("express");
const app = express();
const path = require("path");

// Serve static files from the current directory
app.use(express.static(__dirname));

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});


app.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});
