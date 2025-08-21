import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, InputAdornment, InputLabel } from "@mui/material"
import { useState } from "react"

export const PriceDialog = (props) => {
    const [value, setValue] = useState(props.security.marketValue);

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle align="center">{props.security.ticket} Price Update</DialogTitle>
            <DialogContent sx={{ p: 1 }}>
                <FormControl sx={{ m: 1 }}>
                    <InputLabel htmlFor="update-price-field">Cost</InputLabel>
                    <FilledInput
                        id="update-price-field"
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        inputProps={{ sx: { py: 2 } }}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button variant="contained" onClick={() => props.onSave(value)}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}