import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
    const requiredConfig = [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    const missingConfig = requiredConfig.filter(key => !process.env[key]);
    
    if (missingConfig.length > 0) {
        console.error('Missing Cloudinary configuration:', missingConfig);
        throw new Error(`Missing Cloudinary configuration: ${missingConfig.join(', ')}`);
    }

    console.log('Cloudinary configuration validated successfully');
};

validateCloudinaryConfig();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageToCloudinary = async (file) => {
    try {
        console.log('Starting Cloudinary upload...');
        console.log('File details:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });

        if (!file) {
            throw new Error('No file provided');
        }

        // Convert file to buffer if needed
        let buffer;
        if (file.buffer) {
            buffer = file.buffer;
        } else if (file.path) {
            buffer = fs.readFileSync(file.path);
        } else {
            throw new Error('Invalid file format: No buffer or path found');
        }

        // Upload image to Cloudinary using buffer
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'ecom',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary upload successful:', {
                            public_id: result.public_id,
                            secure_url: result.secure_url
                        });
                        resolve(result);
                    }
                }
            );

            uploadStream.on('error', (error) => {
                console.error('Upload stream error:', error);
                reject(error);
            });

            uploadStream.end(buffer);
        });

        // Clean up temporary file if it exists
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log('Temporary file deleted');
        }

        return {
            public_id: result.public_id,
            secure_url: result.secure_url
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        // Clean up temporary file if it exists
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log('Temporary file deleted after error');
        }
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};

export default uploadImageToCloudinary;
