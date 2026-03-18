const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("BlogSphere deployed successfully 🚀");
});

app.listen(process.env.PORT || 3000);