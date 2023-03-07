import React, { useMemo, useRef, useState } from 'react'
import { modalStyle } from '@/styles/modals'
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone'
import { original_green } from '@/utils/customTheme';
import PrimaryButton from '@/utils/primaryButton';
import CancelButton from '@/utils/cancelButton';
import Upload from '../../../../pages/upload';
import { createNewDocument } from '../../cases/createNewDocument';

const UploadTemplateDocumentFile = ({
    name,
    description,
    is_template,
    version,
    parent_id,
    refresh,
    closeModal
}) => {
    const uploadDocumentReference = useRef()

    const [loading, setLoading] = useState(false)

    const uploadNewVersionOfDocumentFile = async () => {
        setLoading(true)
        const path = await uploadDocumentReference.current.uploadDocument()

        if (!path) {
            alert("Error. Please enter a document.")
            setLoading(false)
            return
        }

        const documentData = {
            name: name,
            description: description,
            is_template: is_template,
            parent_id: parent_id,
            client_id: null,
            path: path.path,
            version: version + 1
        }

        const response = await createNewDocument(documentData)
        setLoading(false)

        if (response.success) {
            refresh()
            closeModal()
        }

        if (!response.success) {
            alert("Error. Try again later.")
        }
    }
    return (
        <Modal
            open={true}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography
                    align='center'
                    color='primary'
                    variant='h4'
                >
                    Upload Template Document File
                </Typography>


                <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Upload File
                    </Typography>
                    <Upload
                        isChild={true}
                        ref={uploadDocumentReference}
                    />
                    <Typography
                        variant='caption'
                    >
                        Assigned Version: {version + 1}
                    </Typography>
                </div>

                <div
                    style={{
                        marginTop: 15,
                        justifyContent: "space-between",
                        display: "flex",

                    }}
                >
                    <CancelButton
                        onClick={closeModal}
                    />
                    <PrimaryButton
                        label='Done'
                        key={1}
                        onClick={uploadNewVersionOfDocumentFile}
                        loading={loading}
                    />
                </div>
            </Box>
        </Modal>

    )
}

export default UploadTemplateDocumentFile