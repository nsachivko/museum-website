import { useState, useEffect } from "react"


const LongText = ({ text, length = 30 }) => {

    const [shortText, setShortText] = useState(text || "cached")
    const [active, setActive] = useState(true)

    useEffect(() => {
        const textTemp = text.length > length ? text.slice(0, length) : text
        const status = text.length > length

        setShortText(textTemp)
        setActive(status)
    }, [text])

    const handleButton = () => {
        setActive(false)
        setShortText(text)
    }

    return (
        <>
            {shortText}
            {active ? <button
                className="btn bg-light border-0"
                style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "black"
                }} onClick={() => { handleButton() }}>more...</button> : <></>}
        </>
    )
}

export default LongText