const GetNameFromId = (studentInfo, id) => {
  if (studentInfo && studentInfo.length > 0) {
    const targetStudent = studentInfo.find((student) => student.user === id);
    // console.log(targetStudent.name);
    return targetStudent.name;
  }
  return "";
};

export default GetNameFromId;
