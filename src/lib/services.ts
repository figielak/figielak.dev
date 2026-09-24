/**
 * Homelab services for the launcher tile on the private dashboard
 * (koncept.md §3.4). They resolve only over Tailscale. Everything except
 * Mealie is a placeholder — replace with the services that really run.
 *
 * The domain comes from HOMELAB_DOMAIN at build time: the repository is
 * public and must not reveal homelab host names (koncept.md §14).
 */
import type { IconName } from '../components/ui/Icon.astro';

export interface Service {
	name: string;
	url: string;
	icon: IconName;
}

const domain = import.meta.env.HOMELAB_DOMAIN || 'home.example';
const host = (name: string) => `https://${name}.${domain}`;

export const services: Service[] = [
	{ name: 'Mealie', url: host('mealie'), icon: 'chef-hat' },
	{ name: 'Homepage', url: host('homepage'), icon: 'home' },
	{ name: 'Jellyfin', url: host('jellyfin'), icon: 'movie' },
	{ name: 'Immich', url: host('immich'), icon: 'photo' },
	{ name: 'AdGuard', url: host('adguard'), icon: 'shield' },
	{ name: 'Uptime Kuma', url: host('uptime'), icon: 'activity' },
];
