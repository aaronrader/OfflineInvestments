import './App.css';

import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { saveAccountToFile, setSelectedAccount } from './code/accountSlice.js';
import { useEffect, useState } from 'react';

function App() {
  const navigate = useNavigate();
  const account = useSelector(state => state.account.selected);
  const accountList = useSelector(state => state.account.list);
  const dispatch = useDispatch();

  const [newAccountName, setNewAccountName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(account?.name);

  const handleAccountSelect = (name) => {
    setCurrentAccount(name);
    if (name === "NEW") {
      setDialogOpen(true);
    } else {
      dispatch(setSelectedAccount(name));
      dispatch(saveAccountToFile());
    }
  }

  useEffect(() => {
    if (accountList.length < 1)
      setDialogOpen(true);
  }, [accountList.length, dialogOpen])

  return (
    <Box sx={{ display: "flex", height: "100%", maxHeight: "100vh", flexDirection: "column" }}>
      <AppBar position="static" sx={{ height: "fit-content" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>Offline Investments</Typography>
          <Select value={currentAccount || "NEW"} onChange={(e) => handleAccountSelect(e.target.value)} sx={{ backgroundColor: "white" }} size='small'>
            {accountList.map((a) =>
              <MenuItem value={a.name}>{a.name}</MenuItem>
            )}
            <MenuItem value="NEW" sx={{ fontWeight: "bold" }}>New Account</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
      {account &&
        <Outlet />
      }

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setCurrentAccount(account?.name) }}>
        <DialogTitle align='center'>New Account</DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <TextField value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} label="Name" sx={{ m: 1 }} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => { handleAccountSelect(newAccountName); setDialogOpen(false) }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
