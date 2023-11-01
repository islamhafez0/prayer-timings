import { useState } from "react";
import Button from "@mui/material/Button";
import "./index.css";
import "./App.css";
import MainContent from "./components/MainContent";
import { Container } from "@mui/material";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <Container maxWidth="xl">
        <MainContent />
      </Container>
    </div>
  );
}

export default App;
