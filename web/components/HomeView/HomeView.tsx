import _ from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { showOpts } from '../HomeList/HomeList';
import ServerCount from '../ServerCount/ServerCount';

const HomeView = ({
	onChange,
	showing,
}: {
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	showing: typeof showOpts[number];
}) => {
	const [rendered, setRendered] = useState(false);
	useEffect(() => {
		setRendered(true);
	}, []);
	return (
		<>
			<section
				id='home-view'
				className='bg-neutral-800 flex flex-row justify-around p-2 rounded-lg md:max-w-[50%]'
			>
				{rendered && <ServerCount />}
				<div id='showing-form'>
					<form>
						<label className='font-semibold'>
							Showing: <br></br>
							<select
								className='p-[0.2rem] rounded-lg text-neutral-300 bg-neutral-800'
								name='showing'
								value={showing}
								onChange={onChange}
							>
								{showOpts.map((opt) => (
									<option key={opt} value={opt}>
										{_.startCase(opt)}
									</option>
								))}
							</select>
						</label>
					</form>
				</div>
			</section>
		</>
	);
};

export default HomeView;
