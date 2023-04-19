import React, { useState } from "react";

function CreatePost(props) {
  const [picsUploaded, setPicsUploaded] = useState([]);
  function handleAddPost(e) {
    const address = "http://localhost:8000";
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const reqData = {
      email: props.user.email,
      postTitle: data.get("title"),
      postAbout: data.get("about"),
      pics: picsUploaded,
    };
    fetch(address + "/add-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        props.getPosts();
        props.closeCreatePost();
      });
  }
  function getFiles(e) {
    const files = e.target.files;
    // console.log(files);
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      // console.log("file : ", files[i]);
      reader.readAsDataURL(files[i]);
      reader.onload = () => {
        // console.log("result: ", reader.result);
        setPicsUploaded((prev) => {
          return [...prev, reader.result];
        });
      };
    }
  }
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <button
              type="button"
              className="btn-close create-post-close my-input"
              aria-label="Close"
              onClick={props.closeCreatePost}
            ></button>
            <form onSubmit={handleAddPost}>
              <div className="row">
                <div className="col-sm-12 form-floating mb-2">
                  <input
                    className="my-input create-post-input form-control "
                    id="title"
                    name="title"
                    placeholder="Title of the Post"
                  />
                  <label htmlFor="title">Title of the Post</label>
                </div>
                <hr className="mb-2" />
                <div className="col-sm-12 form-floating mb-3">
                  <textarea
                    name="about"
                    id="about"
                    className="my-input create-post-textarea form-control"
                    placeholder="About"
                  ></textarea>
                  <label htmlFor="about">About</label>
                </div>
                <input
                  onChange={getFiles}
                  className="form-control mb-3 visually-hidden"
                  multiple="multiple"
                  type="file"
                  id="files"
                  name="files"
                  accept="image/*"
                />
                <label
                  htmlFor="files"
                  className="w-75 mx-auto btn btn-lg rounded-3 btn-color-2 mb-3"
                >
                  Add Media
                </label>

                {picsUploaded.map((pic) => {
                  return (
                    <img
                      className="col-sm-12 post-image mb-3"
                      src={pic}
                      alt="imageHere"
                    />
                  );
                })}

                <button
                  className="w-100 btn btn-lg rounded-3 btn-color-1"
                  type="submit"
                >
                  Add Post
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </>
  );
}
export default CreatePost;
