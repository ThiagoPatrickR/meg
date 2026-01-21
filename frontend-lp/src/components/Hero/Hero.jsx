import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const weddingDate = new Date('2026-04-18T16:00:00');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = weddingDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero" id="home">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <motion.div
                    className="hero-text"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="hero-subtitle">Vamos nos casar!</p>
                    <h1 className="hero-title">
                        Marcelo <span className="ampersand">&</span> Gabriella
                    </h1>

                    <div className="hero-info">
                        <div className="hero-info-item">
                            <FaCalendarAlt />
                            <span>18 de Abril de 2026</span>
                        </div>
                        <div className="hero-info-item">
                            <FaMapMarkerAlt />
                            <span>E&P Eventos</span>
                        </div>
                    </div>

                    <motion.div
                        className="countdown"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="countdown-item">
                            <span className="countdown-number">{timeLeft.days}</span>
                            <span className="countdown-label">Dias</span>
                        </div>
                        <div className="countdown-separator">:</div>
                        <div className="countdown-item">
                            <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="countdown-label">Horas</span>
                        </div>
                        <div className="countdown-separator">:</div>
                        <div className="countdown-item">
                            <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="countdown-label">Min</span>
                        </div>
                        <div className="countdown-separator">:</div>
                        <div className="countdown-item">
                            <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="countdown-label">Seg</span>
                        </div>
                    </motion.div>

                    <motion.a
                        href="#confirmar"
                        className="btn btn-secondary hero-cta"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaHeart /> Confirmar Presença
                    </motion.a>
                </motion.div>
            </div>

            <div className="hero-scroll-indicator">
                <span>Role para baixo</span>
                <div className="scroll-arrow"></div>
            </div>
        </section>
    );
};

export default Hero;
