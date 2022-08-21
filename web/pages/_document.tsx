import { Html, Head, Main, NextScript } from 'next/document';
import Footer from '../components/Footer/Footer';

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel='shortcut icon' href='/images/favicon.ico' />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' />
				<link
					href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
				<Footer />
			</body>
		</Html>
	);
}
