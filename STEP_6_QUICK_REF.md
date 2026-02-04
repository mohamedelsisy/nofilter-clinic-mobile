# ⚡ Step 6: Booking Flow - Quick Reference

## 🎯 What Was Built

**Complete booking flow with 6 screens:**
1. Start → 2. Departments → 3. Doctors → 4. Date/Slots → 5. Patient Info → 6. Confirmation

## 📦 Install Required Packages

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/imcksa/mobile-app
npm install
```

**New packages added:**
- `@react-native-community/datetimepicker@8.2.0` - Date picker
- `@hookform/resolvers@^3.9.1` - Form validation resolver

## 🧪 Test the Flow

### Test 1: Booking from Tab
```
1. Tap "Booking" tab
2. Tap "Start Booking"
3. Select department
4. Select doctor
5. Pick date & time slot
6. Fill patient info:
   - Name: Mohammed Ali
   - Phone: 0512345678
   - National ID: 1234567890
   - Reason: Regular checkup
7. Submit
8. See confirmation screen
```

### Test 2: Booking from Service
```
1. Go to Services tab
2. Open any service
3. Tap "Book Appointment"
4. Notice service is shown in booking start
5. Complete flow as above
```

## 🔌 Backend Requirements

**Ensure these 4 endpoints work:**

### 1. Departments
```http
GET /site/booking/departments

Response: { success, data: [{ id, name, name_ar, name_en, ... }] }
```

### 2. Doctors
```http
GET /site/booking/doctors?department_id=1

Response: { success, data: [{ id, name, name_ar, specialization, consultation_fee, photo, ... }] }
```

### 3. Time Slots
```http
GET /site/booking/slots?doctor_id=5&date=2026-02-10&duration=30

Response: { 
  success, 
  data: { 
    working_hours: "09:00 - 17:00",
    working: true,
    slots: [{ time: "09:00", display: "09:00 AM", available: true }, ...]
  }
}
```

### 4. Submit Booking
```http
POST /site/booking
{
  "doctor_id": 5,
  "department_id": 1,
  "appointment_date": "2026-02-10",
  "appointment_time": "09:00",
  "name": "Mohammed Ali",
  "phone": "0512345678",
  "national_identity_number": "1234567890",
  "reason_for_visit": "Regular checkup"
}

Response: {
  success: true,
  data: {
    appointment: { id, patient_id, doctor_id, status, ... },
    patient: { id, name, phone, email },
    token: "1|abc123...",        // Important! For guest auto-registration
    token_type: "Bearer"
  }
}
```

**Important:** If `token` is returned, the app will store it and user becomes authenticated!

## 📱 Phone Format Handling

**User can enter any of these:**
- 009665XXXXXXXX
- 9665XXXXXXXX
- +9665XXXXXXXX
- 05XXXXXXXX

**App normalizes to:** `05XXXXXXXX` before sending to API

## ✅ Validation

**Form fields:**
- Name: min 2 chars, required
- Phone: Saudi format, required
- National ID: min 8 digits, required
- Reason: optional

**422 errors:** Automatically mapped to form fields

## 🎨 Key Features

- ✅ Guest mode (no login needed)
- ✅ Token auto-stored when returned
- ✅ Phone validation + normalization
- ✅ Date picker (iOS/Android native)
- ✅ Time slots grid with availability
- ✅ Search doctors by name/specialization
- ✅ Pull-to-refresh on lists
- ✅ Working hours display
- ✅ Loading states
- ✅ Error handling
- ✅ RTL support
- ✅ Translations (AR/EN)

## 🐛 Troubleshooting

### Module not found errors?
```bash
npm install
```

### TypeScript errors?
```bash
npx tsc --noEmit
# Should show 0 errors after npm install
```

### App won't build?
```bash
# Clear cache
npx expo start -c
```

### Navigation not working?
- Check all booking files exist in `app/(tabs)/booking/`
- Ensure `_layout.tsx` exports default function

## 📂 Files Created (10 total)

```
src/api/
├── types/booking.ts           (Types)
└── endpoints/booking.ts       (API functions)

src/store/
└── bookingStore.ts           (Updated with full state)

src/utils/
└── phoneValidation.ts        (Saudi phone validation)

app/(tabs)/booking/
├── _layout.tsx               (Stack navigator)
├── index.tsx                 (Start screen)
├── departments.tsx           (Departments list)
├── doctors.tsx               (Doctors list)
├── date-slots.tsx            (Date & time picker)
├── patient-info.tsx          (Form with validation)
└── confirmation.tsx          (Success screen)
```

## 🚀 Next Steps

1. **Install packages:** `npm install`
2. **Test booking:** Complete a test booking
3. **Verify token storage:** Check if account created
4. **Say "continue"** when ready for Step 7: Offers Module!

---

**All set! Step 6 complete! 🎉**
