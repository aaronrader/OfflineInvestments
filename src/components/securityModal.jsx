import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, TextField, Typography } from "@mui/material"

import { useReducer } from "react";

export const SecurityModal = (props) => {
    const initialState = {
        ticket: "",
        longName: "",
        type: "Stock",
        marketValue: "",
        error: false
    }
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const valdiateState = () => {
        let error = false;
        if (state.marketValue.length > 0 && isNaN(Number.parseFloat(state.marketValue))) error = true;
        setState({ error: error });
        return !error;
    }

    const handleSave = (e) => {
        e.preventDefault();
        if (!valdiateState())
            return false;

        setState(initialState);

        let price = Number.parseFloat(state.marketValue);

        props.onSave({
            ticket: state.ticket,
            longName: state.longName,
            type: state.type,
            marketValue: isNaN(price) ? 0 : price,
        })
    }

    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }} component={Paper}>
                    <Typography variant="h3" align="center">Add New Security</Typography>
                    <TextField
                        label="Ticket"
                        sx={{ my: 1, width: "10rem" }}
                        value={state.ticket}
                        onChange={(e) => setState({ ticket: e.target.value })}
                        required
                    />
                    <TextField
                        label="Long Name"
                        sx={{ my: 1, width: "10rem" }}
                        value={state.longName}
                        onChange={(e) => setState({ longName: e.target.value })}
                        required
                    />
                    <FormControl>
                        <InputLabel htmlFor="f-security-type-select">Type</InputLabel>
                        <Select
                            labelId="f-security-type-select"
                            label="Type"
                            sx={{ my: 1, width: "10rem" }}
                            value={state.type}
                            onChange={(e) => setState({type: e.target.value})}
                        >
                            <MenuItem value="Stock">Stock</MenuItem>
                            <MenuItem value="ETF">ETF</MenuItem>
                            <MenuItem value="Bond">Bond</MenuItem>
                            <MenuItem value="GIC">GIC</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Market Price ($)"
                        sx={{ my: 1, width: "10rem" }}
                        value={state.marketValue}
                        onChange={(e) => setState({ marketValue: e.target.value })}
                        error={state.error}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Box>
            </form>
        </Modal>
    );
}