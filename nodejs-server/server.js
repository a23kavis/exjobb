const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/process", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Node.js server listening on port ${PORT}`);
});
