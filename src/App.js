import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

import './App.css';

function App() {
  let navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <AppBar position="static" sx={{height: "fit-content"}}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography sx={{marginRight: "auto"}}>Offline Investments</Typography>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}

export default App;
