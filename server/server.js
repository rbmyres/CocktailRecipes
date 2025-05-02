const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require('path');
const port = process.env.PORT || 8080;

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://mixer.rbmyres.com", 
    credentials: true
}));

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const followRoutes = require('./routes/followRoutes');
const likeRoutes = require('./routes/likeRoutes');
const postRoutes = require('./routes/postRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/follow', followRoutes);
app.use('/like', likeRoutes);
app.use('/post', postRoutes);
app.use('/report', reportRoutes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
