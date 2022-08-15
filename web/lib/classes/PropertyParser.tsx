import FormattedWord from '../../components/FormattedWord/FormattedWord';
import { MCColor, RawServer } from '../types';
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
				return <FormattedWord key={formatObj.text + i} {...formatObj} />;
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

	static getMCColor = (color: string) => {
		switch (color) {
			case 'black':
				return MCColor.black;
			case 'dark_blue':
				return MCColor.dark_blue;
			case 'dark_green':
				return MCColor.dark_green;
			case 'dark_aqua':
				return MCColor.dark_aqua;
			case 'dark_red':
				return MCColor.dark_red;
			case 'dark_purple':
				return MCColor.dark_purple;
			case 'gold':
				return MCColor.gold;
			case 'gray':
				return MCColor.gray;
			case 'dark_gray':
				return MCColor.dark_gray;
			case 'blue':
				return MCColor.blue;
			case 'green':
				return MCColor.green;
			case 'aqua':
				return MCColor.aqua;
			case 'red':
				return MCColor.red;
			case 'light_purple':
				return MCColor.light_purple;
			case 'yellow':
				return MCColor.yellow;
			case 'white':
				return MCColor.white;
			case 'minecoin_gold':
				return MCColor.minecoin_gold;
			default:
				return MCColor.white;
		}
	};
}

export default PropertyParser;
