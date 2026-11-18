import ErrorPage from "components/ErrorPage";

export default function ServerError() {
  return (
    <ErrorPage
      statusCode={500}
      title="Something went wrong."
      description="The site hit an unexpected problem. Please try again in a moment or return to the homepage."
    />
  );
}
