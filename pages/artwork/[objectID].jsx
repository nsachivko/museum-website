import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pagination from 'react-bootstrap/Pagination'
import ArtworkCardDetail from "../../components/ArtworkCardDetail"
import { useRouter } from "next/router"

const ArtworkById = () => {
    const router = useRouter()
    const { objectID } = router.query

    return (
        <Row>
            <Col>
                <ArtworkCardDetail objectId={objectID} />
            </Col>
        </Row>
    )
}

export default ArtworkById