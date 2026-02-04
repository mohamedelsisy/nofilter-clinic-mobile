import { create } from 'zustand';
import { ServiceListItem } from '@/api/types/services';
import { Department, BookingDoctor } from '@/api/types/booking';

interface PatientFormData {
  name: string;
  phone: string;
  national_identity_number: string;
  reason_for_visit: string;
}

interface BookingState {
  // Preselected service from Services module
  preselectedService: ServiceListItem | null;
  
  // Selected department (full object)
  selectedDepartment: Department | null;
  
  // Selected doctor (full object)
  selectedDoctor: BookingDoctor | null;
  
  // Selected date (YYYY-MM-DD)
  selectedDate: string | null;
  
  // Selected time slot ("HH:mm")
  selectedTime: string | null;
  
  // Duration in minutes
  duration: number;
  
  // Patient form data
  patientForm: PatientFormData;
  
  // Actions
  setPreselectedService: (service: ServiceListItem | null) => void;
  setDepartment: (department: Department | null) => void;
  setDoctor: (doctor: BookingDoctor | null) => void;
  setDate: (date: string | null) => void;
  setTime: (time: string | null) => void;
  setDuration: (duration: number) => void;
  setPatientForm: (form: Partial<PatientFormData>) => void;
  resetBooking: () => void;
}

const initialPatientForm: PatientFormData = {
  name: '',
  phone: '',
  national_identity_number: '',
  reason_for_visit: '',
};

export const useBookingStore = create<BookingState>((set) => ({
  preselectedService: null,
  selectedDepartment: null,
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,
  duration: 30,
  patientForm: initialPatientForm,

  setPreselectedService: (service) => {
    set({ preselectedService: service });
  },

  setDepartment: (department) => {
    set({ selectedDepartment: department });
  },

  setDoctor: (doctor) => {
    set({ selectedDoctor: doctor });
  },

  setDate: (date) => {
    set({ selectedDate: date });
  },

  setTime: (time) => {
    set({ selectedTime: time });
  },

  setDuration: (duration) => {
    set({ duration });
  },

  setPatientForm: (form) => {
    set((state) => ({
      patientForm: { ...state.patientForm, ...form },
    }));
  },

  resetBooking: () => {
    set({
      preselectedService: null,
      selectedDepartment: null,
      selectedDoctor: null,
      selectedDate: null,
      selectedTime: null,
      duration: 30,
      patientForm: initialPatientForm,
    });
  },
}));
