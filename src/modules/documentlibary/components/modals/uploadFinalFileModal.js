import React, { useContext, useMemo, useRef, useState } from 'react'
import { modalStyle } from '@/styles/modals'
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useDropzone } from 'react-dropzone'
import { original_green } from '@/utils/customTheme';
import PrimaryButton from '@/utils/primaryButton';
import CancelButton from '@/utils/cancelButton';
import Upload from '../../../../pages/upload';
import { ClientsContext } from '../../../contexts/clientsContext';
import { createNewDocument } from '../../cases/createNewDocument';


const UploadFinalFileModal = ({
    closeModal,
    templateVersion,
    finalVersion,
    parentID,
    refresh
}) => {
    const { selectedClient } = useContext(ClientsContext)

    const uploadDocumentReference = useRef()

    const newFinalVersion = finalVersion ? finalVersion + 1 : 1
    // let previousTemplateVersions = []

    // for (let i = 1; i <= templateVersion; i++) {
    //     previousTemplateVersions.push({ value: i, label: i });
    // }

    // const [templateDocumentVersion, setTemplateDocumentVersion] = useState(previousTemplateVersions)
    // const [selectedTemplateDocumentVersion, setSelectedTemplateDocumentVersion] = useState(templateVersion)
    const [loading, setLoading] = useState(false)


    const uploadNewFinalFile = async () => {

        setLoading(true)
        const path = await uploadDocumentReference.current.uploadDocument()

        if (!path) {
            alert("Error. Please enter a document.")
            setLoading(false)
            return
        }
        const uploadData = {
            is_template: false,
            client_id: selectedClient.id,
            parent_id: parentID,
            version: newFinalVersion,
            path: path.path
        }

        const response = await createNewDocument(uploadData)
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
                    Upload Final File
                </Typography>



                {/* <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Template Document Version
                    </Typography>

                    <TextField
                        id="outlined-select-template-version"
                        required
                        fullWidth
                        select
                        label="Select"
                        value={selectedTemplateDocumentVersion}
                        onChange={(e) => setSelectedTemplateDocumentVersion(e.target.value)}
                        helperText="Please select your template version"
                    >
                        {previousTemplateVersions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div> */}

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
                        Assigned Version: {newFinalVersion}
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
                        onClick={uploadNewFinalFile}
                        loading={loading}
                    />
                </div>
            </Box>
        </Modal>
    )
}

export default UploadFinalFileModal