import React from 'react'
import { FaMeta } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";

const Topbar = () => {
  return (
    <div  className="bg-rabbit-red text-white">
   <div className="container mx-auto flex justify-between items-center py-3 px-4">
    <div className="hidden md:flex items-center space-x-4">
        <a href="#" className="hover:text-gray-300">
            <FaMeta className="h-5 w-5" />
        </a>
        <a href="#" className="hover:text-gray-300">
            <RiInstagramFill className="h-5 w-5" />
        </a>
        <a href="#" className="hover:text-gray-300">
            <FaXTwitter className="h-5 w-5" />
        </a>
    </div>
   
   <div  className="text-sm text-center flex-grow">
    <span>We ship worldwide - Fast and reliable shipping</span>
   </div>
   <div className="text-sm hidden md:block">
    <a href="tel:+917780364682" className="hover:text-gray-300">
        +91 (778) 036-4682
    </a>
   </div>
    </div>
    </div>
  )
}

export default Topbar