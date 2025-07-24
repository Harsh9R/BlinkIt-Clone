import uploadImageToCloudinary from "../utils/uploadImageClodinary.js"

const uploadImageController = async (request, response) => {
    try {
        // Check if file exists in the request
        if (!request.file) {
            console.error('No file in request');
            return response.status(400).json({
                message: "No file uploaded. Please select an image file.",
                error: true,
                success: false
            });
        }

        const file = request.file;

        // Log file details for debugging
        console.log('File details:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            fieldname: file.fieldname
        });

        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
            console.error('Invalid file type:', file.mimetype);
            return response.status(400).json({
                message: "Invalid file type. Only image files are allowed.",
                error: true,
                success: false
            });
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            console.error('File too large:', file.size);
            return response.status(400).json({
                message: "File size too large. Maximum size is 5MB.",
                error: true,
                success: false
            });
        }

        console.log('Attempting to upload to Cloudinary...');
        const uploadImage = await uploadImageToCloudinary(file);
        console.log('Cloudinary upload successful:', uploadImage);

        if (!uploadImage || !uploadImage.secure_url) {
            console.error('Invalid upload response:', uploadImage);
            throw new Error('Upload failed - no URL returned from Cloudinary');
        }

        return response.json({
            message: "Image uploaded successfully",
            data: {
                url: uploadImage.secure_url
            },
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Upload error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Only image files are allowed')) {
            return response.status(400).json({
                message: "Invalid file type. Only image files are allowed.",
                error: true,
                success: false
            });
        }

        if (error.message.includes('File too large')) {
            return response.status(400).json({
                message: "File size too large. Maximum size is 5MB.",
                error: true,
                success: false
            });
        }

        if (error.message.includes('Cloudinary configuration')) {
            console.error('Cloudinary configuration error:', error);
            return response.status(500).json({
                message: "Server configuration error. Please contact support.",
                error: true,
                success: false
            });
        }

        console.error('Unexpected upload error:', error);
        return response.status(500).json({
            message: error.message || "Error uploading file. Please try again.",
            error: true,
            success: false
        });
    }
};

export default uploadImageController;