import express from 'express'
import "reflect-metadata";
import { AppDataSource } from './config/datasource'
import userRouter from './routes/user.router'
import loginRouter from './routes/login.router'
import permissionRouter from './routes/permission.router'
import cors from 'cors'
import { json, urlencoded } from 'express';
import { ADMIN_PROTECT } from './middleware/jwtVerify';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }))

app.use('/api/users', ADMIN_PROTECT, userRouter);
app.use('/api/permissions', ADMIN_PROTECT, permissionRouter);
app.use('/api/auth', loginRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "not Found!" })
})

AppDataSource.initialize().then(() => {
    console.log('Database connected');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log('Error connecting to the database', error));
