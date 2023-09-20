import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ImageCard = ({ image, index, moveImage, galleryType }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { image, index, galleryType },
  });

  const [, drop] = useDrop({
    accept: "image",
    hover: (draggedItem) => {
      if (
        draggedItem.index !== index &&
        draggedItem.galleryType === galleryType
      ) {
        moveImage(draggedItem.index, index, galleryType);
        draggedItem.index = index;
      }
    },
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity }}
      className={`image-card ${isDragging ? "dragging" : ""}`}
    >
      <img src={image.urls.small} alt={image.alt_description} />
      {image.tags && image.tags.length > 0 ? (
        image.tags.map((tag, index) => (
          <p className="tags" key={index}>
            #{tag.title}
          </p>
        ))
      ) : (
        <p>{image.alt_description}</p>
      )}
    </div>
  );
};

export default ImageCard;
