import { useState } from "react";
import { v4 as uuid } from "uuid";
import GlobalStyle from "../styles";

export default function App({ Component, pageProps }) {
  const [posts, setPosts] = useState([]);

  console.log(posts);

  function handleAddPost(newPost) {
    setPosts([{ _id: uuid(), ...newPost }, ...posts]);
  }

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} onAddpost={handleAddPost} posts={posts} />
    </>
  );
}
