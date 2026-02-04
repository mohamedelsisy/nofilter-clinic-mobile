import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function BookingLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="departments"
        options={{
          title: t('select_department'),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen
        name="doctors"
        options={{
          title: t('select_doctor'),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen
        name="date-slots"
        options={{
          title: t('select_date_time'),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen
        name="patient-info"
        options={{
          title: t('patient_information'),
          headerBackTitle: t('back'),
        }}
      />
      <Stack.Screen
        name="confirmation"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
