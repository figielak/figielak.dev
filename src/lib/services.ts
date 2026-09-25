/**
 * Homelab services for the services bar on the private dashboard
 * (koncept.md §3.4): the ones that really run. They resolve only over
 * Tailscale. `name` is also the Uptime Kuma monitor name the agent sends,
 * which is how the bar finds each one's status.
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
	{ name: 'AdGuard', url: host('adguard'), icon: 'shield' },
	{ name: 'Uptime Kuma', url: host('uptime-kuma'), icon: 'activity' },
	{ name: 'Beszel', url: host('beszel'), icon: 'chart-bar' },
	{ name: 'Calibre-Web', url: host('calibre'), icon: 'book' },
	{ name: 'MeTube', url: host('metube'), icon: 'download' },
	{ name: 'Opengist', url: host('opengist'), icon: 'code' },
	{ name: 'Quartz', url: host('quartz'), icon: 'notebook' },
];
