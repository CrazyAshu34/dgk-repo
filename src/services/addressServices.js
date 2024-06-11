import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useGetAddressById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getAddressById', id], () =>
    api.get(`/address/one/${id}`)
  );
  return {
    data: data?.data?.address,
    isLoading,
    isError,
  };
};
