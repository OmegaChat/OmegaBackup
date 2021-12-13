import { useState } from "react";
import backend from "../shared/url";
import { replaceLast } from "../view/fileexplorer";

// const forceTwoDigits = (number: number) => {
// 	return number < 10 ? `0${number}` : number;
// };

const VersionDate = (props: {
	date: string;
	items: { created: number; path: string }[];
}) => {
	const [shown, setShown] = useState(false);
	return (
		<div className="version">
			<p
				className={
					"version__toggle" + (shown ? " version__toggle--toggled" : "")
				}
			>
				&gt;
			</p>
			<p className="version__date" onClick={() => setShown(!shown)}>
				{props.date}
			</p>
			{shown ? (
				<div className="version__items">
					{props.items.map((item) => {
						const date = new Date(item.created);
						return (
							<a
								target="_blank"
								rel="noreferrer"
								href={
									backend +
									"/v1/files/open/" +
									replaceLast(encodeURIComponent(item.path), "%2F", "/")
								}
							>
								<p className="version__item">{date.toLocaleTimeString()}</p>
							</a>
						);
					})}
				</div>
			) : undefined}
		</div>
	);
};

export default VersionDate;
