import React, { useContext, useRef, useState } from 'react'
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import { modalStyle } from '@/styles/modals'
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TagFilters from '../tagFilters';
import PrimaryButton from '@/utils/primaryButton';
import CancelButton from '@/utils/cancelButton';
import { ClientsContext } from '../../../contexts/clientsContext';
import { editDocument } from '../../cases/editDocument';

const EditDocumentFileModal = ({
    id,
    name: oldName,
    description: oldDescription,
    tags: oldTags,
    closeModal,
    refresh
}) => {

    const tagsReference = useRef()

    const assignedTags = oldTags ? oldTags.map(tag => tag.tag) : []

    const [documentName, setDocumentName] = useState(oldName ? oldName : '')
    const [description, setDescription] = useState(oldDescription ? oldDescription : '')
    const [loading, setLoading] = useState(false)

    const editDocumentFile = async () => {
        if (!documentName) {
            alert("Error. Set a document name")
            return
        }

        if (!description) {
            alert("Error. Set a document description")
            return
        }
        const tags = tagsReference.current.getTagList()

        if (tags.length <= 0) {
            alert("Error. Set some tags")
            return
        }

        setLoading(true)

        const editedData = {
            id,
            tags: tags,
            name: documentName,
            description: description
        }


        const response = await editDocument(editedData)

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
                    Edit Template File
                </Typography>
                < div style={{ marginTop: 15 }}>
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
                </div>

                <div style={{ marginTop: 15 }}>
                    <Typography variant="h6" color="primary">
                        Tags
                    </Typography>

                    <TagFilters
                        isFilter={false}
                        isClearable={false}
                        assignedTags={assignedTags}
                        ref={tagsReference}
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
                        label='Save'
                        key={1}
                        onClick={editDocumentFile}
                        loading={loading}
                    />
                </div>

            </Box>
        </Modal >
    )
}

export default EditDocumentFileModal