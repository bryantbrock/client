import React from 'react'
import Card from '@mui/material/Card';
import { Typography } from '@mui/material'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { cardsStyles } from '@/styles/cards';
import Image from 'next/image'
import { useRouter } from 'next/router';
import PrimaryButton from '@/utils/primaryButton';
import SecondaryButton from '@/utils/secondaryButton';


const SimpleCard = (props) => {
    const router = useRouter();

    const {
        image: img,
        name,
        description,
        links
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
                            width="100"
                            height="100"
                        />
                    </div>
                }


                <Typography
                    variant="body2"
                    style={{ textAlign: "center" }}
                >
                    {description}
                </Typography>
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
                        <div key={index} style={{ width: "100%" }}>
                            {
                                button.button_type === "primary" &&
                                <PrimaryButton
                                    key={index}
                                    label={button.label}
                                    width='full'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (button.path.includes("https://")) {
                                            window.open(button.path, '_blank', 'noopener,noreferrer');
                                        } else {
                                            router.push(button.path)
                                        }
                                    }}
                                />
                            }

                            {
                                button.button_type === 'secondary' &&
                                <SecondaryButton
                                    key={index}
                                    label={button.label}
                                    width='full'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (button.path.includes("https://")) {
                                            window.open(button.path, '_blank', 'noopener,noreferrer');
                                        } else {
                                            router.push(button.path)
                                        }
                                    }}
                                />
                            }
                        </div>
                    ))
                }
            </CardActions>
        </Card >
    )
}

export default SimpleCard
