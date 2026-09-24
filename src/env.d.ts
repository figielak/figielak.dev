/// <reference types="astro/client" />

/** Build-time values kept out of the public repository — see .env.example. */
interface ImportMetaEnv {
	readonly CONTACT_EMAIL?: string;
	readonly CONTACT_PHONE?: string;
	readonly HOMELAB_DOMAIN?: string;
}
