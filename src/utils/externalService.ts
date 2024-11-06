import axios, { AxiosError } from "axios";
import { KarmaResponse, ErrorResponseData, ServiceInterface } from "./types";

export const Service: ServiceInterface = {
  Lendsqr: {
    url: process.env.BLACKLIST || "",
    async checkIfBlacklisted(identity: string) {
      try {
        const url = `${this.url}/karma/${identity}`;
        const response = await axios.get<KarmaResponse>(url);
        return response.data;
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
