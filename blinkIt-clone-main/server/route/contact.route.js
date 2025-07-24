import { Router } from 'express';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';
import { submitContact, getContacts, updateContactStatus } from '../controllers/contact.controller.js';

const contactRouter = Router();

// Public route for submitting contact form
contactRouter.post('/', submitContact);

// Admin routes - following the same pattern as your other admin routes
contactRouter.get('/get-all', auth, admin, getContacts);
contactRouter.patch('/update-status/:id', auth, admin, updateContactStatus);

export default contactRouter; 