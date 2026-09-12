import type { AstroGlobal } from 'astro';
import type { ActionState } from './actions';

/**
 * The admin pages share one shape: check the session, handle a POST if there
 * is one, then render the current state from the database.
 *
 * A successful write answers with a redirect back to the same page
 * (`?saved=<form>&msg=…`), so a browser refresh never re-submits the form. A
 * failed write renders the page straight away with the error next to the form
 * that caused it, and the values the admin had typed.
 */

export type Feedback = { key: string; state: ActionState; values: FormData | null };

export const NO_FEEDBACK: Feedback = { key: '', state: {}, values: null };

/** What the page shows next to the form identified by `key`. */
export function feedbackFor(feedback: Feedback, key: string): ActionState {
  return feedback.key === key ? feedback.state : {};
}

/** The submitted value of `name`, when the form `key` is being re-shown after an error. */
export function submitted(feedback: Feedback, key: string, name: string): string | null {
  if (feedback.key !== key || !feedback.values) return null;
  const value = feedback.values.get(name);
  return value == null ? null : String(value);
}

export function submittedChecked(feedback: Feedback, key: string, name: string): boolean | null {
  if (feedback.key !== key || !feedback.values) return null;
  return feedback.values.get(name) === 'on';
}

/**
 * Runs `handler` on a POST and turns its result into either a redirect (success)
 * or the feedback the page should render (error). `key` identifies the form.
 */
export async function handlePost(
  astro: Pick<AstroGlobal, 'request' | 'url' | 'redirect'>,
  dispatch: (form: FormData) => { key: string; state: ActionState } | null,
): Promise<{ redirect: Response | null; feedback: Feedback }> {
  const saved = astro.url.searchParams.get('saved');
  const message = astro.url.searchParams.get('msg');

  if (astro.request.method !== 'POST') {
    return {
      redirect: null,
      feedback: saved && message ? { key: saved, state: { success: message }, values: null } : NO_FEEDBACK,
    };
  }

  const form = await astro.request.formData();
  const result = dispatch(form);
  if (!result) return { redirect: null, feedback: { key: '', state: { error: 'Unknown action.' }, values: null } };

  if (result.state.success) {
    const params = new URLSearchParams({ saved: result.key, msg: result.state.success });
    return { redirect: astro.redirect(`${astro.url.pathname}?${params.toString()}`, 303), feedback: NO_FEEDBACK };
  }

  return { redirect: null, feedback: { key: result.key, state: result.state, values: form } };
}
