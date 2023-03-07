import { Button } from '@mui/material'
import React from 'react'

const CancelButton = ({ onClick, width }) => {
    return (
        <Button
            fullWidth={width === 'full' ? true : false}
            variant="contained"
            sx={{
                backgroundColor: "gray"
            }}
            style={{
                marginBottom: 10,
                color: "white",
                borderRadius: 12
            }}
            onClick={onClick}
        >
            Cancel
        </Button>
    )
}
export default CancelButton