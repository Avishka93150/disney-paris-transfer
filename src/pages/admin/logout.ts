import type { APIRoute } from 'astro';
import { destroySession } from '@/lib/auth';

export const POST: APIRoute = ({ cookies, redirect }) => {
  destroySession(cookies);
  return redirect('/admin/login', 303);
};

/** A GET (typed by hand) simply goes back to the sign-in page. */
export const GET: APIRoute = ({ redirect }) => redirect('/admin/login', 303);
