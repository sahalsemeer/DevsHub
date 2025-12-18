const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Sending OPTIONS response');
    console.log('Headers being sent:', res.getHeaders());
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

app.patch("/profile/edit", (req, res) => {
  console.log('✅ PATCH received');
  res.json({ message: "Success!" });
});

app.listen(7777, () => {
  console.log("Test server running on 7777");
});