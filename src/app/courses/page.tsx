"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Loader from "../../../public/loader/Loader";
import { useCategory, useCourses } from "store/useCourses";
import { motion } from "framer-motion";
import { variantsCategory, variantsCourses } from "animation/animation";

const Courses = () => {
  const router = useRouter();

  const { loading, error, fetchCourses, courses } = useCourses((state) => ({
    loading: state.loading,
    error: state.error,
    fetchCourses: state.fetchCourses,
    courses: state.courses
  }));

  const {
    categories,
    loading: Loading,
    error: Error,
    fetchCategory,
  } = useCategory((state) => ({
    loading: state.loading,
    categories: state.categories,
    error: state.error,
    fetchCategory: state.fetchCategory,
  }));

  const [catId, setCatId] = useState(0);

  const usersData = catId === 0 ? courses
   : courses?.filter(item => item.category_id === catId)

  useEffect(() => {
    fetchCourses();
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countCourse = courses?.length;

  const handleCategoryClick = (id:number) => {
    setCatId(id);
  };
  const handleAllCoursesClick = (id: number) => {
    setCatId(id);
  };

  if(loading){
    return (
        <div className="loader-wrapper">
            <Loader />
        </div>
    )
  }

  return (
    <div className="courses" id="page-wrap">
      <h1 className="zag h1__courses">Наши курсы</h1>
      <div className="row__courses">
        <div className="category category__courses">
          <button
            className={catId === 0 ? "cat-el active" : "cat-el"}
            onClick={() => handleAllCoursesClick(0)}
          >
            Все курсы
          </button>
          {
            categories.map((cat, i) => {
              return (
                <motion.button
                  key={cat.id}
                  variants={variantsCategory}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className={catId === cat.id ? "cat-el active" : "cat-el"}
                  onClick={() => handleCategoryClick(cat.id!)}
                >
                  {cat.name}
                </motion.button>
              );
            }
          )}
        </div>
        <motion.p
          key={1}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="count-courses"
        >
          Всего курсов: {countCourse}
        </motion.p>
      </div>
      <div className="courses__block">
        {
          usersData?.map((course, i) => {
            const src = `${process.env.NEXT_PUBLIC_API}storage/${course?.img_course}` 
            const cat = categories?.find(category => category.id === course.category_id)
            return (
              <motion.div
                animate="visible"
                variants={variantsCourses}
                initial={"hidden"}
                custom={i}
                className="block-course"
                key={course.id}
              >
                <div className="img_block-course">
                  <Image
                    loader={() => src}
                    src={src}
                    alt=""
                    width={635}
                    height={365}
                  />
                </div>
                <div className="content_block-course">
                  <div className="name-course">{course.name}</div>
                  <p className="text-course">{course.description}</p>
                  <div className="row-course-block">
                    <p className="category-name">{cat?.name}</p>
                    <button
                      onClick={() => router.push(`/course/${course.id}`)}
                      className="more-course"
                    >
                      <Image
                        src="/images/arrowCourse.png"
                        width={8}
                        height={13}
                        alt="arrow"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Courses;
