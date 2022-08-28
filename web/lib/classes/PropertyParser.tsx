import { nanoid } from 'nanoid';
import { CSSProperties } from 'react';
import { FAV_REGEX } from '../../utils/regex';
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
			foundAt: this.server.foundAt.toString() ? this.parseTs() : def.foundAt,
			foundBy: this.server.foundBy ?? undefined,
			description: this.server.description
				? this.getFormattedDescription()
				: def.description,
			players: this.server.players
				? {
						max: this.server.players.max ?? -1,
						online: this.server.players.online ?? -1,
						sample: this.filterPlayers(this.server.players),
				  }
				: def.players,
			version: this.server.version?.name
				? this.getFormattedVersion()
				: def.version,
			ping: this.server.ping ?? def.ping,
			hasCustomFavicon: !!this.server.favicon,
			favicon: this.server.favicon?.match(FAV_REGEX)
				? this.server.favicon
				: def.favicon,
			rawDescription: JSON.stringify(this.server.description),
		};
	}

	private getFormattedDescription = () => {
		const desc = this.server.description;
		/* Servers handle descriptions in 4 different ways:
		1. The description prop is type string
		2. The description prop is an object containing only 1 member named 'text'
		3. The descriptionp prop is an object containing 2 member names 'color' and 'text'
		4. The description prop is an object containing 2 members named 'text' and 'extra'
		The 'extra' member is a newer way of formatting using json (see type FormatString)
		But if the 'extra' member is non existing it means server may be using the old
		way of formatting (using formatting chars like §a or §f)
		If this is the case this function translates the old formatting to the newer one
		this is to have a consistent way of formatting the description component */

		/*TODO: for whatever f reason servers have also nested 'extra' see 202.61.227.56
		or 175.178.108.122*/

		if (typeof desc === 'string') {
			const formatStrings = this.getFormatStrings(desc);
			const elements = formatStrings.map((format, i) => (
				<this.FormattedWord key={nanoid()} {...format} />
			));
			return elements;
		}

		if (desc.text && !desc.extra) {
			const formatStrings = this.getFormatStrings(desc.text);
			const elements = formatStrings.map((format, i) => {
				format.color = desc.color ? this.getMCColor(desc.color) : format.color;
				return <this.FormattedWord key={format.text + i} {...format} />;
			});
			return elements;
		}
		if (desc.extra) {
			const elements = desc.extra.map((format, i) => {
				if (typeof format === 'string') {
					return <span key={'why-you-put-this-here' + i}></span>;
				}
				if (typeof format !== 'object') {
					return <span key={'empty' + 1}></span>;
				}
				format.color = this.getMCColor(format.color);
				return <this.FormattedWord key={format.text + i} {...format} />;
			});
			// If desc.text is not an empty string append it to the elements array
			!desc.text || elements.unshift(<span key={nanoid()}>{desc.text}</span>);
			return elements;
		}

		/* In the case the server description does not uses 'text' as member
		 return whatever string is in its first member,
		 this also cathces id 'text' is an empty string */
		if (typeof Object.values(desc)[0] === 'string') {
			//@ts-ignore
			return [<span key={nanoid()}>{Object.values(desc)[0]}</span>];
		}

		// If everything fails just return empty element

		return [<span key={nanoid()}></span>];
	};

	private getFormattedVersion = () => {
		const formatStrings = this.getFormatStrings(this.server.version.name);
		return formatStrings.map((format, i) => (
			<this.FormattedWord key={format.text + i} {...format} />
		));
	};

	private filterPlayers = (players: ParsedServer['players']) => {
		const def = new ParsedServer();
		if (!players.sample || players.sample.length <= 0)
			return def.players.sample;

		return players.sample.filter((player) => {
			return (
				player.name.trim().length >= 0 &&
				player.id != '00000000-0000-0000-0000-000000000000'
			);
		});
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
			second: '2-digit',
			hour12: false,
		};
		return date.toLocaleDateString('en-US', options);
	};

	private getFormatStrings(text: string) {
		// Split newlines or formatting chars (§x) && remove empty chars
		const splitted = text.split(/(\n)|(§[a-fk-r0-9])/g).filter((word) => word);

		const isColor = (str: string) => /§[a-f0-9]/.test(str);
		const isFormat = (str: string) => /§[k-r]/.test(str);

		let currentColor: MCColor | string = MCColor.white;
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

	/* TODO: obfuscated, support all types of lines!! */
	private FormattedWord = ({
		bold,
		underline,
		strikethrough,
		color,
		italic,
		text,
	}: FormatString) => {
		const style: CSSProperties = {
			color,
			textDecoration: underline
				? 'underline'
				: strikethrough
				? 'line-through'
				: 'none',
			fontWeight: bold ? 'bold' : '400',
			fontStyle: italic ? 'italic' : 'none',
			// Respect newline chars
			whiteSpace: 'pre-line',
		};
		return <span style={style}>{text}</span>;
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
				// Sometimes the server send a hex string
				return color;
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
