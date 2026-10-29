import { isQuestionsEnabled } from "@/lib/questions/config";
import type { ButtonSize, ButtonVariant } from "./Button";
import { AskQuestionClient } from "./AskQuestionClient";

/**
 * The "Ask a question" button that opens the anonymous question form in a
 * modal dialog, on Home and About. Checks on the server whether Resend is
 * configured, so the key never reaches the browser; until it is, the form
 * shows as "opens soon". Without JavaScript the button is a link to /ask,
 * whose form works without script.
 */
export function AskQuestion({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return <AskQuestionClient enabled={isQuestionsEnabled()} variant={variant} size={size} className={className} />;
}
