export default function Articles() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/blog",
      permanent: true,
    },
  };
}
