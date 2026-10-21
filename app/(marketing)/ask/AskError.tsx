import { FormError } from "@/components/shared/forms";
import { isQuestionError, questionErrorMessage } from "@/lib/questions/messages";

/**
 * Shows why a question was not sent when the form was posted without
 * JavaScript and /api/questions redirected back here with ?error=. Rendered
 * inside Suspense, so the rest of the page stays static.
 */
export async function AskError({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { error } = await searchParams;
  if (!isQuestionError(error)) return null;

  return (
    <div className="mb-6">
      <FormError id="ask-redirect-error">{questionErrorMessage(error)}</FormError>
    </div>
  );
}
