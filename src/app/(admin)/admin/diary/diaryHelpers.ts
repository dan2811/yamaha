export const generateTimeIntervals = (
  startTime: string,
  endTime: string,
): string[] => {
  console.log(
    `generating times for diary starting with ${startTime} and ending with ${endTime}`,
  );
  const times: string[] = [];

  const [startHour, startMinute] = startTime
    .split(":")
    .map((str) => parseInt(str, 10));
  const [endHour, endMinute] = endTime
    .split(":")
    .map((str) => parseInt(str, 10));

  if (
    typeof startHour !== "number" ||
    typeof startMinute !== "number" ||
    typeof endHour !== "number" ||
    typeof endMinute !== "number"
  ) {
    throw new Error("Invalid time format");
  }

  for (
    let currentHour = startHour - 1, currentMinute = startMinute;
    currentHour <= (endHour ?? 23) ||
    (currentHour === endHour && currentMinute < (endMinute ?? 0));
    currentHour++
  ) {
    console.log("Generated: ", currentHour, currentMinute);
    const date = new Date(new Date().setHours(currentHour, currentMinute));
    times.push(
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    );
    date.setMinutes(date.getMinutes() + 30);
    times.push(
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    );
  }

  return times;
};
