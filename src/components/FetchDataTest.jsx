import React from 'react';
import { useState, useEffect } from 'react'
import axios from 'axios'

const FetchDataTest = () => {
    const [wpData, setWpData] = useState(null);
    const [error, setError] = useState(null);
  
  
    // Function to fetch data from WordPress REST API
    const fetchWpData = async () => {
      try {
        const response = await axios.get('https://voltms.com/wp-json/wp/v2/posts'); // Fetching posts from WordPress
        setWpData(response.data);
      } catch (error) {
        setError("Failed to connect to Wordpress");
      }
    };
  
  
    useEffect (() => {
      fetchWpData();
    }, [])
  
    return (
      <>
        <div>
          <h1 className='text-3xl font-bold'>Testing!!!</h1>
          {error && <p className="text-red-500">{error}</p>} {/* Display error message if any */}
          <h2>WordPress Data:</h2>
          {wpData ? (
            <ul>
              {/* Display the titles of the fetched WordPress posts */}
              {wpData.map((post) => (
                <li key={post.id}>{post.title.rendered}</li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p> // Show loading state while data is being fetched
          )}
        </div>
      </>
    )
  }

export default FetchDataTest;
