/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosError } from "axios"; 

let isAlreadySetup = false;
let isRefreshing = false;
const failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

export function setupAxiosInterceptors(apiInstance: AxiosInstance) {
  if (isAlreadySetup) {
    return;
  }

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as typeof error.config & { _retry?: boolean };

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
              }
              return apiInstance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        

      }

      return Promise.reject(error);
    }
  );

  isAlreadySetup = true;
}