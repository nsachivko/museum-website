import useSWR from "swr"
import Error from "next/error"
import { useState, useEffect } from "react"
import Loading from "./Loading"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Link from "next/link"
import LongText from "./LongText"
import NextImage from "next/image"

const ArtworkCard = ({ objectId }) => {
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`)
    const [loading, setLoading] = useState(true)
    const [object, setObject] = useState()

    useEffect(() => {
        if (!!data) {
            setObject(data)
        }
        setLoading(false)

    }, [data])

    return (
        <>
            {loading ? <Loading /> :
                !!!error ?
                    <Card
                        bg={"ligth"}
                        border={"light"}
                        style={{
                            width: '20rem',
                        }} >
                        <div style={{ position: 'relative', width: '20rem', height: '25rem' }}>
                            <NextImage
                                layout="fill"
                                objectFit="none"
                                variant="top"
                                placeholder="blur"
                                blurDataURL={object?.primaryImageSmall || "https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d"}
                                src={object?.primaryImageSmall || "https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d"}
                            />
                        </div>

                        <Card.Body>
                            <Card.Title className="text-primary">{object?.title ? object.title : "N/A"}</Card.Title>
                            <Card.Text>
                                <strong>Date:</strong> {object?.objectDate ? object.objectDate : "N/A"}
                                <br />
                                <strong>Classification:</strong> {object?.classification ? object.classification : "N/A"}
                                <br />
                                <strong>Medium:</strong> {object?.medium ? <LongText text={object?.medium} /> : "N/A"}
                            </Card.Text>
                            <Link href={`/artwork/${objectId}`} passHref>
                                <Button variant="primary">ID: {object?.objectID}</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    : <Error statusCode={404} />
            }
        </>
    )
}

export default ArtworkCard