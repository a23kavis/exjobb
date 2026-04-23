const fs = require("fs");
const path = require("path");

const TOTAL_USERS = 5000;
const FIRST_NAMES = [
  "Liam",
  "Olivia",
  "Noah",
  "Emma",
  "Oliver",
  "Ava",
  "Elijah",
  "Sophia",
  "William",
  "Isabella"
];
const LAST_NAMES = [
  "Andersson",
  "Johansson",
  "Karlsson",
  "Nilsson",
  "Eriksson",
  "Larsson",
  "Olsson",
  "Persson",
  "Svensson",
  "Gustafsson"
];
const DOMAINS = ["example.com", "mail.com", "demo.org", "sample.net"];

function getFullName(index) {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
  return `${firstName} ${lastName}`;
}

function buildUser(id) {
  const index = id - 1;
  const name = getFullName(index);
  const normalizedName = name.toLowerCase().replace(/\s+/g, ".");
  const domain = DOMAINS[index % DOMAINS.length];

  return {
    id,
    name,
    email: `${normalizedName}${id}@${domain}`,
    password: `Pass!${id}Word#${(id % 97) + 3}`,
    age: 18 + (id % 48),
    country: "Sweden",
    isActive: id % 3 !== 0
  };
}

function generatePayload(totalUsers) {
  const users = new Array(totalUsers);

  for (let i = 0; i < totalUsers; i += 1) {
    users[i] = buildUser(i + 1);
  }

  return users;
}

function writePayloadFile(payload) {
  const outputPath = path.join(__dirname, "payload.json");
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf-8");
}

function main() {
  const payload = generatePayload(TOTAL_USERS);
  writePayloadFile(payload);
  console.log(`Generated payload.json with ${payload.length} users.`);
}

main();
