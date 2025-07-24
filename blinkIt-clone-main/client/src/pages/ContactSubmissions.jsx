import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import NoData from '../components/NoData';
import AdminPermision from '../layouts/AdminPermision';
import SummaryApi from '../common/SummaryApi';

const ContactSubmissionsContent = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchContacts = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getContacts
            });

            if (response.data.success) {
                setContacts(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching contact submissions');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateContactStatus,
                url: SummaryApi.updateContactStatus.url.replace(':id', id),
                data: { status: newStatus }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchContacts();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating status');
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Contact Submissions</h1>
            
            {contacts.length === 0 ? (
                <NoData />
            ) : (
                <div className="grid gap-4">
                    {contacts.map((contact) => (
                        <div key={contact._id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="font-semibold">{contact.subject}</h2>
                                    <p className="text-sm text-gray-600">From: {contact.name} ({contact.email})</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {formatDate(contact.createdAt)}
                                    </span>
                                    <select
                                        value={contact.status}
                                        onChange={(e) => updateStatus(contact._id, e.target.value)}
                                        className={`text-sm rounded px-2 py-1 border ${
                                            contact.status === 'pending' ? 'bg-yellow-100' :
                                            contact.status === 'responded' ? 'bg-blue-100' :
                                            'bg-green-100'
                                        }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="responded">Responded</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Wrap the component with AdminPermision
const ContactSubmissions = () => {
    return (
        <AdminPermision>
            <ContactSubmissionsContent />
        </AdminPermision>
    );
};

export default ContactSubmissions; 