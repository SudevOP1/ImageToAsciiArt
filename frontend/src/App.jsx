import { BrowserRouter, Route, Routes } from "react-router-dom"
import CreateAsciiPage from "./pages/CreateAsciiPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateAsciiPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
