import express from 'express';

import { signin, signup } from '../controllers/users.js';
import { upload } from '../services/fileUpload.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', upload.single("profilePicture"), signup);

export default router;