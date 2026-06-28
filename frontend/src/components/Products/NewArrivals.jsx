import React, { use, useEffect, useRef, useState } from 'react'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import axios from "axios";

const NewArrivals = () => {
    const scrollRef=useRef(null);
    const [listDragging,setIsDragging,isDragging]=useState(false);
    const [startX,setStartX]=useState(0);
    const {scrollLeft,setScrollLeft}=useState(false);
    const [canscrollLeft,setCanScrollLeft]=useState(false);
    const [canscrollRight,setCanScrollRight]=useState(true);

    const[newArrivals,setNewArrivals]=useState([]);
    useEffect(() => {
  const fetchNewArrivals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
      );

      setNewArrivals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchNewArrivals();
}, []);
 const handleMouseDown=(e)=>{
    setIsDragging(true);
    setStartX(e.pageX-scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);

 };
const handleMouseMove =(e)=>{
    if(!isDragging) return;
    const x=e.pageX-scrollRef.current.offsetLeft;
    const walk=x-startX;
    scrollRef.current.scrollLeft=scrollLeft-walk;

}
const handleMouseUpOrLeave=()=>{
    setIsDragging(false);

}
    const scroll=(direction)=>{
        const scrollAmount=direction=="left"?-300:300;
        scrollRef.current.scrollBy({left:scrollAmount, behaviour:"smooth"})
    }
    useEffect(()=>{
        const updateScrollButtons=()=>{
            const container=scrollRef.current;
            if(container){
                const leftscroll=container.scrollLeft;
                const rightScrollable=container.scrollWidth>leftscroll+container.clientWidth;
                setCanScrollLeft(leftscroll>0);
                setCanScrollRight(rightScrollable);
            }
            console.log({
                scrollLeft:container.scrollLeft,
                clientWidth:container.clientWidth,
                containerScrollWidth:container.scrollWidth,
                offsetLeft:scrollRef.current.offsetLeft,
            });
        };
        const container=scrollRef.current;
        if(container){
            container.addEventListener("scroll",updateScrollButtons);
            updateScrollButtons();
            return ()=> container.removeEventListener("scroll",updateScrollButtons);
        }
    },[newArrivals])
  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto text-center mb-10 relative'>
            <h2 className='text-3xl font-bold mb-4'>
                Explore New Arrivals
            </h2>
            <p className='text-lg text-gray-600 mb-8'>
                Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
            </p>
            {/* Scroll Bar */}
            <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
                <button  onClick={()=>scroll("left")}
                disabled={!canscrollLeft}
                className={`p-2 rounded border ${canscrollLeft ? "bg-white text-black":"bg-gray-200 text-gray-400 cursor-not-allowed"}`
                }>
                    <FaCircleChevronLeft className='text-2xl'/>
                </button>
                  <button onClick={()=>scroll("right")}
                  className={`p-2 rounded border ${canscrollRight ? "bg-white text-black":"bg-gray-200 text-gray-400 cursor-not-allowed"}`
                  }>
                    <FaCircleChevronRight className='text-2xl'/>
                </button>
            </div>
        </div>
        {/* Scrollable content */}
        <div ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
         className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
            {newArrivals.map((product)=>(
                <div key={product._id} className='min-w-[100%] sm:min-w-[50%] lg:min-w[30%] relative'>
                    <img src={product.images[0]?.url}
                    alt={product.images[0]?.allText|| product.name}
                     className='w-full h-[500px] object-cover rounded'
                     draggable="false"
                     
                     />
                    <div className='absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded b-lg'>
                        <Link to={'/product/${product._id}'} className='block'>
                        <h4 className='font-medium'>{product.name}</h4>
                        <p className='ml-1'>${product.price}</p>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}

export default NewArrivals