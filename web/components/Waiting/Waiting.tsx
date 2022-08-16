const Waiting = ({ className }: { className: string }) => {
	return (
		<span
			className={`animate-pulse inline-block rounded-lg ${className}`}
		></span>
	);
};

export default Waiting;
