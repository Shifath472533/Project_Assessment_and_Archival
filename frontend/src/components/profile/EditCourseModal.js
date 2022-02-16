import React, { useState, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
// import TextEditor from "../DisplayTextEditor";
import H5 from "@material-tailwind/react/Heading5";
import H6 from "@material-tailwind/react/Heading6";
// import DateFnsUtils from "@date-io/date-fns";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Input from "@material-tailwind/react/Input";
import FileUploader from "../FileUploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { convertToRaw, convertFromRaw } from "draft-js";
// import Card from "@material-tailwind/react/Card";
import "../../components/loader/Loader6.css";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import FormatDate from "../../utilityFuctions/FormatDate";
import Textarea from "@material-tailwind/react/Textarea";
import { updateCourse } from "Services/OfficeService";

toast.configure();

export default function EditTask(props) {
	const { details } = props;
	const [showModal, setShowModal] = React.useState(false);
	// const [showLoading, setShowLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [semester, setSemester] = useState("select");
	const [credit, setCredit] = useState("select");
	const [description, setDescription] = useState(0);
	const [semesters, setSemesters] = useState([
		"1/1",
		"1/2",
		"2/1",
		"2/2",
		"3/1",
		"3/2",
		"4/1",
		"4/2",
	]);

	useEffect(() => {
		if (details) {
			setTitle(details.title);
			setCredit(details.credit);
			setSemester(details.semester);
			setDescription(details.description);
		}
	}, [details]);

	const handleTitle = (event) => {
		setTitle(event.target.value);
	};

	const handleSemester = (event) => {
		setSemester(event.target.value);
	};

	const handleDescription = (event) => {
		setDescription(event.target.value);
	};

	const handleCredit = (event) => {
		setCredit(event.target.value);
	};

	const handleUpdateTask = async () => {
		setShowModal(false);
		console.log(title, semester, credit, description, details);
		const { success, msg, data } = await updateCourse(
			title,
			details.code,
			credit,
			semester,
			description
		);
		console.log(success, msg, data);
	};

	return (
		<div>
			<Button
				buttonType="outline"
				size="regular"
				rounded={true}
				block={false}
				iconOnly={true}
				ripple="light"
				color="green"
				onClick={(e) => setShowModal(true)}
			>
				<Icon
					name="edit"
					size="md"
					onClick={(e) => setShowModal(true)}
				/>
			</Button>
			<Modal
				className="mb-5 flex flex-row justify-center content-center"
				size="lg"
				active={showModal}
				toggler={() => setShowModal(false)}
			>
				<div className="my-2">
					<div className="flex flex-row justify-center">
						<ModalHeader
							className="text-center"
							toggler={() => setShowModal(false)}
						>
							<H5 color="blue">Edit Course</H5>
						</ModalHeader>
					</div>
					<ModalBody>
						<div className="flex flex-col justify-evenly items-start">
							<div className="mt-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Course Title
								</div>
								<div className="mx-10 w-7/12">
									<Input
										type="text"
										color="indigo"
										size="lg"
										outline={true}
										placeholder="Course Title"
										value={title}
										onChange={handleTitle}
									/>
								</div>
							</div>

							<div className="mt-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Course Description
								</div>
								<div className="mx-10 w-7/12">
									<Textarea
										color="indigo"
										size="regular"
										outline={true}
										placeholder="Course Description"
										name="description"
										value={description}
										onChange={(e) => handleDescription(e)}
									/>
								</div>
							</div>

							<div className="mt-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Credit
								</div>
								<div className="mx-10 w-7/12">
									<FormControl
										className=" w-full"
										variant="outlined"
									>
										<InputLabel id="Credit">
											Credit
										</InputLabel>
										<Select
											labelId="Credit"
											id="Credit"
											name="credit"
											value={credit}
											onChange={handleCredit}
											label="Credit"
										>
											<MenuItem value={"1"}>1</MenuItem>
											<MenuItem value={"1.5"}>
												1.5
											</MenuItem>
											<MenuItem value={"2"}>2</MenuItem>
											<MenuItem value={"2.5"}>
												2.5
											</MenuItem>
											<MenuItem value={"3"}>3</MenuItem>
											<MenuItem value={"3.5"}>
												3.5
											</MenuItem>
											<MenuItem value={"4"}>4</MenuItem>
										</Select>
									</FormControl>
								</div>
							</div>

							<div className="mt-5 mb-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Semester
								</div>
								<div className="mx-10 w-7/12">
									<FormControl
										className=" w-full"
										variant="outlined"
									>
										<InputLabel id="Semester">
											Semester
										</InputLabel>
										<Select
											labelId="Semester"
											id="Semester"
											name="credit"
											value={semester}
											onChange={handleSemester}
											label="Semester"
										>
											{semesters.map((sem) => {
												return (
													<MenuItem
														value={`${
															semesters.indexOf(
																sem
															) + 1
														}`}
													>
														{sem}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</div>
							</div>
						</div>

						{/* <ToastContainer
              toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
              bodyClassName="text-sm font-white font-med block p-3"
              position="top-right"
              autoClose="3000"
            /> */}
					</ModalBody>
					<ModalFooter>
						<Button
							color="red"
							buttonType="outline"
							onClick={(e) => setShowModal(false)}
							ripple="dark"
						>
							<Icon name="cancel" size="xl" />
							Cancel
						</Button>

						<Button
							color="blue"
							onClick={handleUpdateTask}
							ripple="light"
						>
							<Icon name="update" size="xl" />
							Update
						</Button>
					</ModalFooter>
				</div>
			</Modal>
		</div>
	);
}
