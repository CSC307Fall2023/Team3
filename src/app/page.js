'use client'
import { Wrapper } from '@googlemaps/react-wrapper';
import { useState, useEffect, useRef } from 'react';
import MapWithMarker from 'src/app/marker/page.js';
import Link from 'next/link';
import ChristmasSnowfall from 'src/app/snowball.js';
import SantaSleigh from 'src/app/SantaSleigh'; 
import homeStyle from 'src/app/homestyle.module.css'

const MyMapComponent = () => {
  const [map, setMap] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [markerAddress, setMarkerAddress] = useState(null);
  const [markerPlaceId, setMarkerPlaceId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const markerRef = useRef(null);
  const [showSnowballs, setShowSnowballs] = useState(true);

  const [seasons, setSeasons] = useState([]);

  const toggleSnowballs = () => {
    setShowSnowballs((prevShow) => !prevShow);
  };

  useEffect(() => {
    // Make sure the Google Maps API is loaded before trying to create a map
    if (window.google && window.google.maps) {
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.299878, lng: -120.662337 },
        zoom: 14,
      });

      // Add click event listener to the map
      mapInstance.addListener('click', (event) => {
        // Remove the previous marker if it exists
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        // Place a new marker
        placeMarker(event.latLng, mapInstance);
      });

      setMap(mapInstance);
    }
  }, []);

  // Function to place a marker on the map
  const placeMarker = (location, mapInstance) => {
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      draggable: true,
    });

    newMarker.addListener('click', () => {
      const markerPosition = newMarker.getPosition();
      getAddressFromLatLng(markerPosition).then((address) => {
        alert(`Marker Clicked!\nAddress: ${address}`);
      });
    });

    // Invoke the callback with marker position
    onMarkerPlaced(newMarker.getPosition().toJSON());
    // Update the marker ref
    markerRef.current = newMarker;
  };

  const onMarkerPlaced = (position) => {
    setMarkerPosition(position);
    getAddressFromLatLng(position).then((result) => {
      setMarkerAddress(result.formatted_address);
      setMarkerPlaceId(result.place_id);
    });
  };

  const handleReviewButtonClick = () => {
    setShowReviewForm(true);
  };

  const handleBackToHomeClick = () => {
    // Reset component state
    setReviewSubmitted(false);
    setShowReviewForm(false);
    setRating(0);

    // Clear marker from the map
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if a review has already been submitted and marker is placed
    if (!markerPosition) {
      alert('Please select a location on the map.');
    } else {
      console.log('Rating submitted:', rating);
      console.log('Marker position:', markerPosition);
      console.log('Marker address:', markerAddress);
      console.log('Selected season:', seasons);

      // const seasonName = "Thanksgiving 2023";  // TODO: get actual season instead of hardcoding
      const placeId = markerPlaceId;

      fetch("api/reviews", {
        method: "post",
        body: JSON.stringify({placeId: placeId, latitude: markerPosition.lat, longitude: markerPosition.lng, seasonName: seasons.name, score: rating}),
      }).then((response) => {
        console.log("Sent POST request for review of", placeId);
        console.log("post response:", response);
      });

      // After successful submission, set reviewSubmitted to true
      setReviewSubmitted(true);
      setShowReviewForm(false);
    }
  };

  // Function to get address from LatLng
  const getAddressFromLatLng = (latLng) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0]);
          } else {
            reject('No results found');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });
    });
  };

  const fetchSeasonsAndPopulateSelect = async () => {
    try {
      const response = await fetch("api/seasons", { method: "get" });
      const data = await response.json();
      console.log("Fetched data:", data);
      setSeasons(data);
    } catch (error) {
        console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchSeasonsAndPopulateSelect();
  }, []);

  return (
    <>
  {/* <div className={`${homeStyle.homeStyle} pageContainer`}> */}
   {showSnowballs && <ChristmasSnowfall /> } {/* Add your FallingSnowballs component */}
      <button onClick={toggleSnowballs}>{showSnowballs ? 'Hide Snowballs' : 'Show Snowballs'}</button>
      <h1>{reviewSubmitted ? 'Review Submitted!' : 'Find or Pin a Location!'}</h1>
      <div>
        <MapWithMarker onMarkerPlaced={onMarkerPlaced} />
        {!showReviewForm ? (
          <button onClick={handleReviewButtonClick}>Review</button>
        ) : reviewSubmitted ? (
          <p>Your review has been submitted!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Rating (1-10):
              <input
                type="number"
                value={rating}
                onChange={(event) => setRating(parseInt(event.target.value, 10))}
                min="1"
                max="10"
              />
            </label>
            {markerAddress && <p>Selected Address: {markerAddress}</p>}
            {seasons.name && <p>Season: {seasons.name}</p>}
            <button type="submit">Submit Review</button>
          </form>
        )}
        <button onClick={handleBackToHomeClick}>Back to Home</button>
      </div>
      { /* </div> */ }
    </>
  );
};

const MyApp = () => (
  <Wrapper apiKey={process.env.NEXT_PUBLIC_MAPS_KEY} onLoad={() => console.log('Google Maps API loaded successfully.')}>
    <MyMapComponent />
  </Wrapper>
);

export default MyApp;
