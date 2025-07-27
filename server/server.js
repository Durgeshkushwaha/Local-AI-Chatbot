require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const connectDB = require("./config/db")
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);


const PORT = process.env.PORT || 5000;



app.listen(PORT, console.log(`Server is running on port ${PORT}`))