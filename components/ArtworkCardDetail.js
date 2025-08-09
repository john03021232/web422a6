
// components/ArtworkCardDetail.js
import useSWR from 'swr';
import Error from 'next/error';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../src/store';
import { addToFavourites, removeFromFavourites } from '../lib/userData';
import { useState, useEffect } from 'react';

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  const [isFavourited, setIsFavourited] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setIsFavourited(Boolean(favouritesList?.includes(objectID)));
  }, [favouritesList, objectID]);

  async function favouritesClicked() {
    setErrMsg('');
    try {
      if (isFavourited) {
        const updated = await removeFromFavourites(objectID);
        if (Array.isArray(updated)) {
          setFavouritesList(updated);
        } else {
          // fallback local update if API returns unexpected result
          setFavouritesList((prev = []).filter(id => id !== objectID));
        }
      } else {
        const updated = await addToFavourites(objectID);
        if (Array.isArray(updated)) {
          setFavouritesList(updated);
        } else {
          // fallback local update
          setFavouritesList((prev = []) => [...prev, objectID]);
        }
      }
    } catch (err) {
      console.error('favouritesClicked error', err);
      setErrMsg('Unable to update favourites. Are you logged in?');
    }
  }

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <>
      {errMsg && <Alert variant="danger" onClose={() => setErrMsg('')} dismissible>{errMsg}</Alert>}
      <Card>
        {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
        <Card.Body>
          <Card.Title>{data.title || 'N/A'}</Card.Title>
          <Card.Text>
            Date: {data.objectDate || 'N/A'}
            <br />
            Classification: {data.classification || 'N/A'}
            <br />
            Medium: {data.medium || 'N/A'}
            <br />
            <br />
            Artist: {data.artistDisplayName || 'N/A'}{' '}
            {data.artistDisplayName && data.artistWikidata_URL && (
              <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">wiki</a>
            )}
            <br />
            Credit Line: {data.creditLine || 'N/A'}
            <br />
            Dimensions: {data.dimensions || 'N/A'}
          </Card.Text>

          <Button
            variant={isFavourited ? 'danger' : 'outline-primary'}
            onClick={favouritesClicked}
          >
            {isFavourited ? '+ Favourites (added)' : '+ Favourites'}
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
