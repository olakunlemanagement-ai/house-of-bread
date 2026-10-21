// Resend REST client. Server only. Plain fetch, no SDK.
// Docs: https://resend.com/docs/api-reference/emails/send-email
//
// Shared by every form that sends email (anonymous questions now, the
// contact form later). Callers pass fixed subjects; user input belongs in
// `text` only, never in a header or the subject.

const RESEND_API = "https://api.resend.com/emails";
const TIMEOUT_MS = 8000;

export type ResendConfig = {
  apiKey: string;
  /** A sender on a domain verified in Resend, such as "House of Bread Global <questions@hobglobal.online>". */
  from: string;
};

export type PlainEmail = {
  to: string;
  subject: string;
  text: string;
};

/** A failed send. Carries the status only, never the message or recipient. */
export class ResendError extends Error {
  constructor(readonly status: number | null) {
    super(`Resend send failed${status === null ? " (unreachable)" : ` with status ${status}`}`);
    this.name = "ResendError";
  }
}

/** Sends one plain text email. Throws ResendError on any failure. */
export async function sendPlainEmail(config: ResendConfig, email: PlainEmail): Promise<void> {
  let response: Response;
  try {
    response = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        from: config.from,
        to: [email.to],
        subject: email.subject,
        text: email.text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new ResendError(null);
  }
  if (!response.ok) throw new ResendError(response.status);
}
