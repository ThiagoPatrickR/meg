import './styles/global.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

import EventInfo from './components/EventInfo/EventInfo';
import GiftList from './components/GiftList/GiftList';
import RSVP from './components/RSVP/RSVP';
import Gallery from './components/Gallery/Gallery';
import Messages from './components/Messages/Messages';
import Thanks from './components/Thanks/Thanks';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
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
      <Chatbot />
    </>
  );
}

export default App;
