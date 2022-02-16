### For teachers:

-   Find all the courses: /api/teachers/courses

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Find a specific courses: /api/teachers/specificCourse/:course_id

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Find all the teams of a course: /api/teachers/teams/:assigned_course_id

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Find a specific team: /api/teachers/specificTeam/:team_id

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Initialize a course: /api/teachers/initialization/:assigned_course_id

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   description
        -   maxMember
        -   minMember
        -   formationDate
            -   format: YYYY-MM-DD

-   Team formation decision: /api/teachers/invitedTeam/:teamInvitationId/:decision

    -   Method: PUT
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Find all the tasks of a team: /api/teachers/tasks/:teamId

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Find a specific task: /api/teachers/specificTask/:taskId

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Add a task: /api/teachers/task/:teamId

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   description
        -   totalMark
        -   title
        -   deadline

-   Add file in a task: /api/teachers/taskFile/:teamId/:taskId

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: multipart/form-data
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body (FormData):
        -   file

-   Update a task: /api/teachers/task/:taskId

    -   Method: PUT
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   description
        -   totalMark
        -   title
        -   deadline

-   Delete a task: /api/teachers/task/:taskId

    -   Method: DELETE
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Evaluate task: /api/teachers/taskEvaluation/:taskId

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   accuiredMark

-   Comment in a task: /api/teachers/comment/:taskId

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   comment

-   Add teams using CSV: /api/teachers/teamCSV/:assigned_course_id

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: multipart/form-data
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body (FormData):
        -   file

-   Update team name: /api/teachers/updateTeam/:team_id

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body :
        -   title

-   Delete team: /api/teachers/team/:team_id

    -   Method: DELETE
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body :
        -   title

-   End a Course: /api/teachers/endCourse/:course_id

    -   Method: PUT
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
