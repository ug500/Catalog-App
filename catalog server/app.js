require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 9000;


app.use(cors());
app.use(express.json());

// Construct the MongoDB connection string from environment variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbCluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;

const mongoUri = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoUri, {})
    .then(() => {
        console.log("Connected to MongoDB - productsDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});