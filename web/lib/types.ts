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

export interface Formatting {
	text: string;
	color: string | MCColor;
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
	foundAt: Date;
	description: string | { text: string; extra?: Formatting[] };
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
