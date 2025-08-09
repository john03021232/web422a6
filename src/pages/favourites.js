import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { Row, Col, Card } from 'react-bootstrap';
import ArtworkCard from '../../components/ArtworkCard';




export default function Favourites() {
  const [favouritesList] = useAtom(favouritesAtom);

  
//if (!favouritesList) return null; // Assignment instruction
// Don't show anything while loading (favouritesList is undefined)
  // if (favouritesList === undefined) return null;
  
   // <-- Add this line
  if (!favouritesList) return null; 


  if (!favouritesList || favouritesList.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>Nothing Here. Try adding some new artwork to the list.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Row>
      {favouritesList.map((objectID) => (
        <Col lg={3} key={objectID}>
          <ArtworkCard objectID={objectID} />
        </Col>
      ))}
    </Row>
  );
}




