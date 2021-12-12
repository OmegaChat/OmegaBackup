import fileMapping from "../db/models/fileMapping";

interface simpleMapping {
	_id: string;
	created: number;
}

const filterMappings = (mappings: simpleMapping[], max: number) => {
	if (mappings.length > max) {
		let compareElem = 0;
		const orderedSinceLast = mappings
			.map((elem) => {
				const mapping = {
					...elem,
					sinceLast: elem.created - compareElem,
				};
				compareElem = elem.created;
				return mapping;
			})
			.sort((a, b) => a.sinceLast - b.sinceLast);
		fileMapping.findByIdAndDelete(orderedSinceLast[0]._id).then((e) => {
			return e;
		});
		mappings.splice(
			mappings.findIndex((elem) => elem._id === orderedSinceLast[0]._id),
			1
		);
		if (orderedSinceLast.length > max) {
			filterMappings(mappings, max);
		}
	}
};

const worker = () => {
	fileMapping.find({ head: true }, (err, fileMappings) => {
		if (err) {
			console.log(err);
		}
		if (fileMappings.length > 0) {
			fileMappings.forEach((fmp) => {
				fileMapping.find(
					{ head: false, filePath: fmp.filePath },
					(err, mappings) => {
						if (err) {
							console.log(err);
						}
						if (mappings.length > 0) {
							mappings.sort(
								(a, b) => a.created.getTime() - b.created.getTime()
							);
							const lastHour: simpleMapping[] = [];
							const lastDay: simpleMapping[] = [];
							const lastMonth: simpleMapping[] = [];
							const lastUnknown: simpleMapping[] = [];
							const now = new Date().getTime();
							mappings.forEach((mapping) => {
								const created = new Date(mapping.created).getTime();
								const diff = now - mapping.created.getTime();
								if (diff < 3600000) {
									lastHour.push({ _id: mapping._id, created });
								} else if (diff < 86400000) {
									lastDay.push({ _id: mapping._id, created });
								} else if (diff < 2592000000) {
									lastMonth.push({ _id: mapping._id, created });
								} else {
									lastUnknown.push({ _id: mapping._id, created });
								}
							});
							filterMappings(lastHour, 6);
							filterMappings(lastDay, 20);
							filterMappings(lastMonth, 50);
							filterMappings(lastUnknown, 100);
						}
					}
				);
			});
		}
	});
};

export default () => {
	setInterval(worker, 10000);
};
