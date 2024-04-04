import Image from "next/image";

export default function HomePage({ onAddpost, posts }) {
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { title, content } = Object.fromEntries(formData);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const { url, width, height } = await response.json();

    onAddpost({
      title,
      content,
      image: { url, width, height },
    });
  }

  return (
    <>
      <h1>New Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input name="title" id="title" placeholder="Enter the post title" />

        <label htmlFor="cover">Cover </label>
        <input name="cover" type="file" id="cover" accept="image/*" />

        <label htmlFor="content">Content </label>
        <textarea
          name="content"
          id="content"
          placeholder="Enter the post content"
        />
        <button type="submit">Create Post</button>
      </form>

      {!posts.length ? (
        "No posts yet."
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <p>Those are some fake blog posts</p>
          <ul>
            {posts.map(({ _id, title, content, image }) => (
              <li key={_id}>
                <h3>{title}</h3>
                <div
                  style={{
                    width: "80vw",
                    height: "300px",
                    maxWidth: "500px",
                    position: "relative",
                  }}
                >
                  <Image
                    alt={`image of ${title}`}
                    src={image.url}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <p>{content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
