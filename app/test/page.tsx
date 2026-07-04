import { client } from "../../sanityStudio/lib/client";

export default async function TestPage() {
  const universities = await client.fetch(`
    *[_type == "university"]{
      name,
      slug
    }
  `);

  return (
    <pre>
      {JSON.stringify(universities, null, 2)}
    </pre>
  );
}