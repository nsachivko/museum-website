import useSWR from "swr"
import Error from "next/error"
import { useState, useEffect } from "react"
import Loading from "./Loading"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useAtom } from 'jotai'
import { favouritesAtom } from '../store'
import { addToFavourites, removeFromFavourites } from '../lib/userData'

const ArtworkCardDetail = ({ objectId }) => {
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`)
    const [loading, setLoading] = useState(true)
    const [object, setObject] = useState()
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)
    const [showAdded, setShowAdded] = useState(false)

    useEffect(() => {
        if (!!data) {
            setObject(data)
        }
        setLoading(false)

        favouritesList.forEach(id => {
            if (id === objectId) {
                setShowAdded(true)
            }
        })
    }, [data])

    useEffect(() => {
        setShowAdded(favouritesList?.includes(objectId))
    }, [favouritesList])

    const favouritesClicked = async () => {
        if (!showAdded) {
            await addToFavourites(objectId)
            setFavouritesList(current => [...current, objectId])
        }
        else {
            await removeFromFavourites(objectId)
            setFavouritesList(current => current.filter(fav => fav != objectId))
        }
        setShowAdded(!showAdded)
    }

    return (
        <>
            {loading ? <Loading /> :
                !!!error ?
                    <Card
                        bg={"ligth"}
                        border={"light"}
                    >
                        {!!object?.primaryImage &&
                            <img
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                variant="top"
                                className="img-fluid"
                                src={object?.primaryImage}

                            />}
                        <Card.Body>
                            <Card.Title className="text-primary">{object?.title ? object.title : "N/A"}</Card.Title>
                            <Card.Text>
                                <strong>Date:</strong> {object?.objectDate ? object.objectDate : "N/A"}
                                <br />
                                <strong>Classification:</strong> {object?.classification ? object.classification : "N/A"}
                                <br />
                                <strong>Medium:</strong> {object?.medium ? object?.medium : "N/A"}
                                <br />
                                <br />
                                <strong>Artist:</strong> {object?.artistDisplayName ? object?.artistDisplayName : "N/A"}
                                <br />
                                <strong>Credit Line:</strong> {object?.creditLine ? object?.creditLine : "N/A"}
                                <br />
                                <strong>Dimensions:</strong> {object?.dimensions ? object?.dimensions : "N/A"}
                            </Card.Text>
                            <Button variant="outline-primary" onClick={() => favouritesClicked()}>
                                + Favourite {showAdded ? "( added )" : ""}
                            </Button>
                        </Card.Body>
                    </Card>
                    : <Error statusCode={404} />
            }
        </>
    )
}

export default ArtworkCardDetail