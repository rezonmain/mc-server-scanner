import FormattedWord from '../../components/FormattedWord/FormattedWord';
import { MCColor, ParsedServer, RawServer } from '../types';

class PropertyParser {
	server;
	descriptionElement;
	constructor(server: RawServer) {
		this.server = server;
		this.descriptionElement = this.getDescriptionElement();
	}

	getParsedServer(): ParsedServer {
		return {
			ip: this.server.ip,
			id: this.server._id,
			foundAt: this.parseTs(),
			description: this.getDescriptionElement(),
			players:
				{
					max: this.server.players.max,
					online: this.server.players.online,
				} ?? 'No data',
			version: this.server.version.name ?? 'No data',
			ping: this.server.ping ?? 'No data',
			favicon: this.server.favicon || PropertyParser.PACK_DEFUALT,
		};
	}

	private getDescriptionElement = () => {
		const desc = this.server.description;
		if (typeof desc === 'string') {
			return [<span>{desc}</span>];
		}
		// TODO: Maybe there is a better way of doing this
		const { text, extra } = desc;
		const elements =
			extra?.map((formatObj) => {
				return <FormattedWord {...formatObj} />;
			}) ?? [];
		elements.unshift(<span>{text}</span>);
		return elements;
	};

	private parseTs = () => {
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

	static PACK_DEFUALT =
		'data:image/png;base64,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';
}

export default PropertyParser;
