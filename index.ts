import Server from "./classes/server";
import userRoutes from "./routes/user";
import mongoose from 'mongoose';
import bodyParser from 'body-parser'


const server = new Server();

// BODY PARSER
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// ROUTES
server.app.use('/user', userRoutes);

// DB
mongoose.connect('mongodb://localhost:27017/badoog',
    { useNewUrlParser: true, useCreateIndex: true }, (err) => {
        if (err) throw err;

        console.log('DB connected');
    });

// START
server.start(() => {
    console.log(`Server running on port ${server.port}.`);
})