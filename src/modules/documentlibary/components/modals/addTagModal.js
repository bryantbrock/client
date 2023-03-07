import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { modalStyle } from '@/styles/modals';
import { Chip, CircularProgress, Typography } from '@mui/material';
import { chipStyles } from '@/styles/chips';
import PrimaryButton from '@/utils/primaryButton';

const AddTagModal = (props) => {
    const handleClose = () => props.closeModal()

    const [loading, setLoading] = useState(true)
    const [tagCategories, setTagCategories] = useState([])

    useEffect(() => {
        const retrieveTags = async () => {
            await fetch('/api/library/tag_categories', { method: 'GET' })
                .then(res => res.json())
                .then(categories => {

                    for (let i = 0; i < categories.length; i++) {
                        for (let j = 0; j < categories[i].tags.length; j++) {
                            categories[i].tags[j].isSelected = false
                        }
                    }

                    setTagCategories(categories)
                    setLoading(false)
                })
                .catch(error => {
                    // console.log(error)
                    setTagCategories([])
                })
        }

        retrieveTags()
    }, [])

    const handleSelectTag = (tag) => {

        // Copy tag categories without reference
        let newTagCategories = tagCategories.slice()

        // iterate over categories
        for (let i = 0; i < newTagCategories.length; i++) {
            if (newTagCategories[i].id === tag.category_id) {
                // iterate over tags under specific category
                for (let j = 0; j < newTagCategories[i].tags.length; j++) {
                    if (newTagCategories[i].tags[j].id === tag.id) {
                        // Toggle isSelected
                        newTagCategories[i].tags[j].isSelected = !newTagCategories[i].tags[j].isSelected
                    }
                }
            }
        }

        setTagCategories(newTagCategories)
    }

    const addTags = () => {
        let selectedTags = []

        for (let i = 0; i < tagCategories.length; i++) {
            for (let j = 0; j < tagCategories[i].tags.length; j++) {
                tagCategories[i].tags[j].isSelected && selectedTags.push(tagCategories[i].tags[j])
            }
        }

        props.setTags(selectedTags)
        handleClose()
    }

    return (
        <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>

                <Typography
                    variant='h5'
                    color={'primary'}
                    align='center'
                >
                    Document Filter Tags
                </Typography>

                {
                    loading ?
                        <CircularProgress />
                        :
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row"
                                }}
                            >
                                {
                                    tagCategories.length > 0 && tagCategories.map(tagCategory => (
                                        <div
                                            key={tagCategory.id}
                                            style={{
                                                display: 'block',
                                                width: "14.25%"
                                            }}
                                        >
                                            <Typography
                                                variant='caption'
                                                color='primary'
                                                align='center'
                                            >
                                                {tagCategory.name}
                                            </Typography>

                                            {
                                                tagCategory.tags.length > 0 && tagCategory.tags.map(tag => (
                                                    <Chip
                                                        label={tag.name}
                                                        key={tag.id}
                                                        onClick={() => handleSelectTag(tag)}
                                                        style={tag.isSelected ? chipStyles.selectedChipFullWidth : chipStyles.unselectedChipFullWidth}
                                                    />
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>

                            <div
                                style={{
                                    marginTop: 15,
                                    justifyContent: "center",
                                    display: "flex"
                                }}
                            >
                                <PrimaryButton
                                    key={1}
                                    onClick={addTags}
                                    label='Done'
                                />
                            </div>
                        </>
                }
            </Box>
        </Modal >
    )
}

export default AddTagModal