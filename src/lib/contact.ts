/**
 * Contact details shared by the views that offer a way to get in touch.
 *
 * The repository is public, so the e-mail and phone number come from the
 * environment at build time (.env locally, GitHub secrets in CI) and never
 * sit in the code — see .env.example. The placeholders keep a build without
 * them working.
 */
export const email = import.meta.env.CONTACT_EMAIL || 'kontakt@example.com';

/* Digits and an optional leading +, spaces are fine. */
export const phone = import.meta.env.CONTACT_PHONE || '+48 000 000 000';

/* Shipped base64-encoded and decoded in the browser by CopyValue, so the
   plain address and number never sit in the HTML for scraping bots. */
export const emailEncoded = btoa(email);
export const phoneEncoded = btoa(phone);

export const githubUser = 'figielak';
export const githubUrl = `https://github.com/${githubUser}`;

/* The WhatsApp link is built in the browser from the phone number
   (a[data-whatsapp]), so it needs no URL of its own. */
export const messengerUrl = 'https://m.me/krystian.figiela000';
export const instagramHandle = 'figielak_';
export const instagramUrl = `https://www.instagram.com/${instagramHandle}/`;
