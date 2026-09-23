/** Contact details shared by the views that offer a way to get in touch. */
export const email = 'kontakt@example.com';

/* TODO: real number. Digits and an optional leading +, spaces are fine. */
export const phone = '+48 000 000 000';

/* Shipped base64-encoded and decoded in the browser by CopyValue, so the
   plain address and number never sit in the HTML for scraping bots. */
export const emailEncoded = btoa(email);
export const phoneEncoded = btoa(phone);

export const githubUrl = 'https://github.com/figielak';

/* TODO: real handles. The WhatsApp link is built in the browser from the
   phone number (a[data-whatsapp]), so it needs no URL of its own. */
export const messengerUrl = 'https://m.me/';
export const instagramHandle = 'figielak';
export const instagramUrl = `https://www.instagram.com/${instagramHandle}/`;
