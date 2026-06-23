import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ContactSignal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
      setFormState({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <MagneticButton
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-cobalt text-white flex items-center justify-center shadow-lg animate-pulse-glow focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-2 focus:ring-offset-obsidian"
            strength={0.4}
          >
            <Send className="w-5 h-5" />
          </MagneticButton>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "#0A0A0B" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 right-6 md:top-10 md:right-10"
            >
              <MagneticButton
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-full border border-quartz/10 flex items-center justify-center hover:bg-quartz hover:text-obsidian transition-all text-quartz focus:outline-none focus:ring-2 focus:ring-cobalt"
                strength={0.2}
              >
                <X className="w-5 h-5" />
              </MagneticButton>
            </motion.div>

            <div className="w-full max-w-2xl px-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-cobalt/10 flex items-center justify-center mx-auto mb-6">
                    <Send className="w-6 h-6 text-cobalt" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-quartz mb-2">Signal Received</h3>
                  <p className="text-quartz/40 font-body">We'll be in touch soon.</p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <p className="text-xs tracking-widest uppercase text-cobalt font-body mb-4">The Signal</p>
                  <h2
                    className="font-display font-bold text-quartz mb-12"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
                  >
                    Let's Create Together
                  </h2>

                  <div className="space-y-8">
                    <div>
                      <label htmlFor="contact-name" className="sr-only">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                        className="w-full bg-transparent border-b border-quartz/15 pb-4 text-lg font-body text-quartz placeholder:text-quartz/25 focus:outline-none focus:border-cobalt transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="sr-only">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="Email Address"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                        className="w-full bg-transparent border-b border-quartz/15 pb-4 text-lg font-body text-quartz placeholder:text-quartz/25 focus:outline-none focus:border-cobalt transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="sr-only">Message</label>
                      <textarea
                        id="contact-message"
                        placeholder="Tell us about your project"
                        rows={4}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                        className="w-full bg-transparent border-b border-quartz/15 pb-4 text-lg font-body text-quartz placeholder:text-quartz/25 focus:outline-none focus:border-cobalt transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-12 group flex items-center gap-3 text-lg font-display font-semibold text-quartz hover:text-cobalt transition-colors focus:outline-none focus:ring-2 focus:ring-cobalt rounded-md px-2 py-1"
                  >
                    Send Signal
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}