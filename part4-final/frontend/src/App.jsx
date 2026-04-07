import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlaceDetail from './pages/PlaceDetail';
import Places from './pages/Places';
import CreatePlace from './pages/CreatePlace';
import Auth from './pages/Auth';
import Legal from './pages/Legal';
import InfoPage from './pages/InfoPage';
import ConsentBanner from './components/ConsentBanner';
import './index.css';

function App() {
  return (
    <>
    <ConsentBanner />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/places" element={<Places />} />
      <Route path="/places/new" element={<CreatePlace />} />
      <Route path="/places/:id" element={<PlaceDetail />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/legal/:page" element={<Legal />} />
      <Route path="/info/:page" element={<InfoPage />} />
    </Routes>
    </>
  );
}

export default App;
