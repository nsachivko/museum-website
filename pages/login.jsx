import { useState } from 'react'
import { authenticateUser } from '../lib/authenticate'
import { useRouter } from 'next/router'
import { Card, Form, Alert, Button } from 'react-bootstrap'
import { getFavourites, getHistory } from '../lib/userData'
import { useAtom } from 'jotai'
import { searchHistoryAtom, favouritesAtom } from "../store"

export default function Login(props) {
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [warning, setWarning] = useState('')
    const router = useRouter()
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)

    const updateAtoms = async () => {
        setFavouritesList(await getFavourites() || [])
        setSearchHistory(await getHistory() || [])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await authenticateUser(user, password)
            await updateAtoms()
            router.push('/favourites')
        } catch (err) {
            setWarning(err.message)
        }
    }

    return (
        <>
            <Card bg="light">
                <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
            </Card>
            <br />
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>User:</Form.Label><Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Password:</Form.Label><Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <br />
                <Button variant="primary" className="pull-right" type="submit">Login</Button>
            </Form>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
        </>
    )
}