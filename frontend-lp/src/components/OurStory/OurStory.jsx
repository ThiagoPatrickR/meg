import { motion } from 'framer-motion';
import { FaHeart, FaRing, FaGlassCheers, FaStar } from 'react-icons/fa';
import './OurStory.css';

const timelineEvents = [
    {
        icon: <FaHeart />,
        title: 'Como nos conhecemos',
        date: 'Placeholder',
        description: 'A história de como Marcelo e Gabriella se conheceram pela primeira vez. Uma conexão instantânea que mudaria suas vidas para sempre.'
    },
    {
        icon: <FaGlassCheers />,
        title: 'Primeiro encontro',
        date: 'Placeholder',
        description: 'O primeiro encontro oficial. Nervosismo, risadas e a certeza de que algo especial estava começando.'
    },
    {
        icon: <FaStar />,
        title: 'Pedido de namoro',
        date: 'Placeholder',
        description: 'O momento em que decidiram oficializar o relacionamento. Uma declaração de amor que selou o compromisso de estarem juntos.'
    },
    {
        icon: <FaRing />,
        title: 'O pedido de casamento',
        date: 'Placeholder',
        description: 'O momento mais emocionante: o pedido de casamento. Uma surpresa inesquecível que marcou o início de uma nova jornada.'
    }
];

const OurStory = () => {
    return (
        <section className="our-story" id="historia">
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Nossa História</h2>
                    <p>Uma jornada de amor que nos trouxe até aqui</p>
                </motion.div>

                <div className="timeline">
                    {timelineEvents.map((event, index) => (
                        <motion.div
                            key={index}
                            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <div className="timeline-icon">
                                {event.icon}
                            </div>
                            <div className="timeline-content">
                                <span className="timeline-date">{event.date}</span>
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="couple-quote"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <blockquote>
                        "O amor não é olhar um para o outro, é olhar juntos na mesma direção."
                    </blockquote>
                    <cite>— Marcelo & Gabriella</cite>
                </motion.div>
            </div>
        </section>
    );
};

export default OurStory;
