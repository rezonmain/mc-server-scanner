import { Formatting } from '../../lib/types';

const FormattedWord = ({
	bold,
	underline,
	strikethrough,
	color,
	text,
}: Formatting) => {
	return <span className={`text-[${color}]`}>{text}</span>;
};

export default FormattedWord;
