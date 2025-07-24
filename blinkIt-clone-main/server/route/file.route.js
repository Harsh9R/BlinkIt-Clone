import { Router } from 'express';
import uploadImageClodinary from '../utils/uploadImageClodinary.js';
import upload from '../middleware/multer.js';

const fileRouter = Router();

fileRouter.post('/upload', upload.single('image'), async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false
            });
        }

        const uploadResult = await uploadImageClodinary(request.file);

        return response.json({
            message: "File uploaded successfully",
            error: false,
            success: true,
            data: {
                url: uploadResult.secure_url
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Error uploading file",
            error: true,
            success: false
        });
    }
});

export default fileRouter; 