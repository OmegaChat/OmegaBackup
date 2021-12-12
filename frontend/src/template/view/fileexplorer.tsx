import { useEffect, useState } from "react";
import "../../assets/scss/files/fileExplorer.scss";
import backend from "../shared/url";
import { format } from "timeago.js";
import Versions from "../components/versions";

interface file {
	path: string;
	isFile: Boolean;
	name: string;
}

interface fileInfo {
	head: {
		created: number;
		fileName: string;
		path: string;
		mimeType: string;
	};
	versions: {
		created: number;
		path: string;
	}[];
}

const FileExplorer = () => {
	const [rows, setRows] = useState<file[][]>([]);
	const [error, setError] = useState<string>("");
	const [path, setPath] = useState<string>("");
	const [cursorPosition, setCursorPosition] = useState<number>(0);
	const [state, setState] = useState<number>(0);
	const [showFile, setShowFile] = useState<file | undefined>(undefined);
	const [selectedFileDetails, setSelectedFileDetails] = useState<
		fileInfo | undefined
	>(undefined);
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
					// rows.push(data.result);
					rows[cursorPosition + 1] = data.result;
					rows.length = cursorPosition + 2;
					setState(state + 1);
					setRows(rows);
				} else {
					setError(data.error);
				}
			});
		});
	}, [path]);
	useEffect(() => {
		if (showFile) {
			fetch(backend + "/v1/files/info", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					path: showFile.path,
				}),
			}).then((r) => {
				r.json().then((data) => {
					if (data.ok) {
						setSelectedFileDetails(data.result);
					} else {
						setError(data.error);
					}
				});
			});
		}
	}, [showFile]);
	return (
		<div className="content">
			<h1 className="content__title">File Explorer</h1>
			<p className="errorMessage">{error}</p>
			<div className="content__rows">
				{rows
					? rows.map((row, rowIndex) => {
							return (
								<div key={rowIndex} className="rows__row">
									{row.length ? (
										row.map((file) => {
											return (
												<p
													onClick={() => {
														if (file.isFile) {
															setShowFile(file);
														} else {
															setShowFile(undefined);
															setCursorPosition(rowIndex);
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
										})
									) : (
										<p className="rows__nocontent">No files found</p>
									)}
								</div>
							);
					  })
					: undefined}
				{showFile ? (
					selectedFileDetails ? (
						<div className="rows__row rows__selected">
							<h1>{selectedFileDetails.head.fileName}</h1>
							<p className="selected__lastversion">
								{format(selectedFileDetails.head.created)}
							</p>

							<div>
								{selectedFileDetails.versions.length ? (
									<Versions versions={selectedFileDetails.versions} />
								) : (
									<h3 className="selected__versions">
										{selectedFileDetails.versions.length} versions
									</h3>
								)}
							</div>
							<div className="selected__download">
								<button className="download__button">Download</button>
							</div>
						</div>
					) : undefined
				) : undefined}
			</div>
		</div>
	);
};

export default FileExplorer;
