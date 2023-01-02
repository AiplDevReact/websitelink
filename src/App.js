
import './App.css';
import { Routes, Route, HashRouter } from "react-router-dom";
import Ui from "./pages/Ui";
import Appointmentdesigns from './pages/Appointmentdesigns';
import Appointment from './pages/Appointment';

function App() {
  return (
    <>
     
     <HashRouter>
        <Routes>
          <Route path="/" element={<Ui />} />
          <Route path="Appointmentdesigns" element={<Appointmentdesigns/>}/>
          <Route path="Appointment" element={<Appointment/>}/>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
