/* eslint-disable arrow-body-style */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllProductAttribute = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllProductAttributes'],
    () => api.get('/productattribute/all'),
    {
      enabled: true,
    }
  );

  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};