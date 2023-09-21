import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import ImageCard from "./ImageCard"; // Import the ImageCard component
import SkeletonLoader from "./SkeletonLoader";
import { Link } from "react-router-dom";

const isTouchDevice = () => {
  if ("ontouchstart" in window) {
    return true;
  }
  return false;
};

function Gallery({
  backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend,
}) {
  const [images, setImages] = useState([]);
  const [searchImages, setSearchImages] = useState([]); // Separate state for search results
  const [query, setQuery] = useState(""); // Initialize the query state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for demonstration purposes
    setTimeout(() => {
      setLoading(false);
    }, 5000); // Set loading to false after 3 seconds (adjust as needed)
  }, []);

  useEffect(() => {
    // Load photos from the provided Unsplash API URL initially
    const initialAPIURL =
      "https://api.unsplash.com/photos?client_id=t_tNMUvFtHpmrcuOiGT4pqUl95CZWS_ETbZOS9Tfmp0";

    fetch(initialAPIURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
        } else if (data && Array.isArray(data.results)) {
          // Handle the case where the API response is an object with a 'results' array
          setImages(data.results);
        } else {
          throw new Error("Unexpected API response format");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (query.trim() !== "") {
      const API_URL = `https://api.unsplash.com/search/photos?query=${query}&client_id=t_tNMUvFtHpmrcuOiGT4pqUl95CZWS_ETbZOS9Tfmp0`;

      fetch(API_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.results) {
            setSearchImages(data.results);
          } else {
            throw new Error("Unexpected API response format");
          }
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    } else {
      // Clear search images if the query is empty
      setSearchImages([]);
    }
  }, [query]); // Include 'query' as a dependency

  const moveImage = (index, hoverIndex, galleryType) => {
    console.log(`Move image called with galleryType: ${galleryType}`);

    const draggedImage =
      galleryType === "main" ? images[index] : searchImages[index];
    const sourceArray = galleryType === "main" ? images : searchImages;
    const destinationArray = galleryType === "main" ? images : searchImages;

    if (draggedImage) {
      sourceArray.splice(index, 1);
      destinationArray.splice(hoverIndex, 0, draggedImage);

      if (galleryType === "main") {
        console.log("Updating main images");
        setImages([...destinationArray]);
      } else {
        console.log("Updating search images");
        setSearchImages([...destinationArray]);
      }
    }
  };

  return (
    <>
      <header>
        <h1>
          <img src="/assets/image-.png" alt="" />
          DnD Gallery.
        </h1>
        <Link to="/">
          <img src="/assets/logout.png" alt="" />
        </Link>
      </header>
      <h3>Hi there!</h3>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for photos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {loading ? (
        // Render the SkeletonLoader while loading is true
        <div className="skeleton-loaders-container">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      ) : (
        // Render the gallery when loading is false
        <DndProvider backend={backendForDND}>
          <div id="image-gallery">
            {(searchImages.length > 0 ? searchImages : images).map(
              (image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  galleryType={searchImages.length > 0 ? "search" : "main"}
                  moveImage={moveImage}
                />
              )
            )}
          </div>
        </DndProvider>
      )}

      <footer>
        <div className="brands">
          <img src="/assets/facebook.svg" alt="faceboook" />
          <img src="/assets/instagram.svg" alt="instagram" />
          <img src="/assets/twitter.svg" alt="twitter" />
          <img src="/assets/youtube.svg" alt="youtube" />
        </div>
        <div className="links">
          <a href="index.html">Condition Of Use</a>
          <a href="index.html">Privacy & Policy</a>
          <a href="index.html">Press Room</a>
        </div>
        <p>© 2023 DnD Gallery by O'Brien</p>
      </footer>
    </>
  );
}

export default Gallery;
