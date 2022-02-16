const GetProjectMembers = (userInfo, studentsInfo) => {
  const teamMembers = [];
  if (
    userInfo &&
    userInfo.length > 0 &&
    studentsInfo &&
    studentsInfo.length > 0
  ) {
    for (let i = 0; i < userInfo.length; i++) {
      teamMembers.push({
        _id: userInfo[i]._id,
        name: studentsInfo[i].name,
        username: userInfo[i].username,
      });
    }
    console.log(teamMembers);
  }

  return teamMembers;
};

export default GetProjectMembers;
