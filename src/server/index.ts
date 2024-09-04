import express from 'express'
import { AppDataSource } from './config/datasource'
import userRouter from './routes/user.router'
import permissionRouter from './routes/permission.router'
import cors from 'cors'
import { json, urlencoded } from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }))

app.use('/api/users', userRouter);
app.use('/api/permissions', userRouter);

AppDataSource.initialize().then(() => {
    console.log('Database connected');
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log('Error connecting to the database', error));
