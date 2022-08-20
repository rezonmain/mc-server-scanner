import { Html, Head, Main, NextScript } from 'next/document';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' />
				<link
					href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body>
				<Header />
				<Main />
				<NextScript />
				<Footer />
			</body>
		</Html>
	);
}
