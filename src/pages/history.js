import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { searchHistoryAtom } from '@/store';
import { Card, ListGroup, Button } from 'react-bootstrap';
import styles from '@/styles/History.module.css';
import { removeFromHistory } from '../../lib/userData'; // <-- Add this import


export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

//   useEffect(() => {
//   getFavourites().then(setFavourites); // or getHistory()
// }, []);


 // Handle the loading state as per instructions
  if (!searchHistory) return null;



  const parsedHistory = [];
  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`);
  }

  const removeHistoryClicked = async (e, index) => { //made this async
    e.stopPropagation();
    // setSearchHistory((current) => {
    //   let x = [...current];
    //   x.splice(index, 1);
    //   return x;
    // });

    setSearchHistory(await removeFromHistory(searchHistory[index])); // <-- Use the API function
  };
  

  if (parsedHistory.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>Nothing Here. Try searching for some artwork.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <ListGroup>
      {parsedHistory.map((historyItem, index) => (
        <ListGroup.Item
          key={index}
          className={styles.historyListItem}
          onClick={(e) => historyClicked(e, index)}
        >
          {Object.keys(historyItem).map((key) => (
            <>
              {key}: <strong>{historyItem[key]}</strong>&nbsp;
            </>
          ))}
          <Button
            className="float-end"
            variant="danger"
            size="sm"
            onClick={(e) => removeHistoryClicked(e, index)}
          >
            &times;
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
