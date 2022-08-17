import React, { useState } from 'react';
import { AllowedUserQuery } from '../../lib/types';
import { IP_REGEX } from '../../utils/regex';

enum ValidateRes {
	'NOT_IP' = 0,
	'OK' = 1,
}
const SearchForm = ({
	handleSubmit,
}: {
	handleSubmit: (
		query: AllowedUserQuery,
		input: object,
		clientValidationError: boolean | string
	) => void;
}) => {
	const [formData, setFormData] = useState<{
		filterBy: AllowedUserQuery;
		searchText: string;
	}>({
		filterBy: 'mostRecent',
		searchText: '',
	});

	function onChange(
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
	) {
		const { name, value } = e.target;
		setFormData((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	}

	const validateIP = (ip: string): [ValidateRes, string] => {
		if (!IP_REGEX.test(ip)) return [0, ip];
		// For now only support one ip
		ip = (ip.match(IP_REGEX) as RegExpExecArray)[0];
		return [1, ip];
	};

	const onSubmit = (e?: React.MouseEvent) => {
		e && e.preventDefault();
		let input: object = {};
		let error: boolean | string = false;
		switch (formData.filterBy) {
			case 'mostRecent':
				input = {};
				break;
			case 'findByIp':
				// Do client side validation of ip
				const [res, ip] = validateIP(formData.searchText);
				// If there was a error in validation
				if (!res) {
					error = 'Invalid IP';
				}
				input = {
					ip,
				};
				break;
		}
		handleSubmit(formData.filterBy, input, error);
	};

	return (
		<>
			<form className='flex flex-col gap-3'>
				<label htmlFor='filterBy'>Filter By:</label>
				<section className='flex flex-row flex-wrap gap-3'>
					<select onChange={onChange} name='filterBy'>
						<option value={'mostRecent'}>Most Recent</option>
						<option value={'findByIp'}>IP address</option>
					</select>
					<input
						disabled={formData.filterBy === 'mostRecent' ? true : false}
						onChange={onChange}
						type='search'
						name='searchText'
						className=' disabled:text-neutral-500 w-36'
					></input>
					<button
						className='bg-neutral-700 px-2'
						onClick={onSubmit}
						name='searchBtn'
					>
						Apply
					</button>
				</section>
			</form>
		</>
	);
};

export default SearchForm;
