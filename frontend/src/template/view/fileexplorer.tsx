import { useEffect, useState } from "react";
import "../../assets/scss/files/fileExplorer.scss";
import backend from "../shared/url";
import { format } from "timeago.js";
import Versions from "../components/versions";

export const replaceLast = (str: string, find: string, replace: string) => {
	const index = str.lastIndexOf(find);
	if (index > -1) {
		return (
			str.substring(0, index) + replace + str.substring(index + find.length)
		);
	}
	return str;
};

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
	const [showFile, setShowFile] = useState<string | undefined>(undefined);
	const [selectedFileDetails, setSelectedFileDetails] = useState<
		fileInfo | undefined
	>(undefined);
	const [search, setSearch] = useState<string>("");
	const [searchResults, setSearchResults] = useState<
		{ name: string; id: string; path: string }[]
	>([]);
	useEffect(() => {
		if (search.length > 0) {
			fetch(backend + "/v1/files/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: search,
				}),
				credentials: "include",
			}).then((r) => {
				r.json().then((res) => {
					if (res.ok) {
						setSearchResults(res.result);
					}
				});
			});
		} else {
			setSearchResults([]);
		}
	}, [search]);
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
					path: showFile,
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
			<div className="content__search">
				<input
					onChange={({ target: { value } }) => {
						setSearch(value);
					}}
					placeholder="Search"
					type="text"
					className="search__input"
				></input>
				{searchResults.length > 0 ? (
					<div className="search__results">
						{searchResults.map((r) => (
							<div
								className="results__result"
								onClick={() => {
									setSearchResults([]);
									setShowFile(r.path);
								}}
							>
								{r.name}
							</div>
						))}
					</div>
				) : undefined}
			</div>
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
															setShowFile(file.path);
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
							<h1 className="selected__filename">
								{selectedFileDetails.head.fileName}
							</h1>
							<p className="selected__lastversion">
								{format(selectedFileDetails.head.created)}
							</p>

							<div>
								{selectedFileDetails.versions.length ? (
									<Versions versions={selectedFileDetails.versions} />
								) : (
									<h3 className="selected__versions">
										No File History Available
									</h3>
								)}
							</div>
							<div className="selected__download">
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={
										backend +
										"/v1/files/open/" +
										replaceLast(
											encodeURIComponent(selectedFileDetails.head.path),
											"%2F",
											"/"
										)
									}
								>
									<button className="download__button">Download</button>
								</a>
							</div>
						</div>
					) : undefined
				) : undefined}
			</div>
		</div>
	);
};

export default FileExplorer;
