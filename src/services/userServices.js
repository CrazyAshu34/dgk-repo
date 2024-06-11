import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useGetOneUserById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneUserById'], () =>
    api.get(`/adminuser/adminone/${id}`)
  );
  return {
    data: data?.data?.user,
    isLoading,
    isError,
  };
};
