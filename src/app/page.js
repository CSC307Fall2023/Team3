'use client'
import { Wrapper } from '@googlemaps/react-wrapper';
import { useState, useEffect, useRef } from 'react';
import MapWithMarker from 'src/app/marker/page.js';
import Link from 'next/link';
import ChristmasSnowfall from 'src/app/snowball.js';
import SantaSleigh from 'src/app/SantaSleigh'; 
import homeStyle from 'src/app/homestyle.module.css';
import Sidebar from 'src/app/sidebar.js';
import './styles.css';

const MyMapComponent = () => {
  
  const [map, setMap] = useState(null);
  const [rating, setRating] = useState(1);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [markerAddress, setMarkerAddress] = useState(null);
  const [markerPlaceId, setMarkerPlaceId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const markerRef = useRef(null);
  const [showSnowballs, setShowSnowballs] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [houseLocations, setHouseLocations] = useState([]);

  const showMarkerForAddress = (address) => {
    if (map) {
      // Create a geocoder object
      const geocoder = new window.google.maps.Geocoder();

      // Geocode the address to get coordinates
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0] && results[0].geometry && results[0].geometry.location) {
          const location = results[0].geometry.location;

          // Remove the previous marker if it exists
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // Place a new marker
          placeMarker(location, map);
        } else {
          console.error('Geocoder failed or no results found for the address:', address);
        }
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const [seasons, setSeasons] = useState([]);

  const toggleSnowballs = () => {
    setShowSnowballs((prevShow) => !prevShow);

  };

  useEffect(() => {
    const fetchHouseLocations = async () => {
      try {
        const response = await fetch("api/listings", {
          method: "get",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status}`);
        }

        const data = await response.json();
        console.log("Listings data:", data);

        // Update the state with the fetched listings
        setHouseLocations(data);

        
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchHouseLocations();
  }, []); // Run only once when the component mounts

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const { latitude, longitude } = await getLocation();
        console.log(`Current location: Latitude ${latitude}, Longitude ${longitude}`);

        // Make sure the Google Maps API is loaded before trying to create a map
        if (window.google && window.google.maps) {
          const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: latitude, lng: longitude },
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

          fetchReviews(mapInstance);
        }
      } catch (error) {
        console.error("Error getting location:", error.message);
        // Handle errors
      }
    };

    initializeMap();
  }, []);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
          },
          (error) => {
            // Default location in case of error or permission denied
            const defaultLocation = { latitude: 35.299878, longitude: -120.662337 };
            console.error(`Error getting location: ${error.message}. Using default location.`);
            resolve(defaultLocation);
          }
        );
      } else {
        // Browser doesn't support geolocation
        const defaultLocation = { latitude: 35.299878, longitude: -120.662337 };
        console.error("Geolocation is not supported by this browser. Using default location.");
        resolve(defaultLocation);
      }
    });
  };
  

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

  const placeMarkerStatic = (location, mapInstance) => {
    console.log("received location: ", location);
    new window.google.maps.Marker({
      position: location,
      map: mapInstance,
    });
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

  const fetchReviews = async (mapInstance) => {
    try {
      // Fetch individual data for each listing ID
      const individualResponse = await fetch(`api/listings`, { method: "get" });
  
      const data = await individualResponse.json();
      console.log("Fetched data:", data);

      // Assuming data is an array of objects with latitude and longitude properties
      data.forEach((individualData) => {
        console.log(`Fetched data:`, individualData);

        new google.maps.Marker({
          position: {
            lat: parseFloat(individualData.latitude),
            lng: parseFloat(individualData.longitude),
          },
          map: mapInstance,
          icon: {                             
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                          
          }
        });
      });
  
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchSeasonsAndPopulateSelect();
    //fetchReviews(mapInstance);
  }, []);

  return (
    <>
  <div className="map-wrapper">
   {showSnowballs && <ChristmasSnowfall /> } {/* Add your FallingSnowballs component */}
      <button onClick={toggleSnowballs}>{showSnowballs ? 'Hide Snowballs' : 'Show Snowballs'}</button>
      <h1>{reviewSubmitted ? 'Review Submitted!' : 'Find or Pin a Location!'}</h1>
      <div className={`flex-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Sidebar collapsed={sidebarCollapsed} listings={houseLocations} onShowMarker={showMarkerForAddress} />
        <MapWithMarker onMarkerPlaced={onMarkerPlaced} />
        <div>{seasons.name && <p>Season: {seasons.name}</p>}
        {markerAddress && <p>Selected Address: {markerAddress}</p>}
        </div>
        {!showReviewForm ? (
          <button onClick={handleReviewButtonClick}>Review</button>
        ) : reviewSubmitted ? (
          <p>Your review has already been submitted!</p>
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
            {/* {markerAddress && <p>Selected Address: {markerAddress}</p>} */}
            {/* {seasons.name && <p>Season: {seasons.name}</p>} */}
            <button type="submit">Submit Review</button>
            </form>
          )}
          <button onClick={handleBackToHomeClick}>Back to Home</button>
      </div>
      </div>
    </>
  );

};
          

const MyApp = () => (
  <Wrapper apiKey={process.env.NEXT_PUBLIC_MAPS_KEY} onLoad={() => console.log('Google Maps API loaded successfully.')}>
    <MyMapComponent />
  </Wrapper>
);

export default MyApp;
