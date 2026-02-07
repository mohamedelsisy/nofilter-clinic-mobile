# Booking Flow Documentation

## Overview
The booking flow follows a 4-step process for patients to book appointments.

## Flow Steps

### 1. Start Booking (`index.tsx`)
- Shows booking steps overview
- Displays preselected service (if coming from service detail page)
- "Start Booking" button navigates to departments

### 2. Select Department (`departments.tsx`)
**API Endpoint**: `/site/booking/departments`
- Shows all available departments
- User selects one department
- Next button navigates to doctors screen

### 3. Select Doctor (`doctors.tsx`)
**API Endpoint**: `/site/booking/doctors?department_id={id}`
- Shows all doctors in the selected department
- Filtered by department ID
- Search functionality for doctor names and specializations
- Displays doctor photo, name, title, specialization, and consultation fee
- User selects one doctor
- Next button navigates to date-slots screen

### 4. Select Date & Time (`date-slots.tsx`)
**API Endpoint**: `/site/booking/slots?doctor_id={id}&date={date}&duration={minutes}`
- Shows calendar date picker
- User selects a date
- **Checks if doctor works on selected date**:
  - If YES (`working: true`): Shows available time slots
  - If NO (`working: false`): Shows warning "Doctor not working this day"
- Displays working hours if available
- Shows available time slots in a grid
- Disabled slots are shown but not clickable
- User selects a time slot
- Next button navigates to patient info screen

### 5. Patient Information (`patient-info.tsx`)
- User enters personal information
- Submits booking

### 6. Confirmation (`confirmation.tsx`)
- Shows booking confirmation
- Displays booking details
- Option to view booking or return to home

## API Response Structures

### Departments Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_en": "Dermatology",
      "name_ar": "الجلدية",
      "description_en": "Skin care department",
      "description_ar": "قسم العناية بالبشرة"
    }
  ]
}
```

### Doctors Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_en": "Dr. John Smith",
      "name_ar": "د. جون سميث",
      "title_en": "Dermatologist",
      "title_ar": "طبيب جلدية",
      "specialization_en": "Skin Care",
      "specialization_ar": "العناية بالبشرة",
      "photo": "https://...",
      "consultation_fee": 150
    }
  ]
}
```

### Time Slots Response
```json
{
  "success": true,
  "data": {
    "working": true,
    "working_hours": "9:00 AM - 5:00 PM",
    "slots": [
      {
        "time": "09:00",
        "display": "9:00 AM",
        "available": true
      },
      {
        "time": "09:30",
        "display": "9:30 AM",
        "available": false
      }
    ]
  }
}
```

## Key Features

1. **Department Filtering**: Doctors are filtered by selected department
2. **Doctor Availability**: System checks if doctor works on selected date
3. **Time Slot Management**: Only available slots can be selected
4. **Search Functionality**: Users can search for doctors by name or specialization
5. **Responsive UI**: All screens adapt to different screen sizes
6. **Error Handling**: Proper error messages and retry options
7. **Loading States**: Skeleton screens while fetching data
8. **Validation**: Users cannot proceed without selecting required options

## Navigation Flow
```
Start → Departments → Doctors (filtered by dept) → Date & Time (check availability) → Patient Info → Confirmation
```

## State Management
The booking flow uses Zustand store (`useBookingStore`) to manage:
- Selected department
- Selected doctor
- Selected date
- Selected time
- Duration
- Preselected service (if any)

All selections are persisted throughout the flow until completion or cancellation.
