"use client";

import { signUpAction } from "@/app/(auth)/actions/auth";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { SendIcon, CheckCircle, AlertCircle } from "lucide-react";

export default function EmailSignup() {
  const [state, formAction, isPending] = useActionState(signUpAction, {});

  const previousFormData = state.formData as Record<string, string> | undefined;

  if (state.type === "success" && state.message) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-violet-800 -z-10"></div>
        <div className="absolute inset-0 bg-white/5 -z-10"></div>

        <div className="container mx-auto px-4 max-w-6xl text-center">
          <motion.div
            className="flex flex-col gap-8 w-full text-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-5xl font-bold text-white">Success!</h2>
            <p className="text-2xl text-blue-100 max-w-lg mx-auto">
              {state.message}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/auth"
                className="mt-4 inline-block px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300"
              >
                Go to Dashboard
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="email-signup" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-violet-800 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-white/5 -skew-y-6 transform-gpu -z-10"></div>

      <div className="container mx-auto px-4 max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Apps?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-xl mx-auto">
            Join for early access and special pricing
          </p>
        </motion.div>

        {state.type === "error" && state.message && (
          <motion.div
            className="max-w-md mx-auto mb-8 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5 text-red-300 mr-3 flex-shrink-0" />
            <p className="text-sm text-red-200">{state.message}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-xl">
            <form action={formAction} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    required
                    defaultValue={previousFormData?.name || ""}
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    required
                    defaultValue={previousFormData?.companyName || ""}
                  />
                </div>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Work email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  required
                  defaultValue={previousFormData?.email || ""}
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min. 8 characters)"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  required
                  minLength={8}
                  defaultValue={previousFormData?.password || ""}
                />
              </div>
              <motion.button
                type="submit"
                className="bg-white text-blue-800 font-medium py-3 px-4 rounded-xl hover:bg-blue-100 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                disabled={isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-blue-800/20 border-t-blue-800 rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Get Early Access</span>
                    <SendIcon className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
          <p className="mt-4 text-sm text-blue-200/80">
            By signing up, you agree to our{" "}
            <a href="/privacy" className="text-white hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
