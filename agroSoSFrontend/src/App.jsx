import {BrowserRouter, Route, Routes} from 'react-router-dom'
// import Home from './components/Home';
import './App.css'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/' element={<Home/>}/>
        <Route path='/user/:id' element={<Home/>}/>
        <Route path='/login' element={<Home/>}/>
        <Route path='/signIn' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App
