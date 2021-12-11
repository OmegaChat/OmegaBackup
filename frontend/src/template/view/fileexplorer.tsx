import { useEffect, useState } from "react";
import "../../assets/scss/files/fileExplorer.scss";
import backend from "../shared/url";

interface file {
	path: string;
	isFile: Boolean;
	name: string;
}

const FileExplorer = () => {
	const [rows, setRows] = useState<file[][]>([]);
	const [error, setError] = useState<string>("");
	const [path, setPath] = useState<string>("");
	const [showFile, setShowFile] = useState<file | undefined>(undefined);
	useEffect(() => {
		fetch(backend + "/v1/files/list", {
			method: "POST",
			credentials: "include",
		}).then((r) => {
			r.json().then((data) => {
				if (data.ok) {
					setRows([data.result]);
				} else {
					setError(data.error);
				}
			});
		});
	}, []);
	useEffect(() => {
		fetch(backend + "/v1/files/list", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				path: path + "/",
			}),
		}).then((r) => {
			r.json().then((data) => {
				if (data.ok) {
					rows.push(data.result);
					setRows(rows);
				} else {
					setError(data.error);
				}
			});
		});
	}, [path]);
	return (
		<div className="content">
			<h1 className="content__title">File Explorer</h1>
			<p className="errorMessage">{error}</p>
			<div className="content__rows">
				{rows
					? rows.map((row) => {
							return (
								<div className="rows__row">
									{row.map((file) => {
										return (
											<p
												onClick={() => {
													if (file.isFile) {
														setShowFile(file);
													} else {
														setPath(file.path);
													}
												}}
												className={
													"row__item" + (file.isFile ? "" : " row__folder")
												}
												key={file.path}
											>
												{file.name}
											</p>
										);
									})}
								</div>
							);
					  })
					: undefined}
			</div>
		</div>
	);
};

export default FileExplorer;
