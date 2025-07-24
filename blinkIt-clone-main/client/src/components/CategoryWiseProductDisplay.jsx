import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name, priceRange }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id,
                    minPrice: priceRange?.min ? parseFloat(priceRange.min) : undefined,
                    maxPrice: priceRange?.max ? parseFloat(priceRange.max) : undefined
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [id, priceRange])

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })
            return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`
        return url
    }

    const redirectURL = handleRedirectProductListpage()

    return (
        <div className='bg-gray-50 py-8'>
            <div className='container mx-auto px-4'>
                <div className='mb-6'>
                    <h3 className='text-2xl font-bold text-gray-800'>{name}</h3>
                </div>
                
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                    {loading &&
                        loadingCardNumber.map((_, index) => (
                            <CardLoading key={"CategorywiseProductDisplay123" + index} />
                        ))
                    }
                    {data.slice(0, 6).map((p, index) => (
                        <CardProduct
                            data={p}
                            key={p._id + "CategorywiseProductDisplay" + index}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
