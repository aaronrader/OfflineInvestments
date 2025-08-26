import { Autocomplete, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"

import { NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useReducer } from "react";

import { recordTrade, saveAccountToFile } from "../code/accountSlice";
import { addSecurity, saveSecurityListToFile } from "../code/securitySlice";

import { SecurityModal } from "../components/securityModal";
import { TradeModal } from "../components/tradeModal";

export const SummaryPage = (props) => {
    const currencyFormatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD"
    });
    const account = useSelector(state => state.account.selected);
    const securityList = useSelector(state => state.securityList.list);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const initialState = {
        tradeModalOpen: false,
        securityModalOpen: false,
        ticketSearchValue: false,
        tradeType: "BUY",
        security: {}
    }
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const recordNewTrade = (trade) => {
        dispatch(recordTrade(trade));
        dispatch(saveAccountToFile());
        setState({ tradeModalOpen: false });
    }

    const addNewSecurity = (security) => {
        dispatch(addSecurity(security));
        dispatch(saveSecurityListToFile());
        setState({ securityModalOpen: false });
    }

    useEffect(() => {
        if (state.ticketSearchValue) {
            navigate("/security", { state: { security: state.ticketSearchValue } })
        }
    }, [state.ticketSearchValue, navigate])

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">Summary of {account.name}</Typography>
            <Typography variant="h5">As of {new Date(Date.now()).toDateString()}</Typography>
            <Box display="flex">
                <Autocomplete
                    options={securityList.toSorted((a, b) => a.ticket.localeCompare(b.ticket)).map((s) => ({ label: `(${s.ticket}) ${s.longName}`, ticket: s.ticket }))}
                    renderInput={(params) => <TextField {...params} label="Ticket" />}
                    onChange={(e, val) => {
                        setState({ ticketSearchValue: val.ticket });
                    }}
                    autoHighlight
                    clearOnBlur
                    clearOnEscape
                    sx={{ my: 1, mr: 1, width: "20rem" }}
                />
                <Button variant="contained" size="small" sx={{ my: 2, ml: 1 }} onClick={() => setState({ securityModalOpen: true })}>Add</Button>
            </Box>
            <TableContainer component={Paper} sx={{ minWidth: "550px", maxWidth: "66%" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ textAlign: "center" }}>Ticket</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>Qty</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>Avg Price</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>Book Cost</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>Market Cost</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>Gain/Loss</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {account.holdings?.map((holding) => {
                            const security = securityList.find((val) => val.ticket === holding.security);
                            return (
                                <TableRow key={security.ticket}>
                                    <TableCell><NavLink to="/security" state={{ security: security.ticket }}>{security.ticket}</NavLink></TableCell>
                                    <TableCell>{holding.quantity}</TableCell>
                                    <TableCell>{currencyFormatter.format(holding.avgPrice)}</TableCell>
                                    <TableCell>{currencyFormatter.format(holding.bookCost)}</TableCell>
                                    <TableCell>{currencyFormatter.format(security.marketValue * holding.quantity ?? 0)}</TableCell>
                                    <TableCell>{currencyFormatter.format(security.marketValue * holding.quantity - holding.bookCost)}</TableCell>
                                    <TableCell sx={{ display: "flex", flexDirection: "column", p: 1 }}>
                                        <Button variant="contained" size="small" sx={{ mb: 0.25, maxWidth: "50px" }} onClick={() => { setState({ tradeType: "BUY", tradeModalOpen: true, security: security }) }}>Buy</Button>
                                        <Button variant="contained" size="small" sx={{ mt: 0.25, maxWidth: "50px" }} onClick={() => { setState({ tradeType: "SELL", tradeModalOpen: true, security: security }) }}>Sell</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <SecurityModal open={state.securityModalOpen} onClose={() => setState({ securityModalOpen: false })} onSave={addNewSecurity} />
            <TradeModal open={state.tradeModalOpen} onClose={() => setState({ tradeModalOpen: false })} type={state.tradeType} ticket={state.security.ticket} onSave={recordNewTrade} />
        </Box>
    )
}