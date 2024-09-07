import express from 'express';
import { createApplication, getApplication, getAllApplications, updateApplication, deleteApplication } from '../controller/application.controller'; // Adjust the path as needed

const router = express.Router();

router.post('/', createApplication);
router.get('/:id', getApplication);
router.get('/', getAllApplications);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
