const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();
const saltRounds = 10;

// Signup
router.post("/signup", (req, res) => {
    const { user_email, user_password, user_name, last_name, first_name, private} = req.body;
    const db = req.db;

    bcrypt.hash(user_password, saltRounds, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send({ message: "Error hashing password" });
        }

        db.query(
            "SELECT * FROM users WHERE user_email = ? OR user_name = ?;",
            [user_email, user_name],
            (err, result) => {
                if (err) {
                    console.error("Database error during signup:", err);
                    return res.status(500).send({ err });
                }
                if (result.length > 0) {
                    const conflict = result[0];
                    if (conflict.user_name === user_name){
                        return res.status(409).send({message: "Username already in use"}) 
                    }
                    if (conflict.user_email === user_email){
                        return res.status(409).send({message: "Email already in use"}) 
                    }
                }
                db.query(
                    "INSERT INTO users (user_name, user_email, user_password, last_name, first_name, private, is_admin) VALUES (?,?,?,?,?,?,false);", 
                    [user_name, user_email, hash, last_name, first_name, private? 1 : 0],
                    (err) => {
                        if (err) {
                            console.error("Error inserting user:", err);
                            return res.status(500).send({ err });
                        }
                        return res.status(201).send({ message: "Account created successfully" });
                    }
                );
            }
        );
    });
});

// Login
router.post("/login", (req, res) => {
    const { user_name, user_password } = req.body;
    const db = req.db;

    db.query("SELECT * FROM users WHERE user_name = ?;", [user_name], (err, result) => {
        if (err) {
            console.error("Database error during login:", err);
            return res.status(500).send({ err });
        }
        
        if (result.length > 0) {
            bcrypt.compare(user_password, result[0].user_password, (error, response) => {
                if (error) {
                    console.error("Error comparing passwords:", error);
                    return res.status(500).send({ message: "Error comparing passwords" });
                }
                if (response) {
                    const id = result[0].user_id;
                    const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
                    
                    res.cookie("token", token, { 
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "Strict",
                        maxAge: 3600000,
                    });

                    return res.json({ auth: true, message: "Login successful", user: result[0]});
                } else {
                    return res.status(401).send({ message: "Wrong username and/or password" });
                }
            });
        } else {
            return res.status(404).send({ message: "User does not exist" });
        }
    });
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ auth: false, message: "Logged out!" });
});

router.get("/auth", verifyJWT, (req, res) => {
    const db = req.db;  
    const user_id = req.user.id;

    db.query(
        "SELECT user_name, is_admin FROM users WHERE user_id = ?;",
        [user_id],
        (err, result) => {
            if (err) {
                console.error("Error fetching user data:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            
            const user = result[0];
            
            return res.json({
                auth: true,
                user: {
                    user_id,
                    user_name: user.user_name,
                    is_admin: user.is_admin
                }
            });
        }
    );
});

module.exports = router;
