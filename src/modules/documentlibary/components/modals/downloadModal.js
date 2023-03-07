import React from 'react'
import { modalStyle } from '@/styles/modals'
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import PrimaryButton from '@/utils/primaryButton';

const DownloadModal = (props) => {
    const handleClose = () => props.closeModal()
    return (
        <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>

                <Typography
                    align='center'
                    color='primary'
                    variant='h4'
                >
                    Download Complete
                </Typography>

                <div
                    style={{
                        marginTop: 15,
                        justifyContent: "center",
                        display: "flex"
                    }}
                >
                    <PrimaryButton
                        key={1}
                        onClick={handleClose}
                        label='Done'
                    />
                </div>
            </Box>
        </Modal>
    )
}

export default DownloadModal