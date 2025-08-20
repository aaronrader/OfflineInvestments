import './App.css';

import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function App() {
  const navigate = useNavigate();
  const account = useSelector(state => state.account.value);

  return (
    <Box sx={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <AppBar position="static" sx={{ height: "fit-content" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography onClick={() => navigate("/")} sx={{ cursor: "pointer", width: "30%" }}>Offline Investments</Typography>
          <Typography sx={{ width: "30%", textAlign: "center" }}>{account.name}</Typography>
          <Typography sx={{ width: "30%", textAlign: "center" }} />
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}

export default App;
