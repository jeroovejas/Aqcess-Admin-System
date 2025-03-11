"use client"


import React, { useEffect, useState } from "react"
import { FaArrowRight } from "react-icons/fa"
import { RiArrowDropDownLine } from "react-icons/ri"
import { FaCheck } from "react-icons/fa6"
import { GrFacebookOption } from "react-icons/gr"
import { RiTwitterXLine } from "react-icons/ri"
import { FaInstagram } from "react-icons/fa"
import { FaLinkedinIn } from "react-icons/fa"
import { IoSearch } from "react-icons/io5"
import { useAppSelector } from "@/store/hooks"
import Loader from "@/components/common/Loader"
import { Link, useRouter } from "@/navigation"
import { Check } from "lucide-react"
import { MdShoppingCart } from "react-icons/md";
import { RiQuestionnaireLine } from "react-icons/ri";
import { TiHomeOutline } from "react-icons/ti";
import { IoBagOutline } from "react-icons/io5";
import { MdOutlineQrCode2 } from "react-icons/md";


const TestimonialsSection = () => {
  const sliderRef: any = React.useRef(null)
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true, // Slider automatically chalega
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // For tablet
        settings: {
          slidesToShow: 2,
          autoplay: true, // Slider automatically chalega
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 640, // For mobile
        settings: {
          slidesToShow: 1,
          autoplay: true, // Slider automatically chalega
          autoplaySpeed: 3000,
        },
      },
    ],
  }

  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuOpen1, setIsMenuOpen1] = useState(false)
  const user = useAppSelector((state) => state.auth.userData)
  const [verified, setVerified] = useState<boolean | null>(null)
  const [isMonthly, setIsMonthly] = useState(true) // Track if the monthly option is selected

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handlePricingToggle = (isMonthlySelected: any) => {
    setIsMonthly(isMonthlySelected)
  }

  useEffect(() => {
    const checkLoggoedInUser = async () => {
      if (Object.entries(user).length !== 0 && user.role !== undefined && user.role) {
        if (user.role === 1) {
          router.push("/user-management")
        } else {
          router.push("/dashboard")
        }
      } else {
        setVerified(true)
      }
    }
    checkLoggoedInUser()
  }, [router, user, user.role])

  if (verified === null) {
    return <Loader />
  }

  return (
    <>
      {verified ? (
        <div className="bg-white">

          {/* Header Section Start */}
          <header>
            <nav className="bg-white border-gray-200 px-4 md:px-14 lg:px-20 py-4 dark:bg-gray-800">
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
                        <span className="text-2xl">
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
                    <Link
                      href="/auth/login"
                      className="flex lg:hidden items-center text-white dark:text-white bg-black hover:bg-slate-700 font-medium rounded-full text-base px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                    >
                      Administrator Login
                      <span className="flex items-center justify-center bg-white text-xs text-black rounded-full p-1 ml-2">
                        <FaArrowRight />
                      </span>
                    </Link>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
          {/* Header Section End */}

          {/* Section 1 - Gestiona tu comunidad */}
          <section id="inicio" className="py-6 md:py-10 px-4 md:px-14 lg:px-20 text-start lg:text-center mt-0 lg:mt-12">
            <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold mb-3 md:mb-6 text-black">
              Gestiona tu comunidad
              <br />
              totalmente gratis.
            </h1>
            <p className="text-base md:text-lg lg:text-lg text-gray-600 lg:w-2/4 mx-auto mb-6 lg:mb-12">
              Ofrece a tus residentes una app móvil moderna e intuitiva gestionada cómodamente desde tu portal de
              administrador.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
              <a
                href="#"
                className="bg-black text-white rounded-md py-3 px-6 flex items-center justify-center gap-2 font-medium"
              >
                Crear Cuenta
                <span className="bg-white text-black rounded-full p-1 flex items-center justify-center">
                  <FaArrowRight size={12} />
                </span>
              </a>
              <a
                href="#"
                className="bg-slate-200 text-black rounded-md py-3 px-6 flex items-center justify-center gap-2 font-medium"
              >
                Ver Planes
                <span className="bg-black text-white rounded-full p-1 flex items-center justify-center">
                  <FaArrowRight size={12} />
                </span>
              </a>
            </div>

            <div className="flex justify-center gap-8 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <FaCheck className="text-black" />
                <span className="text-black font-medium">Gratis de por vida</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-black" />
                <span className="text-black font-medium">Sin costos ocultos</span>
              </div>
            </div>
          </section>

          {/* Section 2 - Dashboard Interface */}
          <section className="py-6 px-4 lg:px-0 rounded-3xl md:mx-14 lg:mx-20">
            <div className="flex justify-center">
              <img
                src="/images/home_page/mackbook.png"
                alt="Dashboard Interface"
                className="w-full h-full md:h-full object-contain"
              />
            </div>
          </section>


          {/* Section 3 - ¡Aqcess, mucho gusto! */}
          <section className="py-6 md:py-10 px-4 md:px-14 lg:px-20 text-start lg:text-center">
            <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold mb-3 lg:mb-6 text-black">¡Aqcess, mucho gusto!</h1>
            <p className="text-base lg:text-lg text-slate-600 max-w-3xl mx-auto mb-6 md:mb-12">
              Recauda mantenimiento y pagos más fácil. Evita conflictos entre residentes y garantiza la seguridad de tu
              comunidad. Somos tu nueva mano derecha.
            </p>

            <div className="flex flex-col md:flex-row gap-8 mt-6 lg:mt-12">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-3 md:mb-6 text-left text-black">App Residentes</h2>
                <p className="text-left mb-3 md:mb-6 max-w-md text-black text-base font-medium">
                  Tus residentes pueden reservar áreas comunes, pagar cuotas de mantenimiento, generar códigos QR para
                  invitados y acceder funciones diseñadas para su comodidad.
                </p>

                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Invitaciones QR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Reservar Amenidades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Pago de Servicios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Pago de mantenimiento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Recibir comunicados y encuestas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Perfiles ilimitados</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src="/images/home_page/phones.png"
                  alt="App Residentes"
                  className="w-full max-w-2xl object-contain"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6 lg:mt-16">
              <a href="#" className="flex items-center bg-black text-white rounded-md px-4 py-2 gap-2">
                <img src="/images/playstore.png" alt="Play Store" className="h-6 w-6" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs">GET IT ON</span>
                  <span className="text-base font-medium">Google Play</span>
                </div>
              </a>
              <a href="#" className="flex items-center bg-black text-white rounded-md px-4 py-2 gap-2">
                <img src="/images/apple.png" alt="App Store" className="h-8 w-8 filter invert" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs">Download on the</span>
                  <span className="text-base font-medium">App Store</span>
                </div>
              </a>
            </div>
          </section>

          {/* Section 4 - Portal Administrador */}
          <section className="py-6 lg:py-10 px-4 lg:px-0 bg-white mx-0 md:mx-14 lg:mx-20">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-2/3 order-2 md:order-1">
                <img
                  src="/images/home_page/dashboard-mackbook.png"
                  alt="Portal Administrador"
                  className="w-full h-full"
                />
              </div>

              <div className="w-full lg:w-1/2 order-1 md:order-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-2 text-black">Portal Administrador</h2>
                <p className="text-base lg:text-base mb-3 md:mb-4 text-black font-medium">
                  Puedes gestionar de manera eficiente a tus residentes, pagos de mantenimiento, comunicación, encuestas
                  y áreas comunes. Todo desde un solo lugar.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Bitácora digital de accesos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Pago de Servicios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Pago de Mantenimiento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Control de ingresos y egresos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Encuestas y comunicación con residentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Reserva y gestión de áreas comunes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-black p-0.5">
                      <FaCheck className="text-black" size={10} />
                    </div>
                    <span className="text-black">Reportes financieros</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 - Empieza en segundos */}
          <section className="py-6 md:py-0 px-4 md:px-14 lg:px-20 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6 lg:mb-12 text-black">Empieza en segundos</h2>

            <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
              <a
                href="#"
                className="bg-black text-white rounded-md py-3 px-6 flex items-center justify-center gap-2 font-medium"
              >
                Crear Cuenta
                <span className="bg-white text-black rounded-full p-1 flex items-center justify-center">
                  <FaArrowRight size={12} />
                </span>
              </a>
              <a
                href="#"
                className="bg-slate-200 text-black rounded-md py-3 px-6 flex items-center justify-center gap-2 font-medium"
              >
                Contáctanos
                <span className="bg-black text-white rounded-full p-1 flex items-center justify-center">
                  <FaArrowRight size={12} />
                </span>
              </a>
            </div>

            <div className="flex justify-center gap-8 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <FaCheck className="text-black" />
                <span className="text-black font-medium">Gratis de por vida</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-black" />
                <span className="text-black font-medium">Sin costos ocultos</span>
              </div>
            </div>
          </section>

          {/* Section 6 - Planes y Precios */}
          <section className="py-6 md:py-10 lg:py-14 px-4 md:px-14 lg:px-20 text-start md:text-center">
            <h2 className="text-2xl lg:text-5xl font-bold mb-2 md:mb-4 text-black">Planes y Precios</h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-6 lg:mb-12">
              Elige un plan sin plazos forzosos, que mejor se adapte a tus necesidades.
            </p>

            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center lg:items-end mt-6 md:mt-12">
              {/* Plan Básico */}
              <div className="bg-slate-100 rounded-xl p-6 w-full md:w-2/3 lg:w-1/3 inline-block">
                <div className="text-left">
                  <div className="bg-white text-black border border-black rounded-full px-4 py-1 text-sm font-medium self-start mb-4 inline-block">
                    BÁSICO
                  </div>

                  <h3 className="text-3xl font-bold mb-1 text-black">
                    $0<span className="text-lg font-bold">/mes</span>
                  </h3>

                  <p className="text-sm mb-2 text-black">Ideal para iniciar</p>
                </div>


                <hr className="border border-slate-700 mb-6" />

                <div className="space-y-2 text-left">
                  {[
                    "App Móvil para Caseta de vigilancia",
                    "App Móvil para Residentes",
                    "Portal de Administrador",
                    "Bitácora digital de accesos",
                    "Códigos QR para visitantes",
                    "Pago de Servicios",
                    "Usuarios ilimitados",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="rounded-full border border-black p-0.5 flex-shrink-0">
                        <Check className="text-black" size={10} />
                      </div>
                      <span className="text-black">{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="#" className="bg-black text-white rounded-full py-3 px-6 text-center font-medium mt-8 block">
                  Contratar
                </a>
              </div>

              {/* Plan Premium */}
              <div className="bg-black text-white rounded-xl p-6 w-full md:w-2/3 lg:w-1/3 inline-block">
                <div className="text-left">
                  <div className="bg-black text-white border border-white rounded-full px-4 py-1 text-sm font-medium self-start mb-4 inline-block">
                    PREMIUM
                  </div>

                  <h3 className="text-3xl font-bold mb-1">
                    $3,500<span className="text-lg font-bold">/mes</span>
                  </h3>

                  <p className="text-sm mb-2">Gestión total</p>
                </div>


                <hr className="border border-gray-700 mb-6" />

                <div className="space-y-2 text-left">
                  {[
                    "App Móvil para Caseta de vigilancia",
                    "App Móvil para Residentes",
                    "Portal de Administrador",
                    "Bitácora digital de accesos",
                    "Códigos QR para visitantes",
                    "Pago de Servicios",
                    "Pago de Mantenimiento",
                    "Control de ingresos y egresos",
                    "Encuestas y comunicación con residentes",
                    "Reserva y gestión de áreas comunes",
                    "Reportes financieros",
                    "Usuarios ilimitados",
                    "Soporte técnico",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="rounded-full border border-white p-0.5 flex-shrink-0">
                        <Check className="text-white" size={10} />
                      </div>
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="#" className="bg-[#41A4FF] text-white rounded-full py-3 px-6 text-center font-medium mt-8 block">
                  Contratar
                </a>
              </div>

              {/* Plan Empresa */}
              <div className="bg-slate-100 rounded-xl p-6 w-full md:w-2/3 lg:w-1/3 inline-block">
                <div className="text-left">
                  <div className="bg-black text-white rounded-full px-4 py-1 text-sm font-medium self-start mb-4 inline-block">
                    EMPRESA
                  </div>

                  <h3 className="text-3xl font-bold mb-1 text-black">
                    $3,500<span className="text-lg font-bold">/mes</span>
                  </h3>

                  <p className="text-sm mb-2 text-black">Capacidad Máxima</p>
                </div>


                <hr className="border border-gray-300 mb-6" />

                <div className="space-y-2 text-left">
                  {[
                    "Todas las funciones Premium",
                    "Integración con STP",
                    "Dispersión y recaudación de pagos",
                    "Notificaciones proactivas para cobro",
                    "Banca integrada a tu Portal",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="rounded-full border border-black p-0.5 flex-shrink-0">
                        <Check className="text-black" size={10} />
                      </div>
                      <span className="text-black">{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="#" className="bg-black text-white rounded-full py-3 px-6 text-center font-medium mt-8 block">
                  Saber más
                </a>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3 md:mt-6 text-center">Todos los precios incluyen IVA*</p>
          </section>

          {/* Section 7 - Recursos */}
          <section className="py-6 md:py-0 pb-10 md:pb-16 px-4 md:px-14 lg:px-20 text-start md:text-center">
            <h2 className="text-2xl lg:text-5xl font-bold mb-2 lg:mb-4 text-black">Recursos</h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-6 md:mb-4">
              Escribe aquí tus dudas y te ayudaremos con gusto
            </p>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-slate-200 rounded-lg py-3 px-12 focus:outline-none"
                  placeholder=""
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <IoSearch className="text-gray-500" size={20} />
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-4 md:mt-8">
                <button className="p-2 rounded-md bg-slate-200">
                  <MdShoppingCart className="h-6 w-6" />
                </button>
                <button className="p-2 rounded-md bg-slate-200">
                  <RiQuestionnaireLine className="h-6 w-6" />
                </button>
                <button className="p-2 rounded-md bg-slate-200">
                  <TiHomeOutline className="h-6 w-6" />
                </button>
                <button className="p-2 rounded-md bg-slate-200">
                  <IoBagOutline className="h-6 w-6" />
                </button>
                <button className="p-2 rounded-md bg-slate-200">
                  <MdOutlineQrCode2 className="h-6 w-6" />
                </button>
              </div>
            </div>
          </section>

          {/* Footer Section Start */}
          <div id="contacto" className="bg-black">
            <div className="pt-10 md:pt-16 pb-8 pl-4 pr-4 md:pl-14 md:pr-14 lg:pl-20 lg:pr-28 grid grid-cols-1 md:grid-cols-4 mx-auto">
              <div className="pb-6">
                <a href="" className="flex items-center">
                  <img className="h-8 lg:h-10" src="/images/footer-logo.png" alt="Header Icon" />
                </a>
              </div>
              <div className="">
                <div className="text-base lg:text-lg uppercase text-white font-bold pb-2">EMPRESA</div>
                <a className="my-4 block text-slate-300" href="/#">
                  Inicio
                </a>
                <a className="my-4 block text-slate-300" href="/#">
                  Nosotros
                </a>
                <a className="my-4 block text-slate-300" href="/#">
                  Soluciones
                </a>
                <a className="my-4 block text-slate-300" href="/#">
                  Funciones
                </a>
                <a className="my-4 block text-slate-300" href="/#">
                  Precios
                </a>
                <a className="my-4 block text-slate-300" href="/#">
                  Descarga la app
                </a>
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
                  Address : <br />
                  Cerro el macho #124. Privada <br /> Juriquilla Querétaro. CP 76230
                </a>
              </div>
              <div className="">
                <div className="text-base lg:text-lg uppercase text-white font-bold">Newsletter</div>
                <a className="my-3 block text-slate-300 text-sm lg:text-base" href="/#">
                  Suscribite a nuestro newsletter y enterate de novedades antes que todos.
                </a>
                <div className="flex flex-wrap lg:flex-nowrap gap-3 pt-2">
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
                <div className="pt-6">
                  <h2 className="text-base font-bold text-white">SÍGUENOS</h2>
                  <div className="flex space-x-3 pt-4">
                    <div className="bg-[#262D3B] p-2 rounded-full">
                      <GrFacebookOption className="text-white text-lg" />
                    </div>
                    <div className="bg-[#262D3B] p-2 rounded-full">
                      <RiTwitterXLine className="text-white text-lg" />
                    </div>
                    <div className="bg-[#262D3B] p-2 rounded-full">
                      <FaInstagram className="text-white text-lg" />
                    </div>
                    <div className="bg-[#262D3B] p-2 rounded-full">
                      <FaLinkedinIn className="text-white text-lg" />
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
                <p className="text-slate-300 text-sm pt-3 md:pt-0">Privacy Policy | Terms and Condition</p>
              </div>
            </div>
          </div>
          {/* Footer Section End */}
        </div>
      ) : null}
    </>
  )
}
export default TestimonialsSection

