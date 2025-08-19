import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useLocation } from "react-router";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { PriceDialog } from "../components/priceDialog";
import { updateMarketValue } from "../code/securitySlice";

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
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">{security.ticket}</Typography>
            <Typography variant="h5">{security.longName} ({security.type})</Typography>
            <Typography variant="h5" onClick={() => setDialogOpen(true)}>{currencyFormatter.format(security.marketValue)}</Typography>
            <TableContainer component={Paper} sx={{ minWidth: "33%", maxWidth: "66%" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Fees</TableCell>
                            <TableCell>Total</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <PriceDialog security={security} open={dialogOpen} onSave={updateValue} />
        </Box>
    )
}