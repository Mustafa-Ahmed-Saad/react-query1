import { useMutation, useQuery } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId, newPost) {
  console.log("postId", postId);
  console.log("newPost", newPost);
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: "PATCH", data: newPost }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery(
    ["comments", post.id],
    () => fetchComments(post.id)
  );

  // delete post mutation
  // we can use (onMutate , onSettled , onSuccess and onError) in useMutation but we will not do that because the data not actually deleted from the server
  const deletePostMutation = useMutation((postId) => deletePost(postId));

  // update post mutation
  // we can use (onMutate , onSettled , onSuccess and onError) in useMutation but we will not do that because the data not actually deleted from the server
  const updatePostMutation = useMutation(({ postId, newPost }) => {
    updatePost(postId, newPost);
  });

  // loading
  if (isLoading) return <div>Loading...</div>;

  // error
  if (isError) return <div>{error.toString()}</div>;

  // success
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deletePostMutation.mutate(post.id)}>Delete</button>
      <button
        onClick={() =>
          updatePostMutation.mutate({
            postId: post.id,
            newPost: { title: "REACT QUERY FOREVER!!!!" },
          })
        }
      >
        Update title
      </button>

      {/* updatePostMutation state */}
      {updatePostMutation.isLoading && (
        <div style={{ color: "purple" }}>Loading... </div>
      )}
      {updatePostMutation.isError && (
        <div style={{ color: "red" }}>
          Error: {updatePostMutation.error.message}
          {/* reset mutation state */}
          <button onClick={() => updatePostMutation.reset()}>clear</button>
        </div>
      )}
      {updatePostMutation.isSuccess && (
        <div style={{ color: "green" }}>
          Post updated successfully. but note that jsonPlaceholder is not
          updated it actually
          {/* reset mutation state */}
          <button onClick={() => updatePostMutation.reset()}>clear</button>
        </div>
      )}

      {/* deletePostMutation state */}
      {deletePostMutation.isLoading && (
        <div style={{ color: "purple" }}>Loading... </div>
      )}
      {deletePostMutation.isError && (
        <div style={{ color: "red" }}>
          Error: {deletePostMutation.error.message}
          {/* reset mutation state */}
          <button onClick={() => deletePostMutation.reset()}>clear</button>
        </div>
      )}
      {deletePostMutation.isSuccess && (
        <div style={{ color: "green" }}>
          Post deleted successfully. but note that jsonPlaceholder is not
          deleted it actually
          {/* reset mutation state */}
          <button onClick={() => deletePostMutation.reset()}>clear</button>
        </div>
      )}

      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
