import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const ChangePassword = ({ close }) => {
    const [data, setData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New password and confirm password must be same")
            return
        }

        if (data.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: {
                    currentPassword: data.currentPassword,
                    password: data.newPassword
                }
            })

            if (response.data.success) {
                toast.success("Password updated successfully")
                close()
                setData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            } else {
                toast.error(response.data.message || "Failed to update password")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center'>
            <div className='bg-white max-w-sm w-full rounded p-4'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-semibold'>Change Password</h2>
                    <button onClick={close} className='text-neutral-800'>
                        <FaRegEye size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='grid gap-4'>
                    <div className='grid gap-1'>
                        <label>Current Password</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                className='w-full outline-none'
                                name='currentPassword'
                                value={data.currentPassword}
                                onChange={handleChange}
                                placeholder='Enter current password'
                                required
                            />
                            <div onClick={() => setShowCurrentPassword(prev => !prev)} className='cursor-pointer'>
                                {showCurrentPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label>New Password</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className='w-full outline-none'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter new password'
                                required
                            />
                            <div onClick={() => setShowNewPassword(prev => !prev)} className='cursor-pointer'>
                                {showNewPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label>Confirm New Password</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className='w-full outline-none'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Confirm new password'
                                required
                            />
                            <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer'>
                                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='bg-green-800 text-white py-2 rounded hover:bg-green-700 transition-all'
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default ChangePassword 