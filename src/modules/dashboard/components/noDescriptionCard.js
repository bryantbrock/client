import React from 'react'
import Card from '@mui/material/Card';
import { Typography } from '@mui/material'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { cardsStyles } from '@/styles/cards';
import Image from 'next/image';

const NoDescriptionCard = (props) => {

    const {
        image: img,
        name,
        paths
    } = props

    return (
        <Card sx={cardsStyles.cardContainer} elevation={10}>
            <CardContent>
                <Typography
                    variant="h5"
                    style={{
                        textAlign: "center",
                    }}
                    color="primary"
                >
                    {name}
                </Typography>

                {
                    img &&
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                        <Image
                            src={img}
                            alt="me"
                            width="250"
                            height="200"
                        />
                    </div>
                }
            </CardContent>

            <CardActions
                disableSpacing={true}
                style={{
                    flexDirection: "column",
                    position: "absolute",
                    bottom: 0,
                    justifyContent: "center",
                    display: "flex",
                    width: "95%"
                }}>
                {
                    links.map((button, index) => (
                        <Button
                            size="large"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            style={{
                                marginBottom: 10,
                            }}
                            key={index}
                        >{button.label}</Button>
                    ))
                }
            </CardActions>
        </Card >
    )
}

export default NoDescriptionCard