import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import ProjectCard from "../../components/archive/ProjectCard";
import NavbarComponent from "../../components/common/NavbarComponent";
import { getAllProjects } from "../../Services/ArchiveService";
import UploadProject from "../../components/archive/UploadProject";
import { usePromiseTracker } from "react-promise-tracker";
// import { trackPromise } from "react-promise-tracker";
import "../../components/loader/Loader2.css";

export default function Project(props) {
  const location = useLocation();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [courseId, setCourseId] = useState(0);
  const [year, setYear] = useState(0);
  const [projects, setProjects] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const [showLoading, setShowLoading] = useState(true);

	useEffect(() => {
		try {
			console.log(location.pathname);
			console.log(location.search);
			console.log(location.state.course.code);
			setCourseId(location.state.course._id);
			setYear(location.state.year);
		} catch (e) {
			// window.location = "/";
		}
	}, [location]);

	useEffect(() => {
		if (courseId && year) {
			async function fetchData() {
				console.log(courseId, year);
				const { success, msg, data } = await getAllProjects(
					courseId,
					year
				);
				console.log(success, msg, data);
				setProjects(data);
				//setUsers(data.userDetails);
			}
			fetchData();
			/* let arr = [];
			for (let i = 0; i < 2; i++) {
				arr.push(i);
			}
			setProjects(arr); */
		}
	}, [courseId, year]);

	useEffect(() => {
		if (projects.length > 0) {
			console.log(projects);
		}
	}, [projects]);

	return (
		<div>
			{token && (
				<div>
					<NavbarComponent props={props} />
          {/* <div class="pt-2 relative mx-auto text-gray-600">
            <input class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
          type="search" name="search" placeholder="Search"></input>
             <button class="bg-white w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
       <i class="material-icons text-xs">search</i> 
    
        </button>
            </div> */}
          {(localStorage.getItem("role") === "student" ||
							localStorage.getItem("role") === "teacher") && (
							<div className="flex flex-row justify-end my-5 xs:mx-auto mr-5">
								<UploadProject />
							</div>
						)}
					<div className="flex flex-col px-3 md:px-8">
						{projects && !projects.length && (
							<div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
								{/* No Courses to show */}
								{promiseInProgress && (
									// <h1>Hey some async call in progress ! </h1>
									<span className="loader2"></span>
								)}
							</div>
						)}
						
						<div className="container mx-auto max-w-full">
							<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-4">
								{projects.map((project) => {
									return (
										<ProjectCard
											className="mb-4"
											projectName={
												project.eachArchive.title
											}
											projectDecription={
												project.eachArchive.description
											}
											projectFileName={
												project.eachArchive.directory
											}
											projectFileSize={
												project.eachArchive.size
											}
											projectMembers={project.userInfo}
											tag={project.eachArchive.tag}
										/>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
