import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const MIN_SEARCH_LENGTH = 2; // Minimum characters required for search

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  const fetchData = async() => {
    try {
      setLoading(true)
      setError(null)
      
      // Handle empty or too short search text
      if (!searchText?.trim()) {
        setData([])
        setTotalPage(1)
        setError(null)
        return
      }

      if (searchText.trim().length < MIN_SEARCH_LENGTH) {
        setData([])
        setTotalPage(1)
        setError(`Please enter at least ${MIN_SEARCH_LENGTH} characters to search`)
        return
      }

      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText.trim(),
          page: page,
          limit: 10
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData((prev) => [...prev, ...responseData.data])
        }
        setTotalPage(responseData.totalPage)
        setError(null)
      } else {
        setError(responseData.message || 'Failed to fetch search results')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search products. Please try again.')
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1) // Reset page when search text changes
    fetchData()
  }, [searchText])

  useEffect(() => {
    if (page > 1) {
      fetchData()
    }
  }, [page])

  const handleFetchMore = () => {
    if (totalPage > page && !loading) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search Results: {data.length}</p>

        {error && (
          <div className='text-red-500 text-center my-4'>
            {error}
          </div>
        )}

        {!error && (
          <InfiniteScroll
            dataLength={data.length}
            hasMore={totalPage > page}
            next={handleFetchMore}
            loader={<div className='text-center'>Loading...</div>}
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
              {data.map((p, index) => (
                <CardProduct 
                  data={p} 
                  key={p?._id + "searchProduct" + index}
                />
              ))}

              {loading && (
                loadingArrayCard.map((_, index) => (
                  <CardLoading key={"loadingsearchpage" + index}/>
                ))
              )}
            </div>
          </InfiniteScroll>
        )}

        {!data[0] && !loading && !error && (
          <div className='flex flex-col justify-center items-center w-full mx-auto'>
            <img
              src={noDataImage} 
              className='w-full h-full max-w-xs max-h-xs block'
              alt="No results found"
            />
            <p className='font-semibold my-2'>No Data found</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchPage
