/**
 * What the /api/* endpoints return, typed from the tile mocks that share
 * their shape. Type-only imports, so no mock code reaches the browser.
 */
import type { Air } from '../../lib/mocks/air';
import type { Dns } from '../../lib/mocks/network';
import type { Github } from '../../lib/mocks/github';
import type { MachineStats } from '../../lib/mocks/stats';
import type { Music } from '../../lib/mocks/music';
import type { Waka } from '../../lib/mocks/waka';
import type { Weather } from '../../lib/mocks/weather';

type Payload<T extends { data?: unknown }> = Omit<NonNullable<T['data']>, 'updatedAt'>;

export type LabPayload = Payload<MachineStats> & { uptimeDays: number };
export type DnsPayload = Payload<Dns>;
export type MusicPayload = Payload<Music>;
export type GithubPayload = Payload<Github>;
export type WakaPayload = Payload<Waka>;
export type WeatherPayload = Payload<Weather>;
export type AirPayload = Payload<Air>;
