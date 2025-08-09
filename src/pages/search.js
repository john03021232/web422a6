
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '../../lib/userData'; // <-- Add this import


export default function AdvancedSearch() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const submitForm = async (data) => { // made the function async
    let queryString = '';

    // Handle searchBy - convert to the correct parameter format
    if (data.searchBy) {
      queryString += `${data.searchBy}=true`;
    }

    if (data.geoLocation) {
      queryString += `&geoLocation=${data.geoLocation}`;
    }

    if (data.medium) {
      queryString += `&medium=${data.medium}`;
    }

    // Add boolean parameters
    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    
    // Add search query
    queryString += `&q=${data.q}`;

    // setSearchHistory(current => [...current, queryString]);  // Add to history

    console.log('🔍 DEBUG: About to add to history:', queryString);


     try {
    // Add to server history
    await addToHistory(queryString);
    console.log('✅ DEBUG: Successfully added to server history');
    
    // Update local state
    setSearchHistory(current => [...current, queryString]);
    console.log('✅ DEBUG: Updated local search history');
    
  } catch (error) {
    console.error('❌ DEBUG: Failed to add to history:', error);
    // Still update local state even if server fails
    setSearchHistory(current => [...current, queryString]);
  }



    // <-- Changed this line to use the API function
    //setSearchHistory(await addToHistory(queryString))


    router.push(`/artwork?${queryString}`);


  };

  return (
    <>
      
      <Form onSubmit={handleSubmit(submitForm)}>
        {/* Search Query Row */}
        <Form.Group className="mb-3">
          <Form.Label>Search Query</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            {...register('q', { required: true })}
            className={errors.q ? 'is-invalid' : ''}
          />
        </Form.Group>

        {/* Search By, Geo Location, Medium in 1 Row */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Search By</Form.Label>
              <Form.Select {...register('searchBy')}>
             
                <option value="title">Title</option>
                <option value="tags">Tags</option>
                <option value="artistOrCulture">Artist or Culture</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Get Location</Form.Label>
              <Form.Control type="text" {...register('geoLocation')} />
              <Form.Text className="text-muted d-block mb-1">
                Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Medium</Form.Label>
              <Form.Control type="text" {...register('medium')} />
              <Form.Text className="text-muted d-block mb-1">
                Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* Checkboxes */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Highlighted"
            {...register('isHighlight')}
          />
          <Form.Check
            type="checkbox"
            label="Currently on View"
            {...register('isOnView')}
          />
        </Form.Group>

        {/* Submit */}
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
    </>
  );
}
