const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/process", (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: "Request body must be a JSON array." });
  }

  const filteredUsers = req.body.filter((user) => Number(user.id) % 2 !== 0);
  filteredUsers.sort((a, b) => String(a.name).localeCompare(String(b.name)));

  const processedUsers = filteredUsers.map((user) => ({
    ...user,
    password: crypto.createHash("sha256").update(String(user.password)).digest("hex")
  }));

  return res.status(200).json(processedUsers);
});

app.listen(PORT, () => {
  console.log(`Node.js server listening on port ${PORT}`);
});
