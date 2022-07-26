# REST API 

The entire application is contained within the [`app.js`](app.js) file.<br/>
It is developed in NodeJs using **Express** and **GraphQL HTTP Server Middleware.**

## Install dependencies
    npm install

## Run the app
    npm run start / node app.js

# ENDPOINTS
The REST API to the example app is described below.

## User

### Register A New User
`POST /graphql/createUser`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| email | `String` | ✔ |
| password | `String` | ✔ |
| username | `String` | ✔ |
| fullName | `String` | ✔ |

> #### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| user | [`User`](#type-user) | ✔ |

<br/>

### Authentication
`POST /graphql/login`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| email | `String` | ✔ |
| password | `String` | ✔ |


>#### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| token | `String` | ✕ |
>| user | [`User`](#type-user) | ✕ |

<br/>

### Get User Info
`POST /graphql/getUserData`

| Header | Type | Required |
| :-: | :-: | :-: |
| Authorization | `JWT` | ✔ |

> #### Response
> | Attributes | Type | Can be None |
> | :-: | :-: | :-: |
> | user | [`User`](#type-user) | ✔ |

<br/>

### Verify Email
`POST /graphql/verifyEmail`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| token | `String` | ✔ |

> #### Response
> | Attributes | Type | Can be None |
> | :-: | :-: | :-: |
> | user | [`User`](#type-user) | ✔ |

<br/>

### Resend Activation Link
`POST /graphql/resendActivation`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| uid | `String` | ✔ |

> #### Response
> | Attributes | Type | Can be None |
> | :-: | :-: | :-: |
> | resendActivation | String | ✕ |

<br/>

### Send Password Reset Link
`POST /graphql/sendPwResetLink`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| email | `String` | ✔ |

> #### Response
> | Attributes | Type | Can be None |
> | :-: | :-: | :-: |
> | sendPwResetLink | String | ✔ |

<br/>

### Reset Password
`POST /graphql/resetPassword`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| token | `String` | ✔ |
| newPassword | `String` | ✔ |

> #### Response
> | Attributes | Type | Can be None |
> | :-: | :-: | :-: |
> | resetPassword | String | ✔ |

<br/>

### Update User
`POST /graphql/updateUserData`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| email | `String` | ✕ |
| password | `String` | ✕ |
| username | `String` | ✕ |
| fullName | `String` | ✕|

#### Response
> | Attributes | Type | Can be None |
> | :-: | :-: | :-: |
> | user | [`User`](#type-user) | ✔ |

<br/>

## Exercises

### Get All Exercises
`POST /graphql/getExercises`

> #### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| getExercises |Array of [`Exercises`](#type-exercise) | ✔ |

<br/>

### Create An Exercise
`POST /graphql/createExercise`

| Parameters | Type | Required |
| :-: | :-: | :-: |
|\_id| `ID`| ✕ |
| name | `String` | ✔ |
| type | `String` | ✔ |

> #### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| createExercise | [`Exercise`](#type-exercise) | ✔ |

<br/>

### Delete An Exercise
`POST /graphql/deleteExercise`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| exerciseId | `String` | ✔ |

> #### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| deleteExercise | `String` | ✕ |

## Routines

### Get All Routines
`POST /graphql/getRoutines`

> #### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| getRoutines |Array of [`Routines`](#type-routine) | ✔ |

<br/>

### Create A Routine
`POST /graphql/createRoutine`

| Parameters | Type | Required |
| :-: | :-: | :-: |
|\_id| `ID`| ✕ |
| name | `String` | ✔ |
| exercises | Array of [`Exercises`](#type-exercise) |  ✕ |
| color | `String` | ✔ |


> #### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| createRoutine | [`Routine`](#type-routine) | ✔ |

<br/>

### Delete A Routine
`POST /graphql/deleteRoutine`

| Parameters | Type | Required |
| :-: | :-: | :-: |
| routineId | `String` | ✔ |

> #### Response
>| Attributes | Type | Can be None |
>| :-: | :-: | :-: |
>| deleteRoutine | `String` | ✕ |

## Types
<h3 id="type-user">User</h3>

| Field | Type | Can be None |
| :-: | :-: | :-: |
|\_id| `ID`| ✕ |
|email| `String`| ✕ |
|username| `String`| ✕ |
|fullName |`String`| ✕ |
|profilePicture |`String`|  ✔ |
|token| `String`| ✔ |
|verified|`Boolean`| ✕ |

<h3 id="type-exercise">Exercise</h3>

| Field | Type | Can be None |
| :-: | :-: | :-: |
|\_id| `ID`| ✕ |
|name| `String`| ✕ |
|type| `String`| ✕ |
|maxRep| `String`| ✕ |
|mavVol| `String`| ✕ |
|activityAt| `String`| ✔ |
| user | [`User`](#type-user) |  ✕  |

<h3 id="type-exercise">Routine</h3>

| Field | Type | Can be None |
| :-: | :-: | :-: |
|\_id| `ID`| ✕ |
|name| `String`| ✕ |
|exercises| Array of [`Exercises`](#type-exercise)| ✕ |
|color| `String`| ✕ |
| user | [`User`](#type-user) |  ✕  |