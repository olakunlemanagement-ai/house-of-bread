import { FormError } from "@/components/shared/forms";
import { newsletterMessages } from "@/lib/newsletter/messages";

/**
 * Shows why a signup failed when the form was posted without JavaScript and
 * /api/subscribe redirected back here with ?error=. Rendered inside Suspense,
 * so the rest of the page stays static.
 */
export async function SignupError({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { error } = await searchParams;
  if (error !== "email" && error !== "retry") return null;

  return (
    <div className="mb-6">
      <FormError id="subscribe-redirect-error">
        {error === "email" ? newsletterMessages.invalidEmail : newsletterMessages.failure}
      </FormError>
    </div>
  );
}
