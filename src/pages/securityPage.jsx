import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { PriceDialog } from "../components/priceDialog";
import { saveSecurityListToFile, updateMarketValue } from "../code/securitySlice";
import { recordTrade, removeTrade, saveAccountToFile } from "../code/accountSlice";
import { TradeModal } from "../components/tradeModal";

export const SecurityPage = (props) => {
    const currencyFormatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD"
    });
    const account = useSelector(state => state.account.selected);
    const securityList = useSelector(state => state.securityList.list);
    const dispatch = useDispatch();

    const location = useLocation();
    const security = securityList.find((sec) => sec.ticket === location.state.security);

    const trades = account.ledger.trades.filter((trade) => trade.security === security?.ticket);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tradeModalOpen, setTradeModalOpen] = useState(false);
    const [tradeType, setTradeType] = useState("BUY");
    const [selectedTrade, setSelectedTrade] = useState(null);

    const recordNewTrade = (trade) => {
        dispatch(recordTrade(trade));
        dispatch(saveAccountToFile())
        setTradeModalOpen(false);
    }
    const handleTradeDelete = () => {
        dispatch(removeTrade(selectedTrade.id))
        dispatch(saveAccountToFile())
        window.location.reload(false);
    }

    const updateValue = (newValue) => {
        dispatch(updateMarketValue({
            ...security,
            marketValue: Number.parseFloat(newValue)
        }))
        setDialogOpen(false);
        dispatch(saveSecurityListToFile())
    }

    return (
        <Box sx={{ maxHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">{security.ticket}</Typography>
            <Typography variant="h5">{security.longName} ({security.type})</Typography>
            <Typography variant="h5" sx={{ cursor: "pointer", p: 0.5, borderRadius: "5px", "&:hover": { boxShadow: "0px 0px 3px" } }} onClick={() => setDialogOpen(true)}>{currencyFormatter.format(security.marketValue)}</Typography>
            <Box>
                <Button variant="contained" sx={{ my: 1, mr: 1 }} onClick={() => { setTradeType("BUY"); setTradeModalOpen(true) }}>Buy</Button>
                <Button variant="contained" sx={{ my: 1, ml: 1 }} onClick={() => { setTradeType("SELL"); setTradeModalOpen(true) }}>Sell</Button>
            </Box>
            <TableContainer component={Paper} sx={{ minWidth: "550px", maxWidth: "66%", my: 5 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Fees</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell className="table-cell-icon"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trades.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell>{trade.type}</TableCell>
                                <TableCell>{trade.dateTime.toLocaleDateString()}</TableCell>
                                <TableCell>{trade.quantity}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.price)}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.fees)}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.total)}</TableCell>
                                <TableCell className="table-cell-icon">
                                    <IconButton variant="contained" size="small" onClick={() => { setSelectedTrade(trade); setDeleteDialogOpen(true) }}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <PriceDialog security={security} open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={updateValue} />
            <TradeModal open={tradeModalOpen} onClose={() => setTradeModalOpen(false)} type={tradeType} ticket={security.ticket} onSave={recordNewTrade} />

            {/* Delete Trade Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle align='center'>This action cannot be undone.</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this trade?</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button variant='contained' color='error' onClick={handleTradeDelete}>I'm Sure</Button>
                    <Button variant='contained' onClick={() => setDeleteDialogOpen(false)}>Nevermind</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}