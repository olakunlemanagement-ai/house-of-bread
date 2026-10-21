import { isQuestionsEnabled } from "@/lib/questions/config";
import { AskFormClient } from "./AskFormClient";

/**
 * The anonymous question form. Checks on the server whether Resend is
 * configured, so the API key never reaches the browser, and renders the
 * disabled "opens soon" form until it is.
 */
export function AskForm() {
  return <AskFormClient enabled={isQuestionsEnabled()} />;
}
