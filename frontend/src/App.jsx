import react from 'react';
import {Routes, Route , Navigate} from 'react-router'
import { Home } from './Page/Home';
import {Sign} from './Page/Sign'
import { Login } from './Page/Login';
function App(){
  
  return(
    <>
     <button className="btn btn-primary">Click Me</button>
      <Routes>
        <Route path="/" element={<Home></Home>}> </Route>
        <Route path='Sign' element={<Sign></Sign>}></Route>
        <Route path="Login" element ={<Login></Login>}></Route>
      </Routes>
      
    </>
  )
}
export default App;