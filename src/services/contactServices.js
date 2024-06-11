import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllContact = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllContact'],
    () => api.get('/contactenquiry/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.enquiry,
    isLoading,
    isError,
  };
};

export const useUpdateContactById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (payload) => {
      const formdata = payload;
      return api.put(`/contactenquiry/updatestatus/`, formdata);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateContactById']);
        // enqueueSnackbar(data?.data?.message || 'error');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateContact: mutate,
  };
};
