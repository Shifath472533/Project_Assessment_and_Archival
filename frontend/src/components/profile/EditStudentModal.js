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
import { updateStudent } from "Services/OfficeService";

toast.configure();

export default function EditTask(props) {
	const { profile } = props;
	const [showModal, setShowModal] = React.useState(false);
	const [dob, setDob] = React.useState(new Date());
	const [email, setEmail] = React.useState("");
	// const [showLoading, setShowLoading] = useState(false);
	const [name, setName] = useState("");
	const [username, setUserName] = useState("");
	const [githubUsername, setGithubUsername] = useState("");

	useEffect(() => {
		if (profile) {
			setUserName(profile.username);
			setName(profile.name);
			setDob(profile.dob);
			setEmail(profile.email);
			setGithubUsername(profile.githubusername);
		}
	}, [profile]);

	const handleDateChange = (date) => {
		setDob(date);
	};

	const handleName = (event) => {
		setName(event.target.value);
	};

	const handleEmail = (event) => {
		setEmail(event.target.value);
	};
	const handleGithub = (event) => {
		setGithubUsername(event.target.value);
	};

	const handleUpdateStudent = async () => {
		setShowModal(false);
		console.log(FormatDate(dob), email, name, githubUsername, username);
		const { success, msg, data } = await updateStudent(
			username,
			name,
			FormatDate(dob),
			email,
			githubUsername
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
							<H5 color="blue">Edit Student</H5>
						</ModalHeader>
					</div>
					<ModalBody>
						<div className="flex flex-col justify-evenly items-start">
							<div className="mt-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Student Name
								</div>
								<div className="mx-10 w-7/12">
									<Input
										type="text"
										color="indigo"
										size="lg"
										outline={true}
										placeholder="Teacher Name"
										value={name}
										onChange={handleName}
									/>
								</div>
							</div>

							<div className="mt-5 mb-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Date of Birth
								</div>
								<div className="mx-10 w-7/12">
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<DatePicker
											margin="normal"
											id="date-picker-dialog"
											inputVariant="outlined"
											label="Date of birth"
											format="yyyy/MM/dd"
											value={dob}
											onChange={handleDateChange}
											animateYearScrolling
										/>
									</MuiPickersUtilsProvider>
								</div>
							</div>

							<div className="mt-5 mb-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Email
								</div>
								<div className="mx-10 w-7/12">
									<Input
										type="email"
										color="indigo"
										size="lg"
										outline={true}
										placeholder="Email"
										value={email}
										onChange={(e) => handleEmail(e)}
									/>
								</div>
							</div>

							<div className="mt-5 mb-5 w-full flex flex-row justify-between items-center">
								<div className="mx-10 w-6/12 border-l-4 text-center border-indigo-800 bg-indigo-100 text-indigo-900 font-semibold rounded-r pl-3 pr-5 text-xl shadow-md py-1">
									Github UserName
								</div>
								<div className="mx-10 w-7/12">
									<Input
										type="link"
										color="indigo"
										size="lg"
										outline={true}
										placeholder="Github Username"
										value={githubUsername}
										onChange={(e) => handleGithub(e)}
									/>
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
							onClick={handleUpdateStudent}
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
