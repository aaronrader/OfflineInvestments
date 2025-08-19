import './App.css';

import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router';

function App() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <AppBar position="static" sx={{ height: "fit-content" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography onClick={() => navigate("/")} sx={{ marginRight: "auto", cursor: "pointer" }}>Offline Investments</Typography>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}

export default App;
