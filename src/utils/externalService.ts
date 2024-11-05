import axios, { AxiosError } from "axios";
import { EmployeeResponse, ErrorResponseData, ServiceInterface } from "./types";

export const Service: ServiceInterface = {
  Lendurl: {
    url: process.env.BLACKLIST || "",
    async fetchEmployee(email: string) {
      try {
        const getRecord = `${this.url}/employee_record/employee/${email}`;
        const response = await axios.get<EmployeeResponse>(getRecord);
        return response.data.data[0];
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponseData>;
        const externalError = new Error(
          axiosError.response?.data?.message || "An error occurred"
        );
        (externalError as any).status = axiosError.response?.status;
        throw externalError;
      }
    },
  },
};
