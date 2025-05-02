import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./Components/LoadingSpinner";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      config => {
        setLoading(true);
        return config;
      },
      error => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const resInterceptor = axios.interceptors.response.use(
      response => {
        setLoading(false);
        return response;
      },
      error => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <LoadingSpinner />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
