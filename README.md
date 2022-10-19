
# Clinic Management System

A Node RESTful API that helps clinics manage their daily tasks.

Technologies Used: Node.js - Express.js - TypeScript - MySQL - Sequelize - Jest


## Features
- CRUD Operations for different roles and reserving appointments.
- Validation & Sanitization of Data with Sequelize & Express-Validator
- Securely Storing Passwords with bcrypt.
- Authorization & Authentication with JWT.
- Unit Testing with Jest.
- Assigning different operations based on role [ Admin - Receptionists - Doctors ].
- Patients can choose to reserve an appointment with a certian doctor or specialty.
- Patients can reschedule their appointments to the nearest date available, done using binary search algorithm.
- Doctors can view their own appointments schedule on any day.
- Receptionists can query about each doctor and specialty nearest available appointment.


## Environment Variables

To run this project, you will need to create a config folder in the root directory of the project, create dev.env & test.env files then add the following environment variables to your .env files

`PORT`
`JWT_SECRET`
`DB_DIALECT`
`DB_USERNAME`
`DB_PASSWORD`
`DB_NAME`
`ADMIN_EMAIL`
`ADMIN_PASSWORD`


## Run Locally

Clone the project

```bash
  git clone https://github.com/Ahmed-Yassen/clinic-management-system.git
```

Go to the project directory

```bash
  cd clinic-management-system
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

To run the tests

```bash
  npm run test
```




## Project Requirements
- Clinic working hours are from 5PM to 11PM, from Sunday to Thursday.
- Make sure not to create an appointment on a weekend or an old date.
- Make sure a doctor doesn't get two appointments at the same time.
- Session duration is up to 20 minutes.
- Admin creates specialties, every doctor should have a specialty.
- Receptionists data include [email, password, name, phoneNumber, salary, address]
- Doctors data include [email, password, name, phoneNumber, examinationPrice, address]
- Receptionists & Doctors should be able to update their profile data except for salary & examinationPrice.
- Only the admin can update receptionists's salaries & doctor's specialty or examinationPrices.

## API Documentation

### **-- Auth Routes --**

#### Create a new receptionist (*Requires Auth & Role: admin*)

```http
  POST /api/Auth/signup/receptionist
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**. should be between 8 and 32 characters. |
| `phoneNumber` | `string` | **Required**. A phone number that follows Egyptian phone numbers standard.  |
| `address` | `string` | **Optional**. |
| `fullName` | `string` | **Required**. |
| `salary` | `number` | **Required**. Should be atleast 2500 |

#### Create a new doctor (*Requires Auth & Role: admin*)

```http
  POST /api/Auth/signup/doctor
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**. should be between 8 and 32 characters. |
| `phoneNumber` | `string` | **Required**. A phone number that follows Egyptian phone numbers standard.  |
| `address` | `string` | **Optional**. |
| `fullName` | `string` | **Required**. |
| `examinationPrice` | `number` | **Required**. should be atleast 50 |
| `specialtyId` | `number` | **Required**. doctor's specialty,  |

#### Log user in

```http
  POST /api/Auth/login
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**. should be between 8 and 32 characters. |

#### Change user password (*Requires Auth*)

```http
  PATCH /api/Auth/changepassword
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `password` | `string` | **Required**.  |


### **-- Users Routes --**

#### Get all users (*Requires Auth & Role: admin*)

```http
  GET /api/users/login
```
#### Get current user profile (*Requires Auth*)

```http
  GET /api/users/profile
```

#### Get doctor by id (*Requires Auth & Role: admin*)

```http
  GET /api/users/doctors/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  doctor's id|

#### Get receptionist by id (*Requires Auth & Role: admin*)

```http
  GET /api/users/receptionists/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  receptionist's id|

#### Update doctor as admin (*Requires Auth & Role: admin*)

```http
  PATCH /api/users/doctors/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  receptionist's id|
| `examinationPrice` | `number` | **Optional**.  |
| `specialtyId` | `number` | **Optional**. |

#### Update receptionist as admin (*Requires Auth & Role: admin*)

```http
  PATCH /api/users/doctors/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  receptionist's id|
| `salary` | `number` | **Required**.  |

#### Remove user account (*Requires Auth & Role: admin*)

```http
  DELETE /api/users/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  user id|

### **-- Receptionists Routes --**

#### Update receptionist profile (*Requires Auth & Role: receptionist*)
```http
  PATCH /api/users/receptionists
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fullName` | `string` | **Optional**.  |
| `address` | `string` | **Optional**.  |
| `phoneNumber` | `string` | **Optional**.  |


### **-- Doctors Routes --**

#### Update receptionist profile (*Requires Auth & Role: doctor*)
```http
  PATCH /api/users/doctors
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fullName` | `string` | **Optional**.  |
| `address` | `string` | **Optional**.  |
| `phoneNumber` | `string` | **Optional**.  |

### **-- Specialty Routes --**

#### Create a specialty (*Requires Auth & Role: admin*)
```http
  POST /api/specialties
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name` | `string` | **Required**.  |

#### Get all specialties (*Requires Auth*)
```http
  GET /api/specialties
```
#### Update a specialty (*Requires Auth & Role: admin*)
```http
  PATCH /api/specialties/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  |
| `name` | `string` | **Required**.  |

#### Remove a specialty (*Requires Auth & Role: admin*)
```http
  DELETE /api/specialties/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  |


### **-- Patients Routes --**

#### Create a patient (*Requires Auth & Role: receptionist*)
```http
  POST /api/patients
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fullName` | `string` | **Required**.  |
| `phoneNumber` | `string` | **Required**.  |

#### Get all patients (*Requires Auth*)
```http
  GET /api/patients
```
#### Update a patient (*Requires Auth & Role: receptionist*)
```http
  PATCH /api/patients/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  |
| `fullName` | `string` | **Optional**.  |
| `phoneNumber` | `string` | **Optional**.  |

#### Remove a patient (*Requires Auth & Role: receptionist*)
```http
  DELETE /api/patients/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  |

### **-- Appointments Routes --**

#### Get all clinic's appointment on a specific day (*Requires Auth & Role: admin*)
```http
  GET /api/appointments/on/:day
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|

#### Get doctor's appointments on a specific day (*Requires Auth & Role: doctor*)
```http
  GET /api/doctors/appointments/on/:day
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|

#### Create an appointment with a specific doctor (*Requires Auth & Role: receptionist*)
```http
  POST /api/appointments/doctor/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. doctor's id.|
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|
| `patientId` | `number` | **Required**.|

#### Create an appointment with the nearest available doctor in the given specialty (*Requires Auth & Role: receptionist*)
```http
  POST /api/appointments/specialty/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. specialty's id.|
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|
| `patientId` | `number` | **Required**.|

#### Get a doctor's appointments on a specific day (*Requires Auth & Role: admin*)
```http
  GET /api/appointments/doctor/:id/on/:day
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. doctor's id.|
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|

#### Get a specialty's appointments on a specific day (*Requires Auth & Role: admin*)
```http
  GET /api/appointments/specialty/:id/on/:day
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. specialty's id.|
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|

#### Get a doctor's nearest available appointment on a specific day (*Requires Auth & Role: receptionist*)
```http
  GET /api/appointments/nearest/doctor/:id/on/:day
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. doctor's id.|
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|

#### Get a specialty's nearest available appointment on a specific day (*Requires Auth & Role: receptionist*)
```http
  GET /api/appointments/nearest/specialty/:id/on/:day
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. specialty's id.|
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|

#### Update an appointment (*Requires Auth & Role: receptionist*)
```http
  PATCH /api/appointments/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. appointment's id.|
| `day` | `Date` | **Required**. Should follow MM-DD-YYYY format.|
| `withSameDoctor` | `boolean` | **Required**. Indicate if the patient wants to reschedule with the same doctor or the nearest available doctor in the same specialty.|

#### Remove an appointment (*Requires Auth & Role: receptionist*)
```http
  DELETE /api/appointments/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**. appointment's id.|

## Feedback

If you have any feedback, please reach out to me at ahmed.ibrahim.yassen@gmail.com
