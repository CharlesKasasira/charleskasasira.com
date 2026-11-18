import ErrorPage from "components/ErrorPage";

function NotFound() {
  return (
    <ErrorPage
      statusCode={404}
      title="Page not found."
      description="You did not break the internet. This page may have moved, or the link may no longer exist."
    />
  );
}

export default NotFound;
