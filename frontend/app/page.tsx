import { BriefForm } from "@/components/brief/brief-form";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 24 }}>
        <section style={{ display: "grid", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "#475569" }}>
            Sanitized public showcase
          </p>
          <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.1 }}>Agentic Creative Strategy Board</h1>
          <p style={{ margin: 0, maxWidth: 720, color: "#475569", fontSize: 18, lineHeight: 1.6 }}>
            This public slice demonstrates the board-first intake and run lifecycle surface of a real work-in-progress MVP.
          </p>
        </section>

        <BriefForm />
      </div>
    </main>
  );
}
