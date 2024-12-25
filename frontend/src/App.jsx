import Navbar from "./components/navbar/Navbar";
import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import Footer from "./components/footer/Footer";
import Header from "./containers/Header/Header";
import Signup from "./containers/SignUp/Signup";

function App() {
  return <div className="App">
    <Router>
     <Navbar/>
     <Routes>
      <Route>
          <Route path="/" element={<Header />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="*" element={<Navigate to="/" />} />
      </Route>
     </Routes>
     <Footer/>
    </Router>
  </div>;
}

export default App;
