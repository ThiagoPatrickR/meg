import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import './Thanks.css';

const Thanks = () => {
    return (
        <section className="thanks" id="agradecimentos">
            <div className="container">
                <motion.div
                    className="thanks-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="thanks-icon">
                        <FaHeart />
                    </div>

                    <h2>Obrigado!</h2>

                    <p className="thanks-message">
                        A presença de vocês torna este momento ainda mais especial.
                        Agradecemos por fazerem parte da nossa história e por celebrarem
                        conosco este novo capítulo de nossas vidas.
                    </p>

                    <p className="thanks-importance">
                        Cada pessoa que estará presente neste dia carrega um pedacinho
                        da nossa história. É por vocês que este momento se torna
                        verdadeiramente inesquecível.
                    </p>

                    <blockquote className="thanks-quote">
                        "O amor é composto de uma única alma habitando dois corpos."
                    </blockquote>

                    <div className="thanks-signature">
                        <span>Com amor,</span>
                        <h3>Marcelo & Gabriela</h3>
                    </div>

                    <div className="thanks-hearts">
                        💕
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Thanks;
