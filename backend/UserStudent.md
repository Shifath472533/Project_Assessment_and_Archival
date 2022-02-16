### For students:

-   Find all the taken courses: /api/students/courses

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Find a specific course: /api/students/specificCourse/:assigned_course_id

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Invite students to perform a team: /api/students/invitation/:assigned_course_id

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   team_name
        -   invited_students

-   Invitation decision: /api/students/invited/:assigned_course_id/:decision

    -   Method: PUT
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Get all task of a course: /api/students/:registered_course_id

    -   Method: GET
        -   Headers:
            -   Key: x-auth-token
            -   Value: A Unique Token Generated from login

-   Get team of a course: /api/students/team/:registered_course_id

    -   Method: GET
        -   Headers:
            -   Key: x-auth-token
            -   Value: A Unique Token Generated from login

-   Get a specific task of a course: /api/students/task/taskId

    -   Method: GET
        -   Headers:
            -   Key: x-auth-token
            -   Value: A Unique Token Generated from login

-   Submit task: /api/students/submit/:taskId

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: multipart/form-data
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body (FormData):
        -   file

-   Submit comment: /api/students/comment/:taskId

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   comment
