import express from 'express'
import { ApplicationController } from '../controller/application.controller'

const router = express.Router();
const applicationController = new ApplicationController();

router.get('/',applicationController.getApplication)
router.post('/', applicationController.createApplication)
router.put('/', applicationController.updateApplication)
router.delete('/', applicationController.createApplication)

export default router