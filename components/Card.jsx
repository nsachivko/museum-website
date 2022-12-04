import Card from 'react-bootstrap/Card'

const CustomCard = ({ children }) => {
    return (

        <Card className="bg-light font-weight-bold">
            <Card.Body>
                {children}
            </Card.Body>
        </Card>
    )
}

export default CustomCard