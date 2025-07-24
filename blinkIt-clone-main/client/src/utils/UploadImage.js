import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const uploadImage = async(image)=>{
    try {
        if (!image) {
            toast.error('No image file provided')
            throw new Error('No image file provided')
        }

        const formData = new FormData()
        formData.append('image', image)

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        if (!response?.data?.success) {
            toast.error(response?.data?.message || 'Failed to upload image')
            throw new Error(response?.data?.message || 'Failed to upload image')
        }

        return response
    } catch (error) {
        console.error('Upload error:', error)
        toast.error(error.response?.data?.message || 'Failed to upload image')
        throw error
    }
}

export default uploadImage