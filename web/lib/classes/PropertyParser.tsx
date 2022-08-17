import { FormatString, MCColor, RawServer } from '../types';
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
			rawDescription: JSON.stringify(this.server.description),
		};
	}

	// TODO: going to have to re write this
	private getDescriptionElement = () => {
		const desc = this.server.description;
		/* Servers handle descriptions in 3 different ways:
		1. The description prop is type string
		2. The description prop is an object containing only 1 member named 'text'
		3. The description prop is an object containing 2 members named 'text' and 'extra'
		The 'extra' member is a newer way of formatting using json (see type FormatString)
		But if the 'extra' member is non existing it means server may be using the old
		way of formatting (using formatting chars like §a or §f)
		If this is the case this function translates the old formatting to the newer one
		this is to have a consistent way of formatting the description component */

		if (typeof desc === 'string') {
			const formatStrings = this.getFormatStrings(desc);
			const elements = formatStrings.map((format, i) => (
				<this.FormattedWord key={format.text + i} {...format} />
			));
			return elements;
		}

		if (desc.text || !desc.extra) {
			const formatStrings = this.getFormatStrings(desc.text);
			const elements = formatStrings.map((format, i) => (
				<this.FormattedWord key={format.text + i} {...format} />
			));
			return elements;
		}
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

	private getFormatStrings(text: string) {
		// Split newlines or formatting chars (§x) && remove empty chars
		const splitted = text.split(/(\n)|(§[a-fk-r0-9])/g).filter((word) => word);

		const isColor = (str: string) => /§[a-f0-9]/.test(str);
		const isFormat = (str: string) => /§[k-r]/.test(str);

		let currentColor: MCColor = MCColor.white;
		let currentFormats: ReturnType<typeof this.getMCFormatting>[] = [];
		let formatStrings: FormatString[] = [];

		/* Go through each string in splitted, if string is a color format 
		string, set the current color. Formats stack, so if string is format
		save it to currentFormat array, if string is a normal text string
		create a format string object and append it to the formatStrings array */
		splitted.forEach((str) => {
			if (isColor(str)) {
				currentColor = this.getMCColor(str);
			} else if (isFormat(str)) {
				currentFormats.push(this.getMCFormatting(str));
			} else {
				formatStrings.push({
					text: str,
					color: currentColor,
					obfuscated: currentFormats.includes('obfuscated'),
					bold: currentFormats.includes('bold'),
					strikethrough: currentFormats.includes('strikethrough'),
					italic: currentFormats.includes('italic'),
					reset: currentFormats.includes('reset'),
					underline: currentFormats.includes('underline'),
				});
				// Reset formattings for next word
				currentColor = MCColor.white;
				currentFormats = [];
			}
		});
		return formatStrings;
	}

	/* TODO: italic, obfuscated, support all types of lines!! */
	private FormattedWord = ({
		bold,
		underline,
		strikethrough,
		color,
		text,
		clickEvent,
	}: FormatString) => {
		const style = {
			color,
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

	private getMCFormatting(char: string) {
		switch (char) {
			case '§k':
				return 'obfuscated';
			case '§l':
				return 'bold';
			case '§m':
				return 'strikethrough';
			case '§n':
				return 'underline';
			case '§o':
				return 'italic';
			case '§r':
				return 'reset';
			default:
				return '';
		}
	}
}

export default PropertyParser;
