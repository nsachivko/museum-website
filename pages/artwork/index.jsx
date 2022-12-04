import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import ArtworkCard from "../../components/ArtworkCard"
import Loading from "../../components/Loading"
import Error from "next/error"
import CustomCard from "../../components/Card"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pagination from 'react-bootstrap/Pagination'
import validObjectIDList from '../../public/data/validObjectIDList.json'
import { useAtom } from 'jotai'
import { globalQuery } from '../../store'
import { globalCollection } from '../../store'
import { globalPageNumber } from '../../store'


const ArtworkIndex = () => {

    const PER_PAGE = 12

    const router = useRouter()
    const finalQuery = router.asPath.split('?')[1]
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useAtom(globalPageNumber)
    const [query, setQuery] = useAtom(globalQuery)
    const [collection, setCollection] = useAtom(globalCollection)

    const fetcher = (...args) => {
        setLoading(true)
        return fetch(...args)
            .then(res => res.json())
            .then(data => {


                let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x))
                let results = []

                for (let i = 0; i < filteredResults?.length; i += PER_PAGE) {
                    const chunk = filteredResults.slice(i, i + PER_PAGE)
                    results.push(chunk)
                }

                setLoading(false)
                return results
            })
    }

    const { data, error } = useSWR(() => finalQuery === query && collection?.length > 0 ? null :
        `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher)

    const [artworkList, setArtworkList] = useState(collection.length > 0 ? collection[page] : [])


    useEffect(() => {
        if (!!data && data !== null) {
            setCollection(data)
            setArtworkList(data[0])
            setQuery(finalQuery)
        } else if (!!collection) {
            setCollection(collection)
            setArtworkList(collection[page])
        }
        setLoading(false)
    }, [data])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])

    const previousPage = () => {
        if (page > 0) {
            const tempPage = page - 1
            setArtworkList(collection[tempPage])
            setPage(tempPage)
        }
    }

    const nextPage = () => {
        if (page < collection.length - 1) {
            const tempPage = page + 1
            setArtworkList(collection[tempPage])
            setPage(tempPage)
        }
    }

    const firstPage = () => {
        setPage(0)
        setArtworkList(collection[0])
    }

    const lastPage = () => {
        setPage(collection.length - 1)
        setArtworkList(collection[collection.length - 1])
    }

    if (!!error)
        return <Error statusCode={404} />

    if (loading) return <Loading />

    return (
        <>
            {!!collection && collection.length ?
                <Container>
                    <Row>
                        {artworkList.map((objectId, key) => {
                            return (
                                <Col lg={3} key={key} className="m-5" >
                                    <ArtworkCard objectId={objectId} />
                                </Col>
                            )
                        })}
                    </Row>
                    {collection.length > PER_PAGE ?
                        <Row>
                            <Pagination className="m-5">
                                <Pagination.First onClick={() => { firstPage() }} />
                                <Pagination.Prev onClick={() => { previousPage() }} />
                                <Pagination.Item active>{page + 1}</Pagination.Item>
                                <Pagination.Next onClick={() => { nextPage() }} />
                                <Pagination.Last onClick={() => { lastPage() }} />
                            </Pagination>
                        </Row> : ""}
                </Container>

                : <CustomCard children={
                    <div>
                        <h1>Nothing Here</h1>
                        <br />
                        <p>Try searching for something else.</p>
                    </div>
                } />
            }
        </>
    )
}

export default ArtworkIndex
