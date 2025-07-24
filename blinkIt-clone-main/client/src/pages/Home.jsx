import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import BannerSlider from '../components/BannerSlider'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()
  const [priceRange, setPriceRange] = useState([0, 70000]) // [min, max]

  const handleRedirectProductListpage = (id, cat) => {
    console.log('Redirecting to category:', { id, cat })
    const url = `/category/${id}`;
    console.log('Generated URL:', url)
    navigate(url);
  }

  const handleSliderChange = (value) => {
    setPriceRange(value)
  }

  return (
    <section className='container mx-auto px-4 py-8'>
      <BannerSlider />

      {/* Price Filter Section */}
      <div className='bg-white shadow-md p-4 rounded-lg mb-8'>
        <div className='flex flex-col items-center'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>Price Range</h2>
          <div className='w-full max-w-md flex flex-col items-center'>
            <Slider
              range
              min={0}
              max={70000}
              value={priceRange}
              onChange={handleSliderChange}
              allowCross={false}
              trackStyle={[{ backgroundColor: '#ff69b4' }]}
              handleStyle={[
                { borderColor: '#ff69b4', backgroundColor: '#fff' },
                { borderColor: '#ff69b4', backgroundColor: '#fff' }
              ]}
            />
            <div className='flex justify-between w-full mt-2'>
              <span className='font-semibold text-pink-600'>{priceRange[0]}</span>
              <span className='font-semibold text-pink-600'>{priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Shop by Category</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {loadingCategory ? (
            // Loading state
            <div>Loading categories...</div>
          ) : (
            categoryData.map((cat,index)=>{
              return(
                <div 
                  key={cat._id+"displayCategory"} 
                  className='bg-white rounded-xl p-4 min-h-[220px] w-[220px] flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group'
                  onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                >
                  <div className='flex-1 flex items-center justify-center w-full mb-4'>
                    <img 
                      src={cat.image}
                      alt={cat.name}
                      className='h-28 w-28 object-contain group-hover:opacity-80 transition-opacity duration-300'
                    />
                  </div>
                  <h3 className='text-center text-base font-medium text-gray-700 group-hover:text-primary-600 transition-colors duration-300 mt-2'>
                    {cat.name}
                  </h3>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Category-wise Products Section */}
      <div className='space-y-8'>
        {
          categoryData?.map((c,index)=>{
            return(
              <CategoryWiseProductDisplay 
                key={c?._id+"CategorywiseProduct"} 
                id={c?._id} 
                name={c?.name}
                priceRange={{ min: priceRange[0], max: priceRange[1] }}
              />
            )
          })
        }
      </div>
    </section>
  )
}

export default Home
