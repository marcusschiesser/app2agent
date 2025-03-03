"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [{ label: "Features", href: "#features" }],
    },
    {
      title: "Resources",
      links: [
        {
          label: "Support",
          href: "https://www.linkedin.com/in/marcusschiesser/",
        },
      ],
    },
    {
      title: "Legal",
      links: [{ label: "Privacy Policy", href: "/privacy" }],
    },
  ];

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://x.com/MarcusSchiesser",
      label: "Twitter",
      hoverColor: "hover:text-blue-400",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/marcusschiesser/",
      label: "LinkedIn",
      hoverColor: "hover:text-blue-600",
    },
    {
      icon: Mail,
      href: "mailto:info@schiesser-it.com",
      label: "Email",
      hoverColor: "hover:text-green-500",
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">
                App2Agent
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Voice-Based IT Support for Low-Code Apps. Transform how users
                interact with your applications using AI voice assistants.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className={`text-gray-500 ${social.hoverColor} transition-colors duration-300`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {footerLinks.map((column, columnIndex) => (
            <motion.div
              key={columnIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (columnIndex + 1) }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                      target={
                        link.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        link.href.startsWith("http") ? "noreferrer" : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {currentYear} Schiesser IT LLC. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Made with ♥ from South East Asia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
