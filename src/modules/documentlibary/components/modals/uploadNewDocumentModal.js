import React, { useRef, useState } from 'react'
import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';
import { modalStyle } from '@/styles/modals'
import TextField from '@mui/material/TextField';
import TagFilters from '../../components/tagFilters';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useDropzone } from 'react-dropzone'
import { original_green } from '@/utils/customTheme';
import PrimaryButton from '@/utils/primaryButton';
import CancelButton from '@/utils/cancelButton';
import { createNewDocument } from '../../cases/createNewDocument';
import Upload from '../../../../pages/upload';

const UploadNewDocumentModal = ({ closeModal, refresh }) => {

    const uploadDocumentReference = useRef()
    const tagsReference = useRef()

    const [loading, setLoading] = useState(false)

    const [documentName, setDocumentName] = useState('')
    const [description, setDescription] = useState('')
    const [documentType, setDocumentType] = useState('Template Document')


    const uploadNewDocumentFile = async () => {


        if (!documentName) {
            alert("Error. Please set a document name.")
            return
        }

        if (!description) {
            alert("Error. Please set a document description.")
            return
        }


        let tags = tagsReference.current.getTagList()

        if (tags.length <= 0) {
            alert("Error. Please set at least one tag.")
            return
        }

        setLoading(true)
        const path = await uploadDocumentReference.current.uploadDocument()

        if (!path) {
            alert("Error. Please enter a document.")
            setLoading(false)
            return
        }

        const documentData = {
            name: documentName,
            description,
            is_template: documentType === 'Template Document' ? true : false,
            parent_id: null,
            client_id: null,
            path: path.path,
            tags
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
                    Upload New Document File
                </Typography>

                <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Pretty Filename
                    </Typography>

                    <TextField
                        id="outlined-document-name"
                        required
                        fullWidth
                        label="Document name"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        helperText="Please write a name for the document"
                    />

                    <Typography
                        variant='caption'
                    >
                        Assigned Version: 1
                    </Typography>
                </div>

                <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Upload File
                    </Typography>

                    <Upload
                        isChild={true}
                        ref={uploadDocumentReference}
                    />
                </div>

                <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Tags
                    </Typography>

                    <TagFilters
                        isFilter={false}
                        isClearable={false}
                        ref={tagsReference}
                        assignedTags={[]}
                    />
                </div>

                <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Description
                    </Typography>

                    <TextField
                        id="outlined-document-description"
                        required
                        fullWidth
                        multiline
                        rows={3}
                        inputProps={{ maxLength: 256 }}
                        label="Document description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        helperText="Please write a description"
                    />
                </div>

                <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Document Type
                    </Typography>

                    <FormControl required>
                        {/* <FormLabel id="buttons-group-label">Gender</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e, value) => setDocumentType(value)}
                            value={documentType}
                        >
                            <FormControlLabel value="Template Document" control={<Radio />} label="Template Document" />
                            <FormControlLabel value="Non-Template Document" control={<Radio />} label="Non-Template Document" />
                        </RadioGroup>
                    </FormControl>
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
                        key={1}
                        label='Upload File'
                        onClick={uploadNewDocumentFile}
                        loading={loading}
                    />
                </div>
            </Box>
        </Modal>
    )
}

export default UploadNewDocumentModal