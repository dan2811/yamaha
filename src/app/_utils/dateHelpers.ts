export const calculateAge = (dob: Date) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const determineDate = (date: Date) => {
  // Ignore time for comparison
  date.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return "past";
  } else if (date.getTime() === today.getTime()) {
    return "today";
  } else {
    return "future";
  }
};

export const parseDbTime = (time: string) => {
  return time.slice(0, 5);
};

export const transformNumberToWeekDay = (day: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
};

export const getYamahaMonthStartEnd = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  let defaultStartDate: string;
  let defaultEndDate: string;

  if (day >= 1 && day <= 13) {
    defaultStartDate = new Date(year, month - 1, 14, 12)
      .toISOString()
      .split("T")[0]!;
    defaultEndDate = new Date(year, month, 13, 12).toISOString().split("T")[0]!;
  } else {
    defaultStartDate = new Date(year, month, 14, 12)
      .toISOString()
      .split("T")[0]!;
    defaultEndDate = new Date(year, month + 1, 13, 12)
      .toISOString()
      .split("T")[0]!;
  }

  return { defaultStartDate, defaultEndDate };
};
