import PropertyParser from '../../lib/classes/PropertyParser';
import { Formatting } from '../../lib/types';

const FormattedWord = ({
	bold,
	underline,
	strikethrough,
	color,
	text,
	clickEvent,
}: Formatting) => {
	const style = {
		color: PropertyParser.getMCColor(color) as string,
		textDecoration: underline
			? 'underline'
			: strikethrough
			? 'line-through'
			: '',
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

export default FormattedWord;
