"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Platform information with inline SVG logos
const platforms = [
  {
    name: "OutSystems",
    url: "https://www.outsystems.com/",
    logo: (
      <Image
        src="/platforms/outsystems-logo.png"
        alt="OutSystems logo"
        width={166}
        height={32}
        className="object-contain w-auto scale-150"
      />
    ),
    delay: 0.1,
  },
  {
    name: "Retool",
    url: "https://retool.com/",
    logo: (
      <svg
        width="2695"
        height="523"
        viewBox="0 0 2695 523"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_52_1420)">
          <path
            d="M1147.7 512.031H1049.46L834.793 292.589H794.77V512.031H722V0H965.778C1068.38 0 1129.51 54.8605 1129.51 146.295C1129.51 237.729 1068.38 292.589 965.778 292.589H929.393L1147.7 512.031ZM1056.74 146.295C1056.74 94.36 1027.63 62.1752 965.778 62.1752H794.77V230.414H965.778C1027.63 230.414 1056.74 198.229 1056.74 146.295Z"
            fill="currentColor"
          />
          <path
            d="M1334.01 523C1217.58 523 1144.81 435.955 1144.81 321.845C1144.81 207.735 1217.58 120.69 1330.38 120.69C1421.34 120.69 1475.92 171.893 1499.93 247.966C1508.66 276.494 1512.3 307.947 1512.3 340.132V347.447H1214.67C1216.86 408.89 1261.97 468.14 1334.01 468.14C1395.87 468.14 1424.25 432.297 1430.07 405.964H1505.02C1487.56 468.14 1429.34 523 1334.01 523ZM1214.67 292.586H1442.44C1438.8 226.754 1403.87 175.551 1330.38 175.551C1256.88 175.551 1216.86 230.411 1214.67 292.586Z"
            fill="currentColor"
          />
          <path
            d="M1515.9 190.187V131.67H1606.86V43.8928H1676.72V131.67H1774.96V190.187H1676.72V420.601C1676.72 446.203 1683.99 454.98 1709.46 454.98H1774.96V512.035H1694.91C1628.69 512.035 1606.86 479.119 1606.86 420.601V190.187H1515.9Z"
            fill="currentColor"
          />
          <path
            d="M1975.8 120.69C2092.24 120.69 2168.64 207.735 2168.64 321.845C2168.64 435.955 2092.24 523 1975.8 523C1859.37 523 1782.96 435.955 1782.96 321.845C1782.96 207.735 1859.37 120.69 1975.8 120.69ZM1975.8 179.208C1896.49 179.208 1852.82 245.04 1852.82 321.845C1852.82 398.65 1896.49 464.482 1975.8 464.482C2055.12 464.482 2098.78 398.65 2098.78 321.845C2098.78 245.04 2055.12 179.208 1975.8 179.208Z"
            fill="currentColor"
          />
          <path
            d="M2392.33 120.69C2508.77 120.69 2585.17 207.735 2585.17 321.845C2585.17 435.955 2508.77 523 2392.33 523C2275.9 523 2199.5 435.955 2199.5 321.845C2199.5 207.735 2275.9 120.69 2392.33 120.69ZM2392.33 179.208C2313.02 179.208 2269.35 245.04 2269.35 321.845C2269.35 398.65 2313.02 464.482 2392.33 464.482C2471.65 464.482 2515.32 398.65 2515.32 321.845C2515.32 245.04 2471.65 179.208 2392.33 179.208Z"
            fill="currentColor"
          />
          <path d="M2695.45 0V512.031H2625.59V0H2695.45Z" fill="currentColor" />
          <path
            d="M320 24C320 10.7452 309.255 0 296 0H24C10.7452 0 0 10.7452 0 24V136C0 149.255 10.7452 160 24 160H296C309.255 160 320 170.745 320 184V216C320 229.255 309.255 240 296 240H120C106.745 240 96 250.745 96 264V376C96 389.255 106.745 400 120 400H296C309.255 400 320 410.745 320 424V488C320 501.255 330.745 512 344 512H456C469.255 512 480 501.255 480 488V376C480 362.745 469.255 352 456 352H344C330.745 352 320 341.255 320 328V296C320 282.745 330.745 272 344 272H456C469.255 272 480 261.255 480 248V136C480 122.745 469.255 112 456 112H344C330.745 112 320 101.255 320 88V24Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_52_1420">
            <rect width="2695" height="523" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    delay: 0.2,
  },
  {
    name: "Mendix",
    url: "https://www.mendix.com/",
    logo: (
      <svg
        width="115.22"
        height="26.41"
        viewBox="0 0 493 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 md:h-10 w-auto"
      >
        <path
          d="M89.5603 35.4171C76.6691 35.4171 67.9844 41.6592 64.592 48.7154H64.1849C60.6568 41.3878 52.922 35.4171 41.3877 35.4171C32.0246 35.4171 24.6969 38.9452 19.5404 47.0871H19.1333L17.9121 37.0454H0V113.036H22.5258V75.1764C22.5258 63.5065 26.7324 55.3646 36.2312 55.3646C43.2875 55.3646 47.3584 59.1641 47.3584 71.1055V113.036H69.7485V75.1764C69.7485 63.3708 73.9551 55.3646 83.4539 55.3646C90.5102 55.3646 94.5811 59.1641 94.5811 71.1055V113.036H117.107V62.5566C117.107 54.5504 112.9 35.4171 89.5603 35.4171Z"
          fill="currentColor"
        ></path>
        <path
          d="M163.501 35.4171C142.603 35.4171 126.591 50.8866 126.591 75.4478C126.591 100.416 142.739 114.664 164.993 114.664C178.834 114.664 189.147 110.051 193.761 106.387L186.569 87.6606H185.484C180.87 91.1887 174.356 94.9883 164.586 94.9883C155.087 94.9883 148.981 89.9675 148.574 82.6398H198.918C198.918 82.6398 199.053 78.1618 199.053 75.8549C199.053 51.7008 184.941 35.4171 163.501 35.4171ZM163.908 54.5504C172.457 54.5504 177.749 60.3854 178.427 66.3561H149.388C150.338 60.2497 155.494 54.5504 163.908 54.5504Z"
          fill="currentColor"
        ></path>
        <path
          d="M252.516 35.4171C242.203 35.4171 233.79 40.3022 229.447 47.0871H229.04L227.819 37.0454H209.907V113.036H232.433V75.1764C232.433 61.8781 240.439 55.3646 248.309 55.3646C255.094 55.3646 260.251 59.8426 260.251 68.7987V113.036H282.777V62.1495C282.777 47.6298 273.006 35.4171 252.516 35.4171Z"
          fill="currentColor"
        ></path>
        <path
          d="M368.771 113.036V12.3485H347.059V44.9159H346.788C342.581 38.9452 335.118 35.4171 326.162 35.4171C305.807 35.4171 292.237 53.3291 292.237 76.1263C292.237 98.245 305.128 114.664 325.619 114.664C337.696 114.664 344.345 109.915 348.687 102.994H349.094L350.994 113.036H368.771ZM331.454 55.3646C341.224 55.3646 347.873 63.5065 347.873 75.0407C347.873 87.3892 341.088 93.9027 331.182 93.9027C321.276 93.9027 314.627 86.7107 314.627 75.1764C314.627 63.6422 321.684 55.3646 331.454 55.3646Z"
          fill="currentColor"
        ></path>
        <path
          d="M395.035 0C385.944 0 380.923 5.5636 380.923 13.8412C380.923 21.983 385.944 27.9537 395.035 27.9537C404.127 27.9537 409.148 21.983 409.148 13.8412C409.148 5.5636 404.127 0 395.035 0ZM406.027 113.036V37.0454H383.637V113.036H406.027Z"
          fill="currentColor"
        ></path>
        <path
          d="M467.958 74.6337L490.348 37.0454H464.158L453.031 60.2497L441.904 37.0454H415.714L438.105 74.6337L413.543 113.036H440.004L453.031 89.0176L466.058 113.036H492.519L467.958 74.6337Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
    delay: 0.3,
  },
];

export default function Platforms() {
  return (
    <section
      id="platforms"
      className="py-20 relative overflow-hidden bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-300/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-300/30 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-conic from-blue-200/30 via-sky-200/20 to-indigo-200/30 blur-3xl rounded-full opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-blue-200">
            Supported Platforms
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Integrate our AI voice assistants with leading low-code development
            platforms
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: platform.delay }}
              className="relative group"
            >
              <Link
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-xl bg-white dark:bg-gray-800/80 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700/50 group-hover:-translate-y-1"
              >
                <div className="h-10 w-36 md:w-48 flex items-center justify-center">
                  {platform.logo}
                </div>
              </Link>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm">
                  {platform.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
