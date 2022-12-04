import { useAtom } from 'jotai'
import { searchHistoryAtom } from '../store'
import { useState, useEffect } from "react"
import CustomCard from "../components/Card"
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { useRouter } from 'next/router'
import { inputHistoryAtom } from "../store"
import styles from '../styles/History.module.css'
import { removeFromHistory, getHistory } from "../lib/userData"

const History = () => {
    const parsHistory = (history) => {
        if (!history) return []

        return history.map(h => {
            let params = new URLSearchParams(h)
            let entries = params.entries()
            return Object.fromEntries(entries)
        })
    }
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const [parsedHistory, setParsedHistory] = useState(parsHistory(searchHistory))
    const [inputHistory, setInputHistory] = useAtom(inputHistoryAtom)
    const router = useRouter()

    if (!searchHistory) return null

    const historyClicked = (index) => {
        setInputHistory(parsedHistory[index]["q"])
        router.push("/artwork?" + searchHistory[index])
    }

    const removeHistoryClicked = async (e, index) => {
        console.log(index)
        e.stopPropagation()
        console.log(searchHistory[index])
        await removeFromHistory(searchHistory[index])

        await setSearchHistory(await getHistory())

        setParsedHistory(current => {
            let x = [...current]
            x.splice(index, 1)
            return x
        })
    }

    return !!parsedHistory && parsedHistory.length > 0 ?
        <ListGroup >
            {parsedHistory.map((historyItem, index) => {
                return (<ListGroup.Item onClick={() => historyClicked(index)} className={styles.historyListItem}>
                    {Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}
                    <Button className="float-end" variant="danger" size="sm"
                        onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
                </ListGroup.Item>)
            })
            }
        </ListGroup>

        : <CustomCard children={
            <div>
                <h1>Nothing Here</h1>
                <br />
                <p>Try searching for something else.</p>
            </div>
        } />
}

export default History