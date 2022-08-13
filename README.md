
# Clinic Management System

A Node RESTful API that helps clinics manage their daily tasks.

Technologies Used: Node.js - Express.js - TypeScript - MySQL - Sequelize - Jest


## Features

- Assigning different tasks based on role [ Admin - Receptionists - Doctors ].
- Handling all clinic's specialties & the doctors assigned to each specialty.
- Patients can choose to book an appointment with a specific doctor or any doctor in the required specialty.
- Patients can reschedule their appointments to the nearest date available.
- Finding nearest appointment depending on patient's request, either with a specific doctor or any doctor in the required specialty.
- Doctors can view their own appointments schedule on any day.

## Requirements
- Clinic working hours are from 5PM to 11PM, from Sunday to Thursday.
- Make sure a doctor doesn't get two appointments at the same time.
- Session duration is up to 20 minutes.
- Make sure not to create an appointment on a weekend or an old date.
- Admin creates specialties, every doctor should have a specialty.
- Receptionists data include [email, password, name, phoneNumber, salary, address]
- Doctors data include [email, password, name, phoneNumber, examinationPrice, address]
- Receptionists & Doctors should be able to update their profile data except for salary & examinationPrice.
- Admin can update receptionists salaries & doctor's specialty or examinationPrices.
### Admin Tasks:
- Create, update & delete Specialties (Specialty name should be unique).
- Create, read & delete Users (Doctors & Receptionists), can only update a receptionist's salary or a doctor's examination price.
- Read all clinic's appointments at any given date.

### Receptionists Tasks:
- Update their profile data, except salary.
- Create, read, update & delete Patients {name , phoneNumber}.
- Create appointments with a specific docotr in the nearest appointment available.
- Create appointments in a certian specialty with the nearest doctor available.
- Read nearest appointments available, either for a specific doctor or a specialty.
- Update appointments dates, to the nearest appointment either with the same doctor or any other doctor in the same specialty.
- Delete appointments.

### Doctors Tasks:
- Update their profile data, except examinationPrice.
- View their own appointments-schedule on any day.
## Feedback

If you have any feedback, please reach out to me at ahmed.ibrahim.yassen@gmail.com
