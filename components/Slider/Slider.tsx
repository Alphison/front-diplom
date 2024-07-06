import { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import Image from "next/image";
import Model from "components/model/model";
import { Loader_model } from "components/model/Loader_model";

const slides = [
  {
    id: 1,
    img: "/images/slider_fon.jpg",
    name: "МОДЕЛИРОВАНИЕ",
    gif: "/images/gif.gif",
    gif2: "/images/kot_model.gif",
    text: "3D моделирование - это процесс создания трехмерных моделей объектов или сцен с помощью компьютерных программ. В основном, это используется в индустрии разработки игр, анимации, архитектурного проектирования, производства, инженерии и медицинском моделировании.",
    text2: "Программы для 3D моделирования обычно содержат широкий спектр инструментов для создания, редактирования и анимации трехмерных объектов. Они также позволяют работать с различными файловыми форматами для экспорта и импорта моделей. В топ 3 самых популярных программ входят AutoCAD, Blender и SketchUp."
  },
  {
    id: 2,
    img: "/images/slider_fon2.jpg",
    name: "СКУЛЬПТИНГ",
    gif: "/images/scul.gif",
    text: "Скульптинг в 3D - это процесс создания трехмерных моделей путем вырезания, деформации и обработки геометрических форм. Этот процесс позволяет художникам и дизайнерам создавать более детализированные и органичные модели, которые являются более реалистичными и естественными по сравнению с моделями, созданными с помощью традиционных методов моделирования."
  },
  {
    id: 3,
    img: "/images/godzila2.jpg",
    name: "АНИМАЦИЯ",
    text: "Анимация 3D моделей – это процесс создания движения и эффектов на 3D объектах при помощи специального компьютерного программного обеспечения. Такие модели могут быть использованы в различных сферах, включая компьютерные игры, кинематограф и рекламу. Визуально анимация 3D моделей предлагает сильный контраст в сравнении с обычной 2D анимацией, так как ее глубина и объемность делают ее значительно более реалистичной и зрелищной.",
    gif: "/images/anim.gif"
  },
];

function App() {
  const [cameraRotation, setCameraRotation] = useState(360);
  const [allSlide, setAllSlide] = useState(0);
  const [disabledNext, setDisabledNext] = useState(false);
  const [disabledPrev, setDisabledPrev] = useState(false);
  const [active, setActive] = useState(0);

  const handleClickNext = () => {
    const setAllSlideTime = () => {
      setAllSlide((prev) => {
        if (prev !== -100) {
          return prev - 50;
        } else {
          return prev;
        }
      });
    }

    setTimeout(setAllSlideTime, 1000)

    switch (allSlide) {
      case 0:
        setActive(0);
      case (-50):
        setActive(prev => prev + 1);
          break
      case (-100):
        setActive(prev => prev + 1);
          break
    }
  };

  const handleClickPrev = () => {
    const setAllSlideTime = () => {
      setAllSlide((prev) => {
        if (prev !== 0) {
          return prev + 50;
        } else {
          return prev;
        }
      });
    }

    setTimeout(setAllSlideTime, 1000)
    
    switch (allSlide) {
      case 0:
        setActive(0);
      case (-50):
        setActive(prev => prev - 1);
          break
      case (-100):
        setActive(prev => prev - 1);
          break
    }
  };

  useEffect(() => {
    if (allSlide === -100) {
      setDisabledNext(true);
    } else {
      setDisabledNext(false);
    }
    if (allSlide === 0) {
      setDisabledPrev(true);
    } else {
      setDisabledPrev(false);
    }
  }, [allSlide]);

  return (
    <div className="App" id="page-wrap">
      <div className="window">
        <div
          className="all_slide"
          style={{
            transform: `translateX(${allSlide}%) scale(0.5)`,
            // gap: `${gap}%`
          }}
        >
          {slides.map((item, i) => {
            return (
              <div key={i} className={active === i ? "slide active" : "slide"}>
                <div style={{  background: 'black', opacity: '0.4', width: '100%', height: '100%', position: 'absolute'}}></div>
                <Image src={item.img} width={1920} height={1080} alt=""/>
                <div className="content-slide">
                  <div className="col-content-slide">
                      <h2 className="subname-slide">
                        Чему можно научиться в нашей школе
                      </h2>
                      <h1 className="slide-name">{item.name}</h1>
                      <div className={ i === 1 ? "info-slide2" : i === 2 ? 'info-slide3' : 'info-slide'}>
                        <div className="col-info-slide">
                          <div className="block-info">
                            <p className="text-block-info">{item.text}</p>
                          </div>
                          <div className={i === 0 ? "block-gif" : "block-gif2"}>
                            <Image src={item.gif} width={331} height={183} alt="" />
                          </div>
                        </div>
                        {
                          i === 0 ? (
                            <div className="col-info-slide">
                              <div className="block-gif">
                                <Image width={299} height={183} src={item.gif2 || ''} alt="" />
                              </div>
                              <div className="block-info">
                                <p className="text-block-info">{item.text2}</p>
                              </div>
                            </div>
                          ): null
                        }
                      </div>
                  </div>
                  <div className="col-content-slide">
                    <div className="blur-model"></div>
                    {
                      i === 0 && <Model model={'earth_low_poly.glb'} scale={20} position={[0, 0, 0]}/>
                    }
                    {
                      i === 1 && <Model model={'head.glb'} scale={15} position={[0, 199, 0]}/>
                    }
                    {
                      i === 2 && <Model model={'scene.gltf'} scale={15} position={[0, -170, 0]}/>
                    }
                    <div className="circle-model"></div>
                    <div className="circle-model2"></div>
                    <h2 className="inner-block-circle">{cameraRotation}°</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="arrows">
          <div className="ikons_slider">
            <a href="#" className="ikon-slider"><Image src="/images/twitter.png" width={35} height={35} alt="twiiter"/></a>
            <a href="#" className="ikon-slider"><Image src="/images/inst.png" width={35} height={35} alt="inst"/></a>
            <a href="#" className="ikon-slider"><Image src="/images/Facebook.png" width={35} height={35} alt="Facebook"/></a>
          </div>
          <div className="buttons_slider">
            <button
              className="arrow"
              disabled={disabledPrev}
              onClick={() => handleClickPrev()}
            >
              <AiOutlineArrowLeft />
            </button>
            <button
              className="arrow"
              disabled={disabledNext}
              onClick={() => handleClickNext()}
            >
              <AiOutlineArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
