const GetUsernameFromId = (userInfo, id) => {
  if (userInfo && userInfo.length > 0) {
    const targetUser = userInfo.find((user) => user._id === id);
    // console.log(targetUser.username);
    return targetUser.username;
  }
  // return "";
};

export default GetUsernameFromId;
