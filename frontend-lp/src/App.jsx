import { useEffect } from 'react';
import './styles/global.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

import EventInfo from './components/EventInfo/EventInfo';
import GiftList from './components/GiftList/GiftList';
import RSVP from './components/RSVP/RSVP';
import Gallery from './components/Gallery/Gallery';
import Messages from './components/Messages/Messages';
import Thanks from './components/Thanks/Thanks';


function App() {
  // Handle initial hash scroll and hash changes
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        // Retry mechanism to ensure element is found and scrolled to
        let attempts = 0;
        const maxAttempts = 20;

        const tryScroll = setInterval(() => {
          const element = document.querySelector(hash);
          if (element) {
            clearInterval(tryScroll);
            // Scroll to the element
            element.scrollIntoView({ behavior: 'smooth' });

            // Double check after a delay to account for layout shifts
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth' });
            }, 500);
          } else {
            attempts++;
            if (attempts >= maxAttempts) clearInterval(tryScroll);
          }
        }, 100);
      }
    };

    // Run on mount
    handleHashScroll();

    // Listen to hash changes
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <EventInfo />
        <GiftList />
        <RSVP />
        <Gallery />
        <Messages />
        <Thanks />
      </main>

    </>
  );
}

export default App;
