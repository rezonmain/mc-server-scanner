import FormattedWord from '../../component/FormattedWord/FormattedWord';
import { MCColor, RawServer } from '../types';

class PropertyParser {
	server;
	descriptionElement;
	constructor(server: RawServer) {
		this.server = server;
		this.descriptionElement = this.getDescriptionElement();
	}

	getParsedServer() {
		return {};
	}

	getDescriptionElement = () => {
		const desc = this.server.description;
		if (typeof desc === 'string') {
			return <span>{desc}</span>;
		}
		const { text, extra } = desc;
		const descriptionElArr = extra?.map((formatObj) => {
			return <FormattedWord {...formatObj} />;
		});
		return (
			<>
				{<span>{text}</span>}
				{descriptionElArr}
			</>
		);
	};

	parseTs = () => {
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
