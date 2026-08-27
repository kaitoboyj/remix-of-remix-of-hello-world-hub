import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hello World" },
      { name: "description", content: "A basic hello world website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <h1>Hello World</h1>
      <p>This is a basic HTML website.</p>
    </div>
  );
}
