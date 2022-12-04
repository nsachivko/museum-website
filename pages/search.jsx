import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from "react"
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { searchHistoryAtom } from "../store"
import { addToHistory, getHistory } from "../lib/userData"

const AdvanceSearch = () => {

    const [query, setQuery] = useState("")
    const router = useRouter()
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            searchBy: "",
            geoLocation: "",
            medium: "",
            isOnView: false,
            isHighlight: false,
            q: ""
        }
    })

    useEffect(() => {
        const data = {
            searchBy: "title",
            geoLocation: "",
            medium: "",
            isOnView: false,
            isHighlight: false,
            q: ""
        }

        for (const prop in data) {
            setValue(prop, data[prop])
        }

    }, [])

    // if (!searchHistory) return null


    const submitForm = async (data) => {
        const searchBy = data.searchBy + "=true"
        const getLocation = !!data.geoLocation && data.geoLocation !== null ? "&geoLocation=" + data.geoLocation : ""
        const medium = !!data.medium && data.medium !== null ? "&medium=" + data.medium : ""
        const isOnView = "&isOnView=" + data.isOnView
        const isHighlight = "&isHighlight=" + data.isHighlight
        const q = "&q=" + data.q
        await addToHistory(`${searchBy}${getLocation}${medium}${isOnView}${isHighlight}${q}`)
        setSearchHistory(await getHistory())
        router.push("/artwork?" + `${searchBy}${getLocation}${medium}${isOnView}${isHighlight}${q}`)
    }

    return (
        <Form onSubmit={handleSubmit(submitForm)}>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Search Query</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            {...register("q")}
                            value={query}
                            onChange={(e) => { setQuery(e.target.value) }} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Form.Label>Search By</Form.Label>
                    <Form.Select {...register("searchBy")} className="mb-3">
                        <option value="title">Title</option>
                        <option value="tags">Tags</option>
                        <option value="artistOrCulture">Artist or Culture</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Geo Location</Form.Label>
                        <Form.Control type="text" placeholder="" {...register("geoLocation")} />
                        <Form.Text className="text-muted">
                            Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Medium</Form.Label>
                        <Form.Control type="text" placeholder="" {...register("medium")} />
                        <Form.Text className="text-muted">
                            Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Check
                        {...register("isHighlight")}
                        type="checkbox"
                        label="Highlighted"
                    />
                    <Form.Check
                        {...register("isOnView")}
                        type="checkbox"
                        label="Currently on View"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <br />
                    <Button variant="primary" type="submit" disabled={query.trim().length == 0}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default AdvanceSearch