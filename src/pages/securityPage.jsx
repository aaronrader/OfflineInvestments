import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { PriceDialog } from "../components/priceDialog";
import { saveSecurityListToFile, updateMarketValue } from "../code/securitySlice";
import { removeTrade, saveAccountToFile } from "../code/accountSlice";

export const SecurityPage = (props) => {
    const currencyFormatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD"
    });
    const account = useSelector(state => state.account.value);
    const securityList = useSelector(state => state.securityList.value);
    const dispatch = useDispatch();

    const location = useLocation();
    const ticket = location.state.security;

    const security = securityList.find((sec) => sec.ticket === ticket);
    const trades = account.ledger.trades.filter((trade) => trade.security === security.ticket);

    const [dialogOpen, setDialogOpen] = useState(false);

    const updateValue = (newValue) => {
        dispatch(updateMarketValue({
            ...security,
            marketValue: newValue
        }))
        setDialogOpen(false);
        dispatch(saveSecurityListToFile())
    }

    const deleteTrade = (trade) => {
        dispatch(removeTrade(trade.id))
        dispatch(saveAccountToFile())
        window.location.reload(false);
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">{security.ticket}</Typography>
            <Typography variant="h5">{security.longName} ({security.type})</Typography>
            <Typography variant="h5" onClick={() => setDialogOpen(true)}>{currencyFormatter.format(security.marketValue)}</Typography>
            <TableContainer component={Paper} sx={{ minWidth: "33%", maxWidth: "66%" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
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
                                <TableCell>{trade.dateTime.toLocaleDateString()}</TableCell>
                                <TableCell>{trade.quantity}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.price)}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.fees)}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.total)}</TableCell>
                                <TableCell className="table-cell-icon"><IconButton variant="contained" size="small" onClick={() => deleteTrade(trade)}><DeleteIcon /></IconButton></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <PriceDialog security={security} open={dialogOpen} onSave={updateValue} />
        </Box>
    )
}