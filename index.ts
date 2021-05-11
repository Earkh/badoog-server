import Server from "./classes/server";
import mongoose from 'mongoose';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import userRoutes from "./routes/user";
import swipeRoutes from "./routes/swipe";


const server = new Server();
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
// BODY PARSER
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// FILE UPLOAD
server.app.use(fileUpload());

// CORS
server.app.use(cors({ origin: true, credentials: true }));

// ROUTES
server.app.use('/user', userRoutes);
server.app.use('/swipe', swipeRoutes);

// DB
mongoose.connect('mongodb://localhost:27017/badoog',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
        if (err) throw err;

        console.log('DB connected');
    });

// START
server.start(() => {
    console.log(`Server running on port ${server.port}.`);
})