export interface MongoDocument {
	_id: string;
}

export enum MCColor {
	black = '#000000',
	dark_blue = '#0000AA',
	dark_green = '#00AA00',
	dark_aqua = '#00AAAA',
	dark_red = '#AA0000',
	dark_purple = '#AA00AA',
	gold = '#FFAA00',
	gray = '#AAAAAA',
	dark_gray = '#555555',
	blue = '#5555FF',
	green = '#55FF55',
	aqua = '#55FFFF',
	red = '#FF5555',
	light_purple = '#FF55FF',
	yellow = '#FFFF55',
	white = '#FFFFFF',
	minecoin_gold = '#DDD605',
}

export interface FormatString {
	text: string;
	color: string;
	obfuscated?: boolean;
	bold?: boolean;
	strikethrough?: boolean;
	underline?: boolean;
	italic?: boolean;
	reset?: boolean;
	clickEvent?: { action: string; value: string };
}

export interface RawServer extends MongoDocument {
	ip: string;
	foundAt: number;
	foundBy: string;
	description:
		| string
		| { color?: string; text: string; extra?: FormatString[] };
	players: {
		max: number;
		online: number;
		sample?: [{ name: string; id: string }];
	};
	version: { name: string; protocol: number };
	ping: number;
	favicon?: string;
	enforcesSecureChat?: boolean;
	previewsChat?: boolean;
	modinfo?: any;
	forgeData?: any;
}

export type ParsedServer = {
	id: string;
	ip: string;
	foundAt: string;
	foundBy: string | undefined | null;
	description: JSX.Element[];
	rawDescription?: string;
	players: {
		max: number;
		online: number;
		sample?: { id: string; name: string }[];
	};
	version: string | JSX.Element[];
	ping: number;
	hasCustomFavicon: boolean;
	favicon: string;
};

export type AllowedUserQuery = 'mostRecent' | 'findByIp';

export type QuerySelection = {
	type: AllowedUserQuery;
	input: { ip?: string; limit?: string; playerName?: string; text?: string };
	validationError: boolean | string;
};
