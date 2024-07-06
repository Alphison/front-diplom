"use client"

import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import Slider from "components/Slider/Slider";
import {useEffect} from 'react'
import { useCourses } from "store/useCourses";


const Page = () => {
    return (
        <>
           <Slider />
        </>
    )
}

export default Page