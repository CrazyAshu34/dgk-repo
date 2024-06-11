import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllProject = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllProjects'],
    () => api.get('/project/all'),
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

export const useGetOneProjectById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneProjectById'], () =>
    api.get(`/project/one/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useCreateProject = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation((data) => api.post('/project/add', data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['_createProject', '_getAllProjects']);
      enqueueSnackbar(data?.data?.message || 'success');
    },
    onError: (error) => {
      enqueueSnackbar(error?.data?.message || 'error');
      console.log(error);
    },
  });
  return {
    createProject: mutate,
    isLoading,
  };
};

export const useUpdateProjectById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const id = data?._id;
      return api.put(`/project/update/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateProjectById', '_getAllProjects']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { updateProject: mutate, isLoading };
};

export const useDeleteProjectById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/project/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_deleteProjectById', '_getAllProjects']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteProject: mutate };
};
export const useCreateProjectUniqueSlug = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/project/generateslug', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createProjectUniqueSlug']);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return {
    generateUniqueSlug: mutate,
  };
};