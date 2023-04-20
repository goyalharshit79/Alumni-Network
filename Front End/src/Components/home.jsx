import React, { useEffect, useState } from "react";
import Post from "./posts";
import $ from "jquery";
import CreatePost from "./createPost";

function Home(props) {
  const [createPost, setCreatePost] = useState(false);
  const [posts, setPosts] = useState();
  const [showOptions, setShowOptions] = useState();

  useEffect(() => {
    setDimensions();
  });
  useEffect(() => {
    getPosts();
  }, []);

  const setDimensions = () => {
    const window = $("html").innerHeight();
    // console.log(window);
    const nav = $("#navBar").outerHeight();
    // console.log(nav);
    $("#my-container").outerHeight(window - nav);
    // console.log(window - nav);
  };
  function handleCreatePost() {
    setCreatePost(true);
  }
  function closeCreatePost() {
    setCreatePost(false);
  }
  function getPosts() {
    console.log("i was cakked");
    const address = "http://localhost:8000";

    fetch(address + "/get-posts", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
      });
  }
  function handleShowOptions(id) {
    setShowOptions(id);
  }
  return (
    <>
      <div
        id="my-container"
        className="scroll-enable"
        onClick={(e) => {
          if (e.target.id !== "options") {
            setShowOptions();
          }
        }}
      >
        <div className="container-fluid posts-container">
          {props.user.user === "Teacher" ? (
            createPost ? (
              <CreatePost
                user={props.user}
                closeCreatePost={closeCreatePost}
                getPosts={getPosts}
              />
            ) : (
              <>
                <button
                  className="add-post-btn btn btn-color-2 "
                  type="submit"
                  onClick={handleCreatePost}
                >
                  Create Post
                </button>
                {posts ? (
                  <>
                    <Post
                      showOptions={showOptions}
                      handleShowOptions={handleShowOptions}
                      getPosts={getPosts}
                      user={props.user}
                      posts={posts}
                    />
                  </>
                ) : (
                  <></>
                )}
              </>
            )
          ) : (
            <>
              {posts ? (
                <>
                  <Post
                    showOptions={showOptions}
                    handleShowOptions={handleShowOptions}
                    getPosts={getPosts}
                    user={props.user}
                    posts={posts}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
