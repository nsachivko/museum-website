import { useAtom } from 'jotai'
import { favouritesAtom } from '../store'
import CustomCard from "../components/Card"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ArtworkCard from "../components/ArtworkCard"

const Favourities = () => {
    const [favourites, setFavourites] = useAtom(favouritesAtom)
    if (!favourites) return null

    return (
        !!favourites && favourites.length > 0 ?
            <Container>
                <Row>
                    {favourites.map((objectId, key) => {
                        return (
                            <Col lg={3} key={key} className="m-5" >
                                <ArtworkCard objectId={objectId} />
                            </Col>
                        )
                    })}
                </Row>
            </Container>

            : <CustomCard children={
                <div>
                    <h1>Nothing Here</h1>
                    <br />
                    <p>Try searching for something else.</p>
                </div>
            } />)
}

export default Favourities