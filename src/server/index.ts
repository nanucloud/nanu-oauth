import express from 'express'
import "reflect-metadata";
import { AppDataSource } from './config/datasource'
import userRouter from './routes/user.router'
import authRouter from './routes/auth.router'
import permissionRouter from './routes/permission.router'
import applicationRouter from './routes/application.router'
import mypageRouter from './routes/mypage.router'
import oauthRouter from './routes/oauth.router'
import cors from 'cors'

import { json, urlencoded } from 'express';
import { ADMIN_PROTECT , USER_PROTECT } from './middleware/jwtVerify'; //JWT 인증로직

const app = express();
const PORT = process.env.PORT || 4000;

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }))

app.use('/api/users', ADMIN_PROTECT, userRouter);
app.use('/api/permissions', ADMIN_PROTECT, permissionRouter);
app.use('/api/applications', ADMIN_PROTECT, applicationRouter);

app.use('/api/mypage', USER_PROTECT, mypageRouter); //회원정보 조회

app.use('/api/auth', authRouter); //사용자 로그인/로그아웃
app.use('/api/oauth', oauthRouter); //사용자 로그인/로그아웃

app.use((req, res, next) => {
    res.status(404).json({ message: "not Found!" })
})

AppDataSource.initialize().then(() => {
    console.log('Database connected');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log('Error connecting to the database', error));