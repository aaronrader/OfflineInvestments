import './App.css';

import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccountFile, saveAccountToFile, setSelectedAccount } from './code/accountSlice.js';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const navigate = useNavigate();
  const account = useSelector(state => state.account.selected);
  const accountList = useSelector(state => state.account.list);
  const dispatch = useDispatch();

  const [newAccountName, setNewAccountName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAccountSelect = (name) => {
    dispatch(setSelectedAccount(name));
  }

  const handleAccountCreation = (name) => {
    dispatch(setSelectedAccount(name));
    dispatch(saveAccountToFile());
    setNewAccountName("");
    setDialogOpen(false);
  }

  const handleAccountDelete = () => {
    if (window.confirm(`WARNING: This action cannot be undone. Are you sure you want to delete ${account?.name}?`)) { //js dialog contains a bug that locks up electron render process
      const index = accountList.findIndex((val) => val.name.toLowerCase() === account?.name.toLowerCase());
      dispatch(deleteAccountFile(account?.name.toLowerCase()));
      if (index > 0) {
        handleAccountSelect(accountList[index - 1].name);
      }
    }
  }

  useEffect(() => {
    if (accountList.length < 1)
      setDialogOpen(true);
  }, [accountList.length, dialogOpen])

  return (
    <Box sx={{ display: "flex", height: "100%", maxHeight: "100vh", flexDirection: "column" }}>
      <AppBar position="static" sx={{ height: "fit-content", flexGrow: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>Offline Investments</Typography>
          <Box>
            <Select value={account?.name || ''} onChange={(e) => handleAccountSelect(e.target.value)} sx={{ backgroundColor: "white", mr: 1 }} size='small'>
              {accountList.map((a) =>
                <MenuItem value={a.name}>{a.name}</MenuItem>
              )}
            </Select>
            <IconButton onClick={() => setDialogOpen(true)}><AddIcon /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {account &&
        <Outlet />
      }
      <Box sx={{ display: "flex", p: 2, justifyContent: "center", alignItems: "flex-end", flexGrow: 1 }}>
        <Button variant="contained" color='error' onClick={handleAccountDelete} sx={{ height: "fit-content" }}>Delete Account</Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); }}>
        <DialogTitle align='center'>New Account</DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <TextField value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} label="Name" sx={{ m: 1 }} required />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant='contained' onClick={() => { handleAccountCreation(newAccountName) }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
