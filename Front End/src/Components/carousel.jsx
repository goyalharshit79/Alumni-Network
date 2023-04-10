import React, { useEffect, useState } from "react";
import $ from "jquery";

function Carousel(props) {
  useEffect(() => {
    if ($(".active" + "." + props.post._id).length === 0) {
      const id = props.post._id;
      const images = $("." + id);
      images[0].classList.add("active");
    }
  });
  const [postNumber, setPostNumber] = useState();
  useEffect(() => {
    setPostNumber("#post" + props.post.postNumber);
  }, [props.post.postNumber]);

  return (
    <div id={"post" + props.post.postNumber} className="carousel slide">
      <div className="carousel-inner">
        {props.post.image.map((image) => {
          return (
            <>
              <div className={"carousel-item " + props.post._id}>
                <img
                  className="col-sm-12 post-image"
                  src={image}
                  alt="imageHere"
                />
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={postNumber}
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={postNumber}
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
              </button>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Carousel;
