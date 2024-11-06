import axios, { AxiosError } from "axios";
import { KarmaResponse, ErrorResponseData, ServiceInterface } from "./types";
import { logger } from "../utils/logger";

const authToken = process.env.LENDSQR_APP_KEY;

export const Service: ServiceInterface = {
  Lendsqr: {
    url: process.env.BLACKLIST || "",
    async checkIfBlacklisted(identity: string) {
      try {
        const url = `${this.url}/karma/${identity}`;
        const response = await axios.get<KarmaResponse>(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponseData>;
        const message = axiosError.response?.data?.message || "An error occurred";
        logger.info(message);
        return false;
      }
    },
  },
};
