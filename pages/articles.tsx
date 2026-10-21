import Container from "components/Container";

export default function Articles() {
  return (
    <Container title="Articles - Charles Kasasira">
      <div className="flex flex-col justify-center items-start mb-16 w-full text-black dark:text-white">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          My Articles
        </h1>
        <h2 className="tracking-tight my-4 text-gray-700 dark:text-white">
          Adding them Soon
        </h2>
      </div>
    </Container>
  );
}
