import { Box, Button, Modal, Paper, TextField, Typography } from "@mui/material"
import { useReducer } from "react";

export const TradeModal = (props) => {
    const initialState = {
        quantity: "",
        price: "",
        fees: "",
        validationError: {
            quantity: false,
            unitPrice: false,
            fees: false
        },
    }
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const valdiateState = () => {
        let newError = initialState.validationError;
        if (isNaN(Number.parseInt(state.quantity))) newError.quantity = true;
        if (isNaN(Number.parseFloat(state.price))) newError.unitPrice = true;
        if (isNaN(Number.parseFloat(state.fees))) newError.fees = true;
        setState({validationError: newError});
        return !newError.quantity && !newError.unitPrice && !newError.fees;
    }

    const handleSave = (e) => {
        e.preventDefault();
        if (!valdiateState())
            return false;

        setState(initialState);
        
        props.onSave({
            id: (Math.random() * 10000).toFixed(0),
            dateTime: Date.now(),
            type: props.type,
            security: props.ticket,
            quantity: Number.parseInt(state.quantity),
            price: Number.parseFloat(state.price),
            fees: Number.parseFloat(state.fees)
        })
    }

    return (
        <Modal open={props.open} onClose={props.onClose} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <form>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }} component={Paper}>
                    <Typography variant="h3" align="center">{props.type === "BUY" ? "Buying" : "Selling"} {props.ticket}</Typography>
                    <TextField
                        label="Quantity"
                        sx={{ my: 1, width: "10rem" }}
                        value={state.quantity}
                        onChange={(e) => setState({ quantity: e.target.value })}
                        error={state.validationError.quantity}
                        required
                    />
                    <TextField
                        label="Unit Price ($)"
                        sx={{ my: 1, width: "10rem" }}
                        value={state.price}
                        onChange={(e) => setState({ price: e.target.value })}
                        error={state.validationError.unitPrice}
                        required
                    />
                    <TextField
                        label="Fees ($)"
                        sx={{ my: 1, width: "10rem" }}
                        value={state.fees}
                        onChange={(e) => setState({ fees: e.target.value })}
                        error={state.validationError.fees}
                        required
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
    )
}