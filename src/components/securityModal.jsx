import { Box, Button, Modal, Paper, TextField, Typography } from "@mui/material"
import { useReducer } from "react";

export const SecurityModal = (props) => {
    const initialState = {
        ticket: "",
        longName: "",
        marketPrice: "",
        error: false
    }
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const valdiateState = () => {
        let error = false;
        if (state.marketPrice.length > 0 && isNaN(Number.parseFloat(state.marketPrice))) error = true;
        setState({ error: error });
        return !error;
    }

    const handleSave = (e) => {
        e.preventDefault();
        if (!valdiateState())
            return false;

        setState(initialState);

        let price = Number.parseFloat(state.marketPrice);

        props.onSave({
            ticket: state.ticket,
            longName: state.longName,
            marketPrice: isNaN(price) ? 0 : price,
        })
    }

    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }} component={Paper}>
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
                    <TextField
                        label="Market Price ($)"
                        sx={{ my: 1, width: "10rem" }}
                        value={state.marketPrice}
                        onChange={(e) => setState({ marketPrice: e.target.value })}
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