import { Button, Dialog, DialogTitle, FilledInput, FormControl, InputAdornment, InputLabel } from "@mui/material"
import { useState } from "react"

export const PriceDialog = (props) => {
    const [value, setValue] = useState(props.security.marketValue);

    return (
        <Dialog open={props.open}>
            <DialogTitle align="center">{props.security.ticket} Price Update</DialogTitle>
            <FormControl sx={{marginX: 2}}>
                <InputLabel htmlFor="update-price-field">Cost</InputLabel>
                <FilledInput
                    id="update-price-field"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </FormControl>
            <Button onClick={() => props.onSave(value)}>Save</Button>
        </Dialog>
    )
}