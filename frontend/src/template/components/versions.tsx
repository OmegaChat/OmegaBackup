import "../../assets/scss/files/versions.scss";
import VersionDate from "./version";

interface props {
	versions: { created: number; path: string }[];
}

const Versions = (props: props) => {
	const dates: { [key: string]: { created: number; path: string }[] } = {};
	props.versions.forEach((version) => {
		const date = new Date(version.created);
		const dateString =
			date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
		if (dates[dateString]) {
			dates[dateString].push(version);
		} else {
			dates[dateString] = [version];
		}
	});
	return (
		<div className="versions">
			<h2>Versions</h2>
			{Object.keys(dates).map((date) => {
				return (
					<div className="versions__date">
						<VersionDate date={date} items={dates[date]} />
					</div>
				);
			})}
		</div>
	);
};

export default Versions;
