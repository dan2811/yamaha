"use client";
import React, { useEffect, useRef } from "react";
const next5DaysThatAreDay = (day: string) => {
  let date = new Date();
  const days = [];
  let iterations = 0;
  while (days.length < 20 && iterations < 200) {
    if (date.getDay().toString() === day) {
      days.push(date);
    }
    date = new Date(date.setDate(date.getDate() + 1));
    iterations++;
  }
  return days;
};

const Register = ({ params: { day } }: { params: { day: string } }) => {
  const dummyDates = [...next5DaysThatAreDay(day)];

  return (
    <div className="flex w-full">
      <div className="w-full overflow-x-scroll">
        <table className="w-full divide-y divide-gray-100 overflow-x-scroll">
          <thead>
            <tr>
              <th className="sticky left-0 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Time</p>
              </th>
              <th className="sticky left-12 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Teacher</p>
              </th>
              <th className="sticky left-24 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Lesson</p>
              </th>
              <th className="sticky left-36 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Lesson Type</p>
              </th>
              <th className="sticky left-48 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>First Name</p>
              </th>
              <th className="sticky left-60 whitespace-nowrap border-r border-gray-200 bg-purple-200 p-1 px-2">
                <p>Last Name</p>
              </th>
              {dummyDates.map((date, idx) => (
                <th
                  key={date.toISOString() + idx}
                  className="whitespace-nowrap border-r border-gray-200 p-1 px-2"
                >
                  {date.toLocaleDateString()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((num) => (
              <tr key={num} className="hover:bg-purple-400/30">
                <td className="sticky left-0 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                  <p className="p-1">16:00</p>
                </td>
                <td className="sticky left-12 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                  <p className="p-1 text-left">David</p>
                </td>
                <td className="sticky left-24 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                  <p className="p-1">Drums</p>
                </td>
                <td className="sticky left-36 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                  <p className="p-1">Class</p>
                </td>
                <td className="sticky left-48 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                  <p className=" max-w-32 overflow-clip p-1">Daniel</p>
                </td>
                <td className="sticky left-60 whitespace-nowrap border-r border-gray-200 bg-purple-200">
                  <p className="max-w-32 overflow-clip p-1">Jordan</p>
                </td>
                {dummyDates.map((date, idx) => (
                  <td key={date.toISOString() + idx}>
                    <span className="flex gap-1">
                      <input type="checkbox" />
                      <p className="line-clamp-1 overflow-ellipsis">
                        Other info maybe something long
                      </p>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Register;
