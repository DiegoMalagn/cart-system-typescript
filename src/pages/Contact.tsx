import { useState } from "react";
import { Alert, Card, Form, Spinner } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="py-4">
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <Card className="shadow-sm">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-0" style={{ color: "var(--slp-clay)" }}>
                Contact Us
              </h1>
              <div
                style={{
                  width: "48px",
                  height: "2px",
                  margin: "8px auto 24px",
                  backgroundColor: "var(--slp-sand)",
                }}
              />
              <p className="text-secondary mb-0">
                Have a question or custom order inquiry? We&apos;d love to hear from you.
              </p>
            </div>

            {status === "success" ? (
              <Alert variant="success" className="mb-0">
                Message sent! We&apos;ll get back to you soon.
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--slp-clay)", fontWeight: 500 }}>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--slp-clay)", fontWeight: 500 }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--slp-clay)", fontWeight: 500 }}>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="What&apos;s this about?"
                    value={form.subject}
                    onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--slp-clay)", fontWeight: 500 }}>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Tell us about your order, design idea, or question..."
                    value={form.message}
                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                    required
                  />
                </Form.Group>

                {status === "error" ? <Alert variant="danger">{errorMessage}</Alert> : null}

                <button type="submit" className="btn btn-brand" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </Form>
            )}
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <div className="d-flex justify-content-center align-items-center gap-2 mb-2" style={{ color: "var(--slp-clay)" }}>
            <MdEmail />
            <span>stamplabprints@outlook.com</span>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
            <FaInstagram style={{ color: "var(--slp-clay)" }} />
            <a
              href="https://www.instagram.com/stamplabprints/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--slp-clay)", textDecoration: "none" }}
            >
              @stamplabprints
            </a>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
            <FaFacebook style={{ color: "var(--slp-clay)" }} />
            <a
              href="https://www.facebook.com/stamplabprints1"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--slp-clay)", textDecoration: "none" }}
            >
              @stamplabprints1
            </a>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <FaTiktok style={{ color: "var(--slp-clay)" }} />
            <a
              href="https://www.tiktok.com/@stamplabprints"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--slp-clay)", textDecoration: "none" }}
            >
              @stamplabprints
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
