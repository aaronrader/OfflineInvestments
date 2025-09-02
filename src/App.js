import './App.css';

import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { createNewAccount, deleteAccountFile, setSelectedAccount, updateAccountList } from './code/accountSlice.js';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const navigate = useNavigate();
  const account = useSelector(state => state.account.selected);
  const accountList = useSelector(state => state.account.list);
  const dispatch = useDispatch();

  const [newAccountName, setNewAccountName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(true);

  const handleAccountSelect = (e) => {
    dispatch(setSelectedAccount(e.target.value));
  }

  const handleAccountCreation = () => {
    dispatch(createNewAccount(newAccountName));
    dispatch(updateAccountList());
    setNewAccountName("");
    setDialogOpen(false);
  }

  const handleAccountDelete = () => {
    const index = accountList.findIndex((val) => val.toLowerCase() === account?.name.toLowerCase());
    dispatch(deleteAccountFile(account?.name.toLowerCase()));
    if (index > 0) {
      dispatch(setSelectedAccount(accountList[index - 1]));
    }
  }

  useEffect(() => {
    if (accountList.length > 0) {
      dispatch(setSelectedAccount(accountList[accountList.length - 1]));
    }

    if (accountList.length < 1) {
      setDialogOpen(true);
      setDeleteDisabled(true);
    } else
      setDeleteDisabled(false);
  }, [accountList]);

  return (
    <Box sx={{ display: "flex", height: "100%", maxHeight: "100vh", flexDirection: "column" }}>
      <AppBar position="static" sx={{ height: "fit-content", flexGrow: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>Offline Investments</Typography>
          <Box>
            <Select value={account?.name || ''} onChange={handleAccountSelect} sx={{ backgroundColor: "white", mr: 1 }} size='small'>
              {accountList.map((a) =>
                <MenuItem value={a}>{a}</MenuItem>
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
        <Button variant="contained" color='error' disabled={deleteDisabled} onClick={() => setDeleteDialogOpen(true)} sx={{ height: "fit-content" }}>Delete Account</Button>
      </Box>

      {/* New Account Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle align='center'>New Account</DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          <TextField value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} label="Name" sx={{ m: 1 }} required />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant='contained' onClick={handleAccountCreation}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle align='center'>This action cannot be undone.</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {account?.name}?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant='contained' color='error' onClick={handleAccountDelete}>I'm Sure</Button>
          <Button variant='contained' onClick={() => setDeleteDialogOpen(false)}>Nevermind</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
