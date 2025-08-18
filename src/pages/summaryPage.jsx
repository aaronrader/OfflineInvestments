import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Link, NavLink } from "react-router";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { TradeModal } from "../components/tradeModal";
import { recordTrade } from "../code/accountSlice";
import { addSecurity } from "../code/securitySlice";
import { SecurityModal } from "../components/securityModal";

export const SummaryPage = (props) => {
    const currencyFormatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD"
    });
    const account = useSelector(state => state.account.value);
    const securityList = useSelector(state => state.securityList.value);
    const dispatch = useDispatch();

    const [tradeModalOpen, setTradeModalOpen] = useState(false);
    const [securityModalOpen, setSecurityModalOpen] = useState(false);

    const recordNewTrade = (trade) => {
        dispatch(recordTrade(trade));
        setTradeModalOpen(false);
    }

    const addNewSecurity = (security) => {
        dispatch(addSecurity(security));
        setSecurityModalOpen(false);
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">Summary of {account.name}</Typography>
            <Typography variant="h5">As of {new Date(Date.now()).toDateString()}</Typography>
            <Box>
                <Button variant="contained" sx={{ my: 1, mr: 1 }} onClick={() => setSecurityModalOpen(true)}>New Security</Button>
                <Button variant="contained" sx={{ my: 1, ml: 1 }} onClick={() => setTradeModalOpen(true)}>Record Trade</Button>
            </Box>
            <TableContainer component={Paper} sx={{ minWidth: "33%", maxWidth: "66%" }}>
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
                        {account.holdings.map((holding) => {
                            const security = securityList.find((val) => val.ticket === holding.security);

                            return (
                                <TableRow key={security.ticket}>
                                    <TableCell><Link to="/security" state={{ security: security.ticket }}>{security.ticket}</Link></TableCell>
                                    <TableCell>{holding.quantity}</TableCell>
                                    <TableCell>{currencyFormatter.format(holding.avgPrice)}</TableCell>
                                    <TableCell>{currencyFormatter.format(holding.bookCost)}</TableCell>
                                    <TableCell>{currencyFormatter.format(security.marketValue * holding.quantity ?? 0)}</TableCell>
                                    <TableCell>{currencyFormatter.format(security.marketValue * holding.quantity - holding.bookCost)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TradeModal open={tradeModalOpen} onClose={() => setTradeModalOpen(false)} selectedTicket={null} tickets={securityList.map((s) => s.ticket)} onSave={recordNewTrade} />
            <SecurityModal open={securityModalOpen} onClose={() => setSecurityModalOpen(false)} onSave={addNewSecurity}/>
        </Box>
    )
}