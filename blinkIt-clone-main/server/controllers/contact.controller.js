import Contact from '../models/contact.model.js';

export const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        await contact.save();

        return res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.',
            data: contact
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong while submitting your message.',
            error: true
        });
    }
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            data: contacts,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching contact submissions',
            error: true
        });
    }
};

export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found',
                error: true
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: contact,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error updating contact status',
            error: true
        });
    }
}; 