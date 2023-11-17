'use client'

import Map from 'src/app/map.js';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import MapWithMarker from 'src/app/marker/page.js';


export default function Review() {
  const [rating, setRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [markerAddress, setMarkerAddress] = useState(null);
  const [markerPlaceId, setMarkerPlaceId] = useState(null);
  const pathname = usePathname();

  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value, 10));
  };

  const handleMarkerPlacement = (position) => {
    setMarkerPosition(position);
    // Use the geocoder to get the address from LatLng
    getPlaceFromLatLng(position).then((result) => {
      setMarkerAddress(result.formatted_address);
      setMarkerPlaceId(result.place_id);
    });
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if a review has already been submitted and marker is placed
    if (reviewSubmitted) {
      alert('You cannot submit more than one review.');
    } else if (!markerPosition) {
      alert('Please select a location on the map.');
    } else if (!selectedSeason) {
      alert('Please select a season.');
    } else {
      console.log('Rating submitted:', rating);
      console.log('Marker position:', markerPosition);
      console.log('Marker address:', markerAddress);
      console.log('Selected season:', selectedSeason);

      const placeId = markerPlaceId;

      fetch("api/reviews", { method: "post", body: JSON.stringify(
        {placeId: placeId, latitude: markerPosition.lat, longitude: markerPosition.lng, seasonName: selectedSeason, score: rating}) } )
          .then((response) => {
            console.log("Sent POST request for review of", placeId);
            console.log("post response:", response);
          });
      
      // After successful submission, set reviewSubmitted to true
      setReviewSubmitted(true);
    }
  };

  // returns a GeocoderResult, including formatted_address and place_id fields
  const getPlaceFromLatLng = (latLng) => {
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
      <h1>Leave a Review</h1>
      <div>
        <Link href="/">Back to Home</Link>
        <MapWithMarker onMarkerPlaced={handleMarkerPlacement} />
        {reviewSubmitted ? (
          <p>Your review has been submitted!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Rating (1-10):
              <input
                type="number"
                value={rating}
                onChange={handleRatingChange}
                min="1"
                max="10"
              />

              <select name="season" id="season" onChange={handleSeasonChange} value={selectedSeason}>
              <option value=""> </option>
                {seasons.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
              
            </label>
            {markerAddress && <p>Selected Address: {markerAddress}</p>}
            <button type="submit">Submit Review</button>
          </form>
        )}
      </div>
    </>
  );
}
