import { format } from "date-fns-jalali";

export const toJalali = (date, formatStr = "PPP") => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error converting date to Jalali:", error);
    return "تاریخ نامعتبر";
  }
};
