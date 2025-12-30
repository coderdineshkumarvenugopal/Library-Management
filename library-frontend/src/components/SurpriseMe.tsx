import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHatWizard, FaMagic, FaTimes } from 'react-icons/fa';
import { useRandomBook } from '../hooks/useLibrary';
import BookCard from './BookCard';

const moods = [
    { name: 'Happy', emoji: '😊', color: 'bg-yellow-400' },
    { name: 'Adventurous', emoji: '🏹', color: 'bg-orange-500' },
    { name: 'Thoughtful', emoji: '🤔', color: 'bg-indigo-500' },
    { name: 'Learning', emoji: '🧠', color: 'bg-green-500' },
];

const SurpriseMe = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const { data: randomBook, isLoading, isFetching } = useRandomBook(selectedMood);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
    };

    const reset = () => {
        setSelectedMood(null);
        setIsOpen(false);
    };

    return (
        <div className="relative z-50">
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 font-bold group"
            >
                <FaHatWizard className="text-2xl group-hover:rotate-12 transition-transform" />
                <span className="hidden md:inline">Surprise Me!</span>
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={reset}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-gray-900 border border-white/10 p-8 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

                            <button onClick={reset} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <FaTimes />
                            </button>

                            {!selectedMood ? (
                                <div className="text-center relative">
                                    <FaMagic className="text-4xl text-purple-400 mx-auto mb-4 animate-bounce" />
                                    <h2 className="text-3xl font-bold text-white mb-2">How's your mood?</h2>
                                    <p className="text-gray-400 mb-8">Let the Library Wizard pick a book for you.</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        {moods.map((mood) => (
                                            <motion.button
                                                key={mood.name}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleMoodSelect(mood.name)}
                                                className={`${mood.color} p-6 rounded-2xl flex flex-col items-center gap-2 group transition-shadow hover:shadow-lg`}
                                            >
                                                <span className="text-4xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
                                                <span className="font-bold text-white">{mood.name}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    {isLoading || isFetching ? (
                                        <div className="py-20">
                                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                                            <p className="text-purple-400 font-medium animate-pulse">Consulting the ancient scrolls...</p>
                                        </div>
                                    ) : randomBook ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-6">Your perfect match! ✨</h3>
                                            <div className="max-w-[280px] mx-auto">
                                                <BookCard
                                                    book={randomBook}
                                                    onAction={() => { }}
                                                    actionType="borrow"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setSelectedMood(null)}
                                                className="mt-8 text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4"
                                            >
                                                Try another mood
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <div className="py-10">
                                            <p className="text-white text-xl">No books found for this mood... yet!</p>
                                            <button onClick={() => setSelectedMood(null)} className="mt-4 text-purple-400">Back</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SurpriseMe;
