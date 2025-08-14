import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useState } from "react"
import { useLocation } from "react-router";

export const Security = (props) => {
    const currencyFormatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD"
    });

    const location = useLocation();
    const security = location.state.security;

    const [trades, setTrades] = useState(props.account.ledger.trades.filter((trade) => trade.security.ticket === security.ticket));

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">{security.ticket}</Typography>
            <Typography variant="h5">{security.longName}</Typography>
            <TableContainer component={Paper} sx={{ width: "33%" }}>
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
                            <TableRow>
                                <TableCell>{trade.dateTime.toDateString()}</TableCell>
                                <TableCell>{trade.quantity}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.price)}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.fees)}</TableCell>
                                <TableCell>{currencyFormatter.format(trade.total)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}