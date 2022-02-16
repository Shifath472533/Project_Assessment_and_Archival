import { Switch, Route, Redirect } from "react-router-dom";
import ProjectModal from "./components/archive/ProjectModal";
import Login from "pages/Login";
import ErrorPage from "pages/ErrorPage";
import Course from "pages/archive/Course";
import Session from "pages/archive/Session";
import Project from "pages/archive/Project";
import OfficeHome from "pages/office/OfficeHome";
import Management from "pages/office/Management";
import StudentHome from "pages/student/StudentHome";
import StudentCourse from "pages/student/StudentCourse";
import StudentAllTasks from "pages/student/StudentAllTasks";
import StudentIndividualTask from "pages/student/StudentIndividualTask";
import TeacherHome from "pages/teacher/TeacherHome";
import TeacherCourse from "pages/teacher/TeacherCourse";
import TeacherTeams from "pages/teacher/TeacherTeams";
import TeacherAllTasks from "pages/teacher/TeacherAllTasks";
import TeacherIndividualTask from "pages/teacher/TeacherIndividualTask";
import OfficeStudentSession from "pages/office/OfficeStudentSession";
import StudentList from "pages/office/StudentList";
import TeacherList from "pages/office/TeacherList";
import CourseList from "pages/office/CourseList";
import CurrentCourseList from "pages/office/CurrentCourseList";
import StudentProfile from "pages/office/StudentProfile";
import TeacherProfile from "pages/office/TeacherProfile";
import CourseDetails from "pages/office/CourseDetails";
import CurrentCourseDetails from "pages/office/CurrentCourseDetails";
import AddTeacher from "pages/office/AddTeacher";
import AddStudent from "pages/office/AddStudent";
import AddCourse from "pages/office/AddCourse";
import AssignTeacher from "pages/office/AssignTeacher";
import RegisterStudent from "pages/office/RegisterStudent";

// Tailwind CSS Style Sheet
import "assets/styles/tailwind.css";

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/error_page" component={ErrorPage} />
        <Route exact path="/course" component={Course} />
        <Route exact path="/session" component={Session} />
        <Route exact path="/project" component={Project} />
        <Route exact path="/office_home" component={OfficeHome} />
        <Route exact path="/management" component={Management} />
        <Route exact path="/student_home" component={StudentHome} />
        <Route exact path="/student_curr_course" component={StudentCourse} />
        <Route exact path="/student_prev_course" component={StudentCourse} />
        <Route exact path="/student_all_tasks" component={StudentAllTasks} />
        <Route
          exact
          path="/student_individual_task"
          component={StudentIndividualTask}
        />
        <Route exact path="/teacher_home" component={TeacherHome} />
        <Route exact path="/teacher_curr_course" component={TeacherCourse} />
        <Route exact path="/teacher_prev_course" component={TeacherCourse} />
        <Route exact path="/teacher_teams" component={TeacherTeams} />
        <Route exact path="/teacher_all_tasks" component={TeacherAllTasks} />
        <Route
          exact
          path="/teacher_individual_task"
          component={TeacherIndividualTask}
        />
        <Route
          exact
          path="/office_student_session"
          component={OfficeStudentSession}
        />
        <Route exact path="/student_list" component={StudentList} />
        <Route exact path="/teacher_list" component={TeacherList} />
        <Route exact path="/course_list" component={CourseList} />
        <Route
          exact
          path="/current_course_list"
          component={CurrentCourseList}
        />
        <Route exact path="/student_profile" component={StudentProfile} />
        <Route exact path="/teacher_profile" component={TeacherProfile} />
        <Route exact path="/course_details" component={CourseDetails} />
        <Route
          exact
          path="/current_course_details"
          component={CurrentCourseDetails}
        />
        <Route exact path="/add_student" component={AddStudent} />
        <Route exact path="/add_teacher" component={AddTeacher} />
        <Route exact path="/add_course" component={AddCourse} />
        <Route exact path="/assign_teacher" component={AssignTeacher} />
        <Route exact path="/register_student" component={RegisterStudent} />
        <Route exact path="/project_modal" component={ProjectModal} />
        <Redirect from="*" to="/login" />
      </Switch>
    </>
  );
}

export default App;
