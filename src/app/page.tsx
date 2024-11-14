
"use client";
import React from 'react'
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { GrFacebookOption } from "react-icons/gr";
import { RiTwitterXLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IoStarSharp } from "react-icons/io5";
import Slider from 'react-slick';
import { Arrow } from '@radix-ui/react-popover';
import Link from 'next/link';


const headingTitles = [
  {
    title: "Simplifica el acceso a través de QR",
    name: "Pagos en tiempo real",
    desc: "Recibe pagos instantáneos con conciliación bancaria automática."
  },
  {
    title: "Gestiona areas comunes",
    name: "Pagos en tiempo real",
    desc: "Recibe pagos instantáneos con conciliación bancaria automática."
  },
  {
    title: "Cobra tarifas de mantenimiento",
    name: "Pagos en tiempo real",
    desc: "Recibe pagos instantáneos con conciliación bancaria automática."
  },
  {
    title: "Facilita toma de desiciones",
    name: "Pagos en tiempo real",
    desc: "Recibe pagos instantáneos con conciliación bancaria automática."
  },
  {
    title: "Genera y exporta reportes",
    name: "Pagos en tiempo real",
    desc: "Recibe pagos instantáneos con conciliación bancaria automática.Recibe pagos instantáneos con conciliación bancaria automática.Recibe pagos instantáneos con conciliación bancaria automática.Recibe pagos instantáneos con conciliación bancaria automática."
  },
]

const TestimonialsSection = () => {
  const sliderRef: any = React.useRef(null);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,           // Slider automatically chalega
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // For tablet
        settings: {
          slidesToShow: 2,
          autoplay: true,           // Slider automatically chalega
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 640, // For mobile
        settings: {
          slidesToShow: 1,
          autoplay: true,           // Slider automatically chalega
          autoplaySpeed: 3000,
        },
      },
    ],
  };


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpen1, setIsMenuOpen1] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Create an array to manage the open state of each accordion section
  const [openSections, setOpenSections] = useState(Array(6).fill(false));

  // Toggle a specific section open/closed
  const toggleSection = (index: any) => {
    setOpenSections((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };


  const [isMonthly, setIsMonthly] = useState(true); // Track if the monthly option is selected

  const handlePricingToggle = (isMonthlySelected: any) => {
    setIsMonthly(isMonthlySelected);
  };



  return (
    <div>

      {/* Header Section Start */}
      <header>
        <nav className="bg-[#E9EEF4] border-gray-200 px-4 lg:px-20 py-4 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto">
            <a href="#inicio" className="flex items-center">
              <img className="h-8 md:h-10" src="/images/header-icon.png" alt="Header Icon" />
            </a>
            <div className="flex items-center lg:order-2">
              <Link
                href="/auth/login"
                className="hidden lg:flex items-center text-white dark:text-white bg-black hover:bg-slate-700 font-medium rounded-full text-base px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Administrator Login
                <span className="flex items-center justify-center bg-white text-xs text-black rounded-full p-1 ml-2">
                  <FaArrowRight />
                </span>
              </Link>
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:text-gray-6  00 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`w-6 h-6 ${isMenuOpen ? "hidden" : "block"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <svg
                  className={`w-6 h-6 ${isMenuOpen ? "block" : "hidden"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              className={`${isMenuOpen ? "flex" : "hidden"
                } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-semibold lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <a
                    href="#inicio"
                    className="block py-2 pr-4 pl-3 text-slate-500 lg:bg-transparent lg:p-0 dark:text-white"
                    aria-current="page"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#nosotros"
                    className="block py-2 pr-4 pl-3 text-slate-500  hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#soluciones"
                    className="flex items-center justify-between py-2 pr-4 pl-3 text-slate-500  hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Soluciones
                    <span className='text-2xl'>
                      <RiArrowDropDownLine className="" />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#funciones"
                    className="block py-2 pr-4 pl-3 text-slate-500  hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Funciones
                  </a>
                </li>
                <li>
                  <a
                    href="#contacto"
                    className="block py-2 pr-4 pl-3 text-slate-500  hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Contacto
                  </a>
                </li>
                <a
                  href="#"
                  className="flex lg:hidden items-center text-white dark:text-white bg-black hover:bg-slate-700 font-medium rounded-full text-base px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >
                  Administrator Login
                  <span className="flex items-center justify-center bg-white text-xs text-black rounded-full p-1 ml-2">
                    <FaArrowRight />
                  </span>
                </a>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {/* Header Section End */}


      {/* HomePage Section-1 Start */}
      <div
      id='inicio'
        className="pt-2 h-[650px] md:h-[500px] lg:h-[800px] md:pt-8 lg:pt-20 grid grid-cols-1 md:grid-cols-2 pl-4 lg:pl-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-img.png')",
          backgroundPosition: 'bottom center', // Adjust the background image position
          backgroundSize: 'cover', // Ensure the image covers the container
        }}
      >
        <div>
          <div className='lg:pt-6'>
            <h2 className='text-2xl md:text-3xl lg:text-5xl text-black font-bold'>Gestión de condominios</h2>
            <h2 className='text-2xl md:text-3xl lg:text-5xl text-black font-bold'>sin esfuerzos con Aqcess</h2>
            <p className='text-slate-600 font-semibold text-xs md:text-base lg:text-lg pt-5'>Administra el acceso, pagos y las amenidades de tu</p>
            <p className='text-slate-600 font-semibold text-xs md:text-base lg::text-lg pt-1'>residencial desde una sola plataforma.</p>
            <div className='pt-5 lg:pt-8'>
              <button
                className="flex items-center text-white dark:text-white bg-[#41A4FF] hover:bg-[#41a3ffe1] font-medium rounded-full text-sm md:text-base px-4 lg:px-5 py-2 lg:py-3 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Solicita una Demo
                <span className="flex items-center justify-center bg-white text-xs text-[#41A4FF] rounded-full p-1 ml-2">
                  <FaArrowRight />
                </span>
              </button>
            </div>
          </div>
          <div className='flex flex-wrap justify-between md:justify-start space-x-0 md:space-x-10 pt-6 lg:pt-10 pr-4'>
            <div className='mt-2 md:mt-0'>
              <h2 className='text-2xl md:text-3xl lg:text-4xl text-black font-bold'>1.5k+</h2>
              <p className='pt-3 text-xs lg:text-base text-black font-medium leading-none'>Residentes</p>
              <p className='text-xs lg:text-base leading-none text-black font-medium'>satisfechos</p>
            </div>
            <div className='mt-2 md:mt-0'>
              <h2 className='text-2xl md:text-3xl lg:text-4xl text-black font-bold'>130k+</h2>
              <p className='pt-3 text-xs lg:text-base text-black font-medium leading-none'>Reservaciones sin</p>
              <p className='leading-none text-xs lg:text-base text-black font-medium'>conflictos</p>
            </div>
            <div className='mt-2 md:mt-0'>
              <h2 className='text-2xl md:text-3xl lg:text-4xl text-black font-bold'>33%</h2>
              <p className='pt-3 text-xs lg:text-base text-black font-medium leading-none'>De incremento en</p>
              <p className='leading-none text-xs lg:text-base text-black font-medium'>recaudación de pagos</p>
            </div>
          </div>
        </div>
        <div className='pt-0 md:pt-0'>
          <div>
            <img className="" src="/images/Macbook.png" alt="HomePage Img" />
          </div>
        </div>
      </div>
      {/* HomePage Section-1 End */}


      {/* HomePage Section-2 Start */}
      <div id='nosotros' className='pt-6 md:pt-8 lg:pt-10 px-4 lg:px-20'>
        <div className='flex justify-center'>
          <h2 className='text-lg md:text-xl lg:text-2xl font-medium text-black'>Con la confianza de más de 200 residenciales en México y España</h2>
        </div>
        <div className='flex flex-wrap justify-between pt-4 md:pt-10'>
          <div>
            <img className="h-6 lg:h-8 mt-4 lg:mt-0" src="/images/hubspot.png" alt="HomePage Img" />
          </div>
          <div>
            <img className="h-6 lg:h-8 mt-4 lg:mt-0" src="/images/pendo.png" alt="HomePage Img" />
          </div>
          <div>
            <img className="h-6 lg:h-8 mt-4 lg:mt-0" src="/images/gitlab.png" alt="HomePage Img" />
          </div>
          <div>
            <img className="h-6 lg:h-8 mt-4 lg:mt-0" src="/images/memberstack.png" alt="HomePage Img" />
          </div>
          <div>
            <img className="h-6 lg:h-8 mt-4 lg:mt-0" src="/images/bitbucket.png" alt="HomePage Img" />
          </div>
        </div>
      </div>
      {/* HomePage Section-2 End */}

      {/* HomePage Section-3 Start */}
      <div id='' className="pt-20 px-4 lg:px-20">
        <div className='flex justify-between'>
          <div>
            <h2 className='text-sm md:text-3xl lg:text-4xl text-black font-bold'>Explora nuestras funciones y </h2>
            <h2 className='text-sm md:text-3xl lg:text-4xl text-black font-bold'>planes de precios</h2>
          </div>
          <div>
            <div className='flex space-x-2 md:space-x-4 border border-slate-300 p-1 rounded-full'>
              <button
                onClick={() => handlePricingToggle(true)}
                className={`text-sm md:text-base rounded-full p-2 font-medium px-2 md:px-3 ${isMonthly ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
              >
                Mensual
              </button>
              <button
                onClick={() => handlePricingToggle(false)}
                className={`text-sm md:text-base rounded-full p-2 font-medium px-2 md:px-3 ${!isMonthly ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
              >
                Anual
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap pt-8 pb-5'>
          {/* Monthly or Annual Plans based on the selection */}
          <div className='w-full md:w-1/2'>
            <div className=''>
              <div className='px-6 pt-6 pb-4 border border-slate-300 rounded-xl'>
                <div className='flex justify-between'>
                  <div>
                    <img className="h-10" src="/images/card-icon.png" alt="card Img" />
                  </div>
                  <div>
                    <h2 className='text-3xl text-black font-bold'>{isMonthly ? '$4,500' : '$45,000'}</h2>
                    <p className='text-slate-500 pt-2 text-end'>{isMonthly ? 'MXN/month' : 'MXN/year'}</p>
                  </div>
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-black'>Standard Plan</h2>
                  <p className='text-black pt-3 font-medium'>Incluye todas las funciones menos pagos de mantenimiento</p>
                  <p className='text-black font-medium leading-none'>mantenimiento</p>
                </div>
              </div>
              <div className='mt-6 md:mt-3.5 lg:mt-5 px-6 py-6 bg-black rounded-xl'>
                <div className='flex justify-between'>
                  <div>
                    <img className="h-10" src="/images/card-icon-2.png" alt="card Img" />
                  </div>
                  <div>
                    <h2 className='text-3xl text-white font-bold'>{isMonthly ? '$6,500' : '$65,000'}</h2>
                    <p className='text-slate-400 pt-2 text-end'>{isMonthly ? 'MXN/month' : 'MXN/year'}</p>
                  </div>
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-white'>Premium Plan</h2>
                  <p className='text-white pt-3 font-medium'>Incluye todas las funciones</p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full md:w-1/2 pl-0 md:pl-4 relative'>
            <div className='mt-6 md:mt-0 border border-slate-300 p-5 lg:p-5 rounded-xl'>
              {/* Positioned image */}
              <div className='absolute top-4.5 -right-1.5 md:-top-2 md:-right-2'>
                <img className="h-[7rem] md:h-[9rem]" src="/images/popular.png" alt="popular Icon" />
              </div>
              <div>
                <h2 className='text-3xl font-bold text-black'>Plan Premium </h2>
              </div>
              <div className='pt-6 space-y-4'>
                <div className='flex items-center'>
                  <span className="flex items-center justify-center bg-[#FC7100] text-xs text-white rounded-full p-1 h-5 w-5">
                    <FaCheck />
                  </span>
                  <p className='pl-3 text-black font-medium'>Acceso controlado con QR</p>
                </div>
                <div className='flex items-center'>
                  <span className="flex items-center justify-center bg-[#FC7100] text-xs text-white rounded-full p-1 h-5 w-5">
                    <FaCheck />
                  </span>
                  <p className='pl-3 text-black font-medium'>Pagos de servicios en tiempo real</p>
                </div>
                <div className='flex items-center'>
                  <span className="flex items-center justify-center bg-[#FC7100] text-xs text-white rounded-full p-1 h-5 w-5">
                    <FaCheck />
                  </span>
                  <p className='pl-3 text-black font-medium'>Gestión de amenidades</p>
                </div>
                <div className='flex items-center'>
                  <span className="flex items-center justify-center bg-[#FC7100] text-xs text-white rounded-full p-1 h-5 w-5">
                    <FaCheck />
                  </span>
                  <p className='pl-3 text-black font-medium'>Recaudación de pagos de mantenimiento</p>
                </div>
                <div className='flex items-center'>
                  <span className="flex items-center justify-center bg-[#FC7100] text-xs text-white rounded-full p-1 h-5 w-5">
                    <FaCheck />
                  </span>
                  <p className='pl-3 text-black font-medium'>Encuestas para satisfacción y toma de desiciones</p>
                </div>
                <div className='flex items-center'>
                  <span className="flex items-center justify-center bg-[#FC7100] text-xs text-white rounded-full p-1 h-5 w-5">
                    <FaCheck />
                  </span>
                  <p className='pl-3 text-black font-medium'>Exporta reportes de actividad</p>
                </div>
              </div>
              <button
                // href="#"
                className="flex justify-center items-center w-full mt-6 text-white dark:text-white bg-black hover:bg-slate-700 font-medium rounded-full text-base px-4 lg:px-5 py-2 lg:py-3 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Elegir Plan
                <span className="flex items-center justify-center bg-white text-xs text-black rounded-full p-1 ml-2 h-6 w-6">
                  <FaArrowRight />
                </span>
              </button>

            </div>
          </div>
        </div>
      </div>
      {/* HomePage Section-3 End */}


      {/* HomePage Section-4 Start */}
      <div id='' className='px-4 lg:px-20 pt-10 lg:pt-20'>
        <div className='bg-[#E9EEF4] rounded-xl'>
          <div className='w-full flex flex-col md:flex-row'>
            <div className='w-full md:w-2/3'>
              <div className='py-8 lg:py-16 pl-6'>
                <h2 className='text-3xl md:text-3xl lg:text-4xl text-black font-bold'>¡Descarga la app para residentes hoy!</h2>
                <p className='pt-5 text-sm md:text-base font-medium text-black'>Crea y comparte invitaciones QR, reserva amenidades, paga servicios y mantenimiento, encuentra negocios cercanos y más.</p>
                <div className='flex space-x-3 pt-10'>
                  <a
                    href="#"
                    className="flex items-center bg-black text-white font-medium rounded-full px-2 md:px-4 py-2 space-x-1 hover:bg-gray-800 transition"
                  >
                    <img src="/images/playstore.png" alt="Play Store" className="h-6 w-6" />
                    <div className="flex flex-col items-start leading-none">
                      <p className="text-[0.65rem]">GET IT ON</p>
                      <p className="text-base font-medium">Google Play</p>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center bg-black text-white font-medium rounded-full px-2 md:px-4 py-2 space-x-1 hover:bg-gray-800 transition"
                  >
                    <img src="/images/apple.png" alt="Play Store" className="h-8 w-8 filter invert" />
                    <div className="flex flex-col items-start leading-none">
                      <p className="text-[0.65rem]">Donwload on the</p>
                      <p className="text-lg font-medium">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/3'>
              <img src="/images/mobile-img.png" alt="Mobile.." className="" />
            </div>
          </div>
        </div>
      </div>
      {/* HomePage Section-4 End */}


      {/* HomePage Section-5 Start */}
      <div id='funciones' className='px-4 lg:px-20 pt-10 md:pt-20'>
        <div className='flex flex-wrap justify-between'>
          <div>
            <h2 className='text-xl md:text-3xl lg:text-4xl text-black font-bold'>Funciones esenciales de nuesto sistema.</h2>
            {/* <h2 className='text-3xl md:text-3xl lg:text-4xl text-black font-bold leading-none'></h2> */}
          </div>
          <div className='flex items-center mt-4 md:mt-0'>
            <a
              href="#"
              className="flex items-center text-white dark:text-white bg-black hover:bg-slate-700 font-medium rounded-full text-base md:text-base px-2 md:px-4 lg:px-5 py-2 lg:py-3 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >
              Solicita una Demo
              <span className="flex items-center justify-center bg-white text-xs text-black rounded-full p-1 ml-2">
                <FaArrowRight />
              </span>
            </a>
          </div>
        </div>
        <div className='flex flex-wrap md:flex-nowrap gap-4 lg:gap-16 w-full pt-8'>
          <div className='w-full md:w-1/2'>
            <div className="mx-auto">
              <div className="divide-y divide-slate-100">
                {headingTitles.map((data, index) => (
                  <div className="group" key={index}>
                    <div
                      className="flex cursor-pointer list-none items-center justify-between py-4 text-lg md:text-xl lg:text-2xl font-medium text-black group-open:text-primary-500 border-t border-slate-300"
                      onClick={() => toggleSection(index)}
                    >
                      {data.title}
                      <div>
                        {/* Show plus icon if closed, minus icon if open */}
                        {openSections[index] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="block h-5 w-5 text-[#37A8F2]"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="block h-5 w-5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {openSections[index] && (
                      <div className="pb-4 text-black border-t border-[#37a7f2]">
                        <div className="flex justify-between pt-3">
                          <div>
                            <h2 className="text-[#37a7f2] text-2xl">{data.name}</h2>
                          </div>
                        </div>
                        <p className="pt-5">{data.desc}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>


            </div>
          </div>
          <div className='w-full md:w-1/2'>
            <div className="flex items-center">
              <img className="h-auto lg:h-[520px] w-full" src="/images/faq-section-img.png" alt="Header Icon" />
            </div>
          </div>
        </div>
      </div>
      {/* HomePage Section-5 End */}


      {/* HomePage Section-6 Start */}
      <div className="px-4 lg:px-20 pt-10 md:pt-20 pb-16">
        <div className="flex justify-between">
          <h2 className="text-base md:text-3xl lg:text-4xl text-black font-bold flex items-center">Opiniones de nuestros clientes</h2>
          <div className="flex space-x-2 md:space-x-4">
            <button
              onClick={() => sliderRef.current.slickPrev()}
              className="bg-slate-300 hover:bg-[#41A4FF] text-black hover:text-white p-4 md:p-3 rounded-full"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => sliderRef.current.slickNext()}
              className="bg-slate-300 hover:bg-[#41A4FF] text-black hover:text-white p-4 md:p-3 rounded-full"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="pt-6 md:pt-10 lg:pt-16">
          <Slider ref={sliderRef} {...settings} className="">
            {[1, 2, 3].map((_, index) => (
              <div className='P-2' key={index} >
                <div className="bg-white mt-8 md:mx-2 rounded-xl p-4 relative">
                  <div className="absolute top-[-25px] md:top-[-30px]">
                    <img className="h-12 md:h-14" src={`/images/Ellipse2.png`} alt="Card Icon" />
                  </div>
                  <p className="pt-5 text-black font-medium pb-12">
                    Recaudamos más pagos de mantenimiento desde que contratamos. Facilita mucho a los residentes pagar y
                    reservar las canchas y la piscina.
                  </p>
                  <div className="flex justify-between border-t border-slate-300 pt-3">
                    <div>
                      <h2 className="text-black font-bold">Residencial Cerro del Aguila</h2>
                      <div className="flex space-x-2 pt-2">
                        {[...Array(5)].map((_, starIndex) => (
                          <IoStarSharp key={starIndex} className="text-[#FFB800]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <img className="h-8 md:h-8" src="/images/quote.png" alt="quote Icon" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* HomePage Section-6 End */}


      {/* Footer Section Start */}
      <div id='contacto' className="bg-black">
        <div className="pt-10 md:pt-16 pb-8 pl-4 pr-4 lg:pl-20 lg:pr-40 grid grid-cols-1 md:grid-cols-4 mx-auto">
          <div className="pb-6">
            <a href="" className="flex items-center">
              <img className="h-8 lg:h-10" src="/images/footer-logo.png" alt="Header Icon" />
            </a>
          </div>
          <div className="">
            <div className="text-base lg:text-lg uppercase text-white font-bold pb-2">EMPRESA</div>
            <a className="my-4 block text-slate-300" href="/#">Inicio</a>
            <a className="my-4 block text-slate-300" href="/#">Nosotros</a>
            <a className="my-4 block text-slate-300" href="/#">Soluciones</a>
            <a className="my-4 block text-slate-300" href="/#">Funciones</a>
            <a className="my-4 block text-slate-300" href="/#">Precios</a>
            <a className="my-4 block text-slate-300" href="/#">Descarga la app</a>
          </div>
          <div className="">
            <div className="text-base lg:text-lg uppercase text-white font-bold">INFO DE CONTACTO</div>
            <a className="my-4 block text-slate-300" href="/#">
              Phone : <br />
              (442) 597 5953
            </a>
            <a className="my-4 block text-slate-300" href="/#">
              Email : <br />
              contacto@aqcess.com
            </a>
            <a className="my-4 block text-slate-300" href="/#">
              Address :   <br />
              Cerro el macho #124. Privada <br /> Juriquilla Querétaro. CP 76230
            </a>
          </div>
          <div className="">
            <div className="text-base lg:text-lg uppercase text-white font-bold">Newsletter</div>
            <a className="my-3 block text-slate-300 text-sm lg:text-base" href="/#">Suscribite a nuestro newsletter y enterate de novedades antes que todos.</a>
            <div className='flex flex-wrap lg:flex-nowrap gap-3 pt-2'>
              <input
                type="email"
                placeholder="Ingresa tu email"
                className="ps-2 py-3 bg-[#262D3B] text-white rounded-full w-auto md:w-3/4 lg:w-auto"
              />
              <a
                href="#"
                className="flex items-center text-black dark:text-white bg-white hover:bg-slate-300 font-medium rounded-full text-base px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Suscribirme
                <span className="flex items-center justify-center bg-black text-xs text-white rounded-full p-1 ml-2">
                  <FaArrowRight />
                </span>
              </a>
            </div>
            <div className='pt-6'>
              <h2 className='text-base font-bold text-white'>SÍGUENOS</h2>
              <div className='flex space-x-3 pt-4'>
                <div className='bg-[#262D3B] p-2 rounded-full'>
                  <GrFacebookOption className='text-white text-lg' />
                </div>
                <div className='bg-[#262D3B] p-2 rounded-full'>
                  <RiTwitterXLine className='text-white text-lg' />
                </div>
                <div className='bg-[#262D3B] p-2 rounded-full'>
                  <FaInstagram className='text-white text-lg' />
                </div>
                <div className='bg-[#262D3B] p-2 rounded-full'>
                  <FaLinkedinIn className='text-white text-lg' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#262D3B] flex flex-wrap justify-center md:justify-between py-5 px-4 lg:px-20">
          <div className="">
            <p className="text-slate-300 text-sm">© 2024 Aqcess. All rights reserved.</p>
          </div>
          <div>
            <p className="text-slate-300 text-sm pt-3 md:pt-0">Privacy Policy   |   Terms and Condition</p>
          </div>
        </div>
      </div>
      {/* Footer Section End */}

    </div >

  )
};
export default TestimonialsSection