import express from 'express'
import { ApplicationController } from '../controller/application.controller'

const router = express.Router();
const applicationController = new ApplicationController();

router.post('/',applicationController.getApplication)

export default router