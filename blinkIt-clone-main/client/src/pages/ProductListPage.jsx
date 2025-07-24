import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPage, setTotalPage] = useState(1)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const params = useParams()
  const navigate = useNavigate()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])

  // Get category and subcategory IDs from URL params
  const categoryId = params.categoryId
  const subCategoryId = params.subcategoryId

  console.log('URL Params:', { params, categoryId, subCategoryId })

  const fetchProductdata = async () => {
    if (!categoryId) {
      setError('Invalid category ID')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching products for category:', categoryId)
      
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: categoryId,
          page: page,
          limit: 8,
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined
        }
      })

      const { data: responseData } = response
      console.log('API Response:', responseData)

      if (responseData.success) {
        if (page === 1) {
          setData(responseData.data)
        } else {
          setData(prevData => [...prevData, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      } else {
        throw new Error(responseData.message || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error.message || 'Failed to load products')
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params, page, priceRange])

  useEffect(() => {
    if (!categoryId) return

    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id === categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory, categoryId])

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }))
    setPage(1) // Reset to first page when filter changes
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
        {/**sub category **/}
        {DisplaySubCatory.length > 0 && (
          <div className='min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
            {
              DisplaySubCatory.map((s, index) => {
                const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
                return (
                  <Link to={link} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                    hover:bg-green-100 cursor-pointer
                    ${subCategoryId === s._id ? "bg-green-100" : ""}
                  `}
                  >
                    <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border' >
                      <img
                        src={s.image}
                        alt='subCategory'
                        className='w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                      />
                    </div>
                    <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                  </Link>
                )
              })
            }
          </div>
        )}

        {/**Product **/}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-semibold'>{params.subcategoryName || params.categoryName}</h3>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    name='min'
                    placeholder='Min Price'
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    className='w-24 px-2 py-1 border rounded focus:outline-none focus:border-green-500'
                  />
                  <span>-</span>
                  <input
                    type='number'
                    name='max'
                    placeholder='Max Price'
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    className='w-24 px-2 py-1 border rounded focus:outline-none focus:border-green-500'
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            {loading && page === 1 ? (
              <div className="flex justify-center items-center min-h-[80vh]">
                <Loading />
              </div>
            ) : (
              <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4'>
                  {data.map((p, index) => (
                    <CardProduct
                      data={p}
                      key={p._id + "productSubCategory" + index}
                    />
                  ))}
                </div>
                {loading && page > 1 && (
                  <div className="flex justify-center p-4">
                    <Loading />
                  </div>
                )}
                {!loading && data.length === 0 && (
                  <div className="text-center p-8">
                    <p className="text-gray-600">No products found in this category</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
