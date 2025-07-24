import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await Axios({
                ...SummaryApi.submitContact,
                data: formData
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className='w-full container mx-auto px-2 py-8'>
            <div className='grid md:grid-cols-2 gap-8'>
                {/* Contact Form */}
                <div className='bg-white p-7 rounded shadow-md'>
                    <h2 className='text-2xl font-semibold mb-6'>Get in Touch</h2>
                    <form className='grid gap-4' onSubmit={handleSubmit}>
                        <div className='grid gap-1'>
                            <label htmlFor='name'>Name</label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                placeholder='Enter your name'
                                className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                                required
                            />
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='Enter your email'
                                className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                                required
                            />
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='subject'>Subject</label>
                            <input
                                type='text'
                                id='subject'
                                name='subject'
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder='Enter subject'
                                className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                                required
                            />
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='message'>Message</label>
                            <textarea
                                id='message'
                                name='message'
                                value={formData.message}
                                onChange={handleChange}
                                placeholder='Enter your message'
                                rows='4'
                                className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded resize-none'
                                required
                            />
                        </div>
                        <button 
                            type='submit'
                            disabled={isSubmitting}
                            className='bg-primary-200 text-white py-2 rounded hover:bg-primary-300 transition-all mt-4 disabled:bg-gray-400'
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>

                {/* Contact Information */}
                <div className='grid gap-8 content-start'>
                    <div className='bg-white p-7 rounded shadow-md'>
                        <h2 className='text-2xl font-semibold mb-6'>Contact Information</h2>
                        <div className='grid gap-4'>
                            <div className='flex items-center gap-3'>
                                <FaPhone className='text-primary-200 text-xl' />
                                <div>
                                    <p className='font-medium'>Phone</p>
                                    <a href='tel:+1234567890' className='text-gray-600 hover:text-primary-200'>
                                        +1 (234) 567-890
                                    </a>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <FaEnvelope className='text-primary-200 text-xl' />
                                <div>
                                    <p className='font-medium'>Email</p>
                                    <a href='mailto:contact@blinkit.com' className='text-gray-600 hover:text-primary-200'>
                                        contact@blinkit.com
                                    </a>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <FaMapMarkerAlt className='text-primary-200 text-xl' />
                                <div>
                                    <p className='font-medium'>Address</p>
                                    <p className='text-gray-600'>
                                        123 Blinkit Street, City Name,<br />
                                        State 12345, Country
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className='bg-white p-7 rounded shadow-md'>
                        <h2 className='text-2xl font-semibold mb-6'>Connect With Us</h2>
                        <div className='flex items-center gap-6'>
                            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-3xl hover:text-primary-200 transition-colors'>
                                <FaFacebook />
                            </a>
                            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-3xl hover:text-primary-200 transition-colors'>
                                <FaInstagram />
                            </a>
                            <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='text-3xl hover:text-primary-200 transition-colors'>
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs; 