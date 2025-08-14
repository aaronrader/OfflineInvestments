import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect } from "react";

import { NavLink } from "react-router";

export const Summary = (props) => {
    const currencyFormatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD"
    });

    useEffect(() => {
        console.log(props);
    }, [])

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">Summary of {props.account.name}</Typography>
            <Typography variant="h5">As of {new Date(Date.now()).toDateString()}</Typography>
            <TableContainer component={Paper} sx={{ width: "33%" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ticket</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Avg Price</TableCell>
                            <TableCell>Book Cost</TableCell>
                            <TableCell>Market Cost</TableCell>
                            <TableCell>Gain/Loss</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.account.holdings.map((holding) => (
                            <TableRow key={holding.security.ticket}>
                                <TableCell><NavLink to="/security" state={{security: holding.security}}>{holding.security.ticket}</NavLink></TableCell>
                                <TableCell>{holding.quantity}</TableCell>
                                <TableCell>{currencyFormatter.format(holding.avgPrice)}</TableCell>
                                <TableCell>{currencyFormatter.format(holding.bookCost)}</TableCell>
                                <TableCell>{currencyFormatter.format(holding.marketCost ?? 0)}</TableCell>
                                <TableCell>{currencyFormatter.format(holding.marketCost - holding.bookCost)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}