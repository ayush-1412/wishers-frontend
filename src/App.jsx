import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateWish from "./pages/CreateWish";
import WishPage from "./pages/WishPage";
import EditWish from "./pages/EditWish";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateWish />} />
        <Route path="/wish/:id" element={<WishPage />} />
        <Route path="/edit/:id" element={<EditWish />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
