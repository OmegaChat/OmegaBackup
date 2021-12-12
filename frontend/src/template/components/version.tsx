import { useState } from "react";

const forceTwoDigits = (number: number) => {
	return number < 10 ? `0${number}` : number;
};

const VersionDate = (props: {
	date: string;
	items: { created: number; path: string }[];
}) => {
	const [shown, setShown] = useState(false);
	return (
		<div className="version">
			<p className="version__date" onClick={() => setShown(!shown)}>
				{(shown ? "v " : "> ") + props.date}
			</p>
			{shown ? (
				<div className="version__items">
					{props.items.map((item) => {
						const date = new Date(item.created);
						return (
							<p className="version__item">
								{forceTwoDigits(date.getHours()) +
									":" +
									forceTwoDigits(date.getMinutes()) +
									":" +
									forceTwoDigits(date.getSeconds())}
							</p>
						);
					})}
				</div>
			) : undefined}
		</div>
	);
};

export default VersionDate;
