import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { feedbackApi } from '../../api/feedbackApi';

export default function FeedbackSection() {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to submit feedback');
            return;
        }

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        try {
            setIsSubmitting(true);
            await feedbackApi.submitFeedback({ rating, message });
            toast.success('Thank you for your feedback!');
            setRating(0);
            setMessage('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                        Share Your <span className="text-primary-500">Experience.</span>
                    </h2>
                    <p className="text-gray-500 font-medium">We constantly strive for perfection. Your feedback helps us serve you better.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto bg-gray-50 p-8 md:p-12 rounded-[3rem] border border-gray-200 shadow-xl"
                >
                    {!user ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 font-bold mb-4">You must be logged in to leave feedback.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate your experience</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <FiStar
                                                size={36}
                                                className={`transition-colors duration-200 ${star <= (hoverRating || rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-[10px] text-gray-500 font-black uppercase tracking-widest pl-4">Your message</label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what you loved or what we can improve..."
                                    className="w-full bg-white border border-gray-200 rounded-3xl py-5 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none placeholder:text-gray-400"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-500 text-white py-5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">Submitting...</span>
                                ) : (
                                    <>
                                        <span>Send Feedback</span>
                                        <FiSend size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
