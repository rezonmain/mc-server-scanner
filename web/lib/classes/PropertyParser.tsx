import { Formatting, MCColor, RawServer } from '../types';
import ParsedServer from './ParsedServer';

class PropertyParser {
	server;
	constructor(server: RawServer) {
		this.server = server;
	}

	getParsedServer(): ParsedServer {
		// Default values for ParsedServer:
		const def = new ParsedServer();
		// If value not found in rawserver, return the default value as not crash the front-end
		return {
			id: this.server._id || def.id,
			ip: this.server.ip || def.ip,
			foundAt: this.server.foundAt ? this.parseTs() : def.foundAt,
			description: this.server.description
				? this.getDescriptionElement()
				: def.description,
			players: this.server.players
				? {
						max: this.server.players.max ?? -1,
						online: this.server.players.online ?? -1,
				  }
				: def.players,
			version: this.server.version?.name || def.version,
			ping: this.server.ping ?? def.ping,
			hasCustomFavicon: !!this.server.favicon,
			favicon: this.server.favicon || def.favicon,
		};
	}

	private getDescriptionElement = () => {
		const desc = this.server.description;
		/* Some servers have a string as description,
		if this is the case just return it
		(as an array to keep function type, and avoid casting). */
		if (typeof desc === 'string') {
			return [<span key={desc}>{desc}</span>];
		}
		/* The extra object contains formatting data. Also:
		some servers do have an independent text property,
		this text is usally displayed before the 'extra' data */
		const { text, extra } = desc;
		const elements =
			extra?.map((formatObj, i) => {
				return <this.FormattedWord key={formatObj.text + i} {...formatObj} />;
			}) ?? [];
		// Put text as first element to display it first
		elements.unshift(<span key='leftover'>{text}</span>);
		return elements;
	};

	private parseTs = () => {
		// Convert unix timestamp to locale date
		const ts = this.server.foundAt;
		if (!ts) return 'No data';
		const date = new Date(ts);
		const options: Intl.DateTimeFormatOptions = {
			day: '2-digit',
			month: 'short',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};
		return date.toLocaleDateString(undefined, options);
	};

	private parseDescriptionText(text: string) {}

	private FormattedWord = ({
		bold,
		underline,
		strikethrough,
		color,
		text,
		clickEvent,
	}: Formatting) => {
		const style = {
			color: this.getMCColor(color) as string,
			textDecoration: underline
				? 'underline'
				: strikethrough
				? 'line-through'
				: 'none',
			fontWeight: bold ? 'bold' : '400',
		};
		return clickEvent ? (
			<a href={text} style={style}>
				{text}
			</a>
		) : (
			<span style={style}>{text}</span>
		);
	};

	private getMCColor = (color: string) => {
		switch (color) {
			case 'black':
			case '§0':
				return MCColor.black;
			case 'dark_blue':
			case '§1':
				return MCColor.dark_blue;
			case 'dark_green':
			case '§2':
				return MCColor.dark_green;
			case 'dark_aqua':
			case '§3':
				return MCColor.dark_aqua;
			case 'dark_red':
			case '§4':
				return MCColor.dark_red;
			case 'dark_purple':
			case '§5':
				return MCColor.dark_purple;
			case 'gold':
			case '§6':
				return MCColor.gold;
			case 'gray':
			case '§7':
				return MCColor.gray;
			case 'dark_gray':
			case '§8':
				return MCColor.dark_gray;
			case 'blue':
			case '§9':
				return MCColor.blue;
			case 'green':
			case '§a':
				return MCColor.green;
			case 'aqua':
			case '§b':
				return MCColor.aqua;
			case 'red':
			case '§c':
				return MCColor.red;
			case 'light_purple':
			case '§d':
				return MCColor.light_purple;
			case 'yellow':
			case '§e':
				return MCColor.yellow;
			case 'white':
			case '§f':
				return MCColor.white;
			case 'minecoin_gold':
				return MCColor.minecoin_gold;
			default:
				return MCColor.white;
		}
	};
}

export default PropertyParser;
