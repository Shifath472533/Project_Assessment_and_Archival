### For office users:

-   Add teacher using CSV: /api/offices/teacher/addCSV

    -   Method: POST
        -   Headers:
        -   Key1: Content-Type
        -   Value1: multipart/form-data
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body (FormData):
        -   file

-   Add teacher: /api/offices/teacher/add

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   username
        -   name
        -   designation
        -   dob (date of birth)
            -   format: YYYY-MM-DD
        -   email
        -   githubusername (optional)

-   Update teacher: /api/offices/teacher/update

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   username
        -   name
        -   designation
        -   dob (date of birth)
            -   format: YYYY-MM-DD
        -   email
        -   githubusername (optional)

-   Delete teacher: /api/offices/teacher/delete

    -   Method: DELETE
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   username
        -   \_id

-   Add student using CSV: /api/offices/student/addCSV

    -   Method: POST
        -   Headers:
        -   Key1: Content-Type
        -   Value1: multipart/form-data
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body (FormData):
        -   file

-   Add student: /api/offices/student/add

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   username
        -   name
        -   session
        -   dob (date of birth)
            -   format: YYYY-MM-DD
        -   email
        -   githubusername (optional)

-   Update student: /api/offices/student/update

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   username
        -   name
        -   dob (date of birth)
            -   format: YYYY-MM-DD
        -   email
        -   githubusername (optional)

-   Delete student: /api/offices/student/delete

    -   Method: DELETE
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   username
        -   \_id

-   Add course: /api/offices/course/add

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   title
        -   code
        -   credit
        -   semester

-   Remove course: /api/offices/course/remove

    -   Method: DELETE
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   code

-   Update course: /api/offices/course/update

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   title
        -   code
        -   credit
        -   semester

-   Assign teacher in course: /api/offices/teacher/assign_course

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   course_id
        -   teacher_id
        -   year

-   Unassign teacher from course: /api/offices/teacher/unassign_course

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   course_id
        -   teacher_id
        -   year

-   Register student in course: /api/offices/student/register_course

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   course_id
        -   username
        -   year

-   Register student in course using CSV: /api/offices/student/register_courseCSV

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: multipart/form-data
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body (FormData):
        -   file

-   Unregister student from course: /api/offices/student/unregister_course

    -   Method: POST
    -   Headers:
        -   Key1: Content-Type
        -   Value1: application/json
        -   Key2: x-auth-token
        -   Value2: A Unique Token Generated from login
    -   Body:
        -   assigned_course_id
        -   student_username
        -   year

-   Show all the teachers: /api/offices/teacher

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Show all the courses: /api/offices/courses

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Show all the running courses: /api/offices/running_courses

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Show all the students of a specific session: /api/offices/students/:session

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Show a specific course using code: /api/offices/course/:code

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Show a specific course using semester: /api/offices/courseSemester/:semester

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Show a specific student: /api/users/student/profile/:user_id

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Show a specific teacher: /api/users/teacher/profile/:user_id

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login
