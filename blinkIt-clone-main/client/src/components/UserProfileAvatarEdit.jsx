import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';

const UserProfileAvatarEdit = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleUploadAvatarImage = async(e) => {
        const file = e.target.files[0]

        if(!file){
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                dispatch(updatedAvatar(response.data.data.avatar))
                toast.success('Profile picture updated successfully')
                close()
            } else {
                toast.error(response.data.message || 'Failed to update profile picture')
            }

        } catch (error) {
            console.error('Avatar upload error:', error)
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center'>
            <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
                <button onClick={close} className='text-neutral-800 w-fit block ml-auto'>
                    <IoClose size={20}/>
                </button>
                <div className='w-32 h-32 rounded-full overflow-hidden relative'>
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className='w-full h-full object-cover'/>
                    ) : (
                        <FaRegUserCircle className='w-full h-full text-neutral-400'/>
                    )}
                </div>
                <form onSubmit={handleSubmit} className='w-full'>
                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor='uploadProfile' className='self-center'>
                            <span className='bg-green-800 text-white px-4 py-2 rounded cursor-pointer'>
                                {loading ? 'Uploading...' : 'Upload New Picture'}
                            </span>
                        </label>
                        <input 
                            onChange={handleUploadAvatarImage} 
                            type='file' 
                            id='uploadProfile' 
                            className='hidden'
                            accept='image/*'
                        />
                    </div>
                </form>
            </div>
        </section>
    )
}

export default UserProfileAvatarEdit
