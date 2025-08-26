import { Box, Button, Modal, Paper, TextField, Typography } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useReducer } from "react";
import dayjs from "dayjs";

export const TradeModal = (props) => {
    const initialState = {
        date: dayjs(),
        quantity: "",
        price: "",
        fees: 0.0,
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
            dateTime: state.date.toISOString(),
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
                    <Typography variant="h4" align="center" mb={2}>{props.type === "BUY" ? "Buying" : "Selling"} {props.ticket}</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={state.date}
                            onChange={(val) => {setState({date: val})}}
                            sx={{ my: 1, width: "10rem" }}
                        />
                    </LocalizationProvider>
                    <Box>
                        <TextField
                            label="Quantity"
                             sx={{ my: 1, mr: 1, width: "10rem" }}
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
                    </Box>
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