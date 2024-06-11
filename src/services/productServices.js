/* eslint-disable arrow-body-style */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllActivProducts = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllActiveProducts'],
    () => api.get('/product/allActiveProduct'),
    {
      enabled: true,
    }
  );

  return {
    data: data?.data?.product,
    isLoading,
    isError,
  };
};

export const useGetAllProducts = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllProducts'],
    () => api.get('/product/all'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.product,
    isLoading,
    isError,
  };
};

export const useGetAllProductEnquiry = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllProductEnquiry'],
    () => api.get('/product/productEnquiryAll'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.productenquiry,
    isLoading,
    isError,
  };
};

export const useGetAllProductReview = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllProductReview'],
    () => api.get('/productreview/all'),
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

export const useGetProductById = (id) => {
  const { data, isError, isLoading } = useQuery(
    ['_getProductById', id],
    () => api.get(`/product/oneProduct/${id}`),
    { enabled: !!id }
  );
  return {
    data: data?.data?.oneproduct,
    isLoading,
    isError,
  };
};

export const useCreateProductImageUrl = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      // console.log('www', formData);
      return api.post('/product/uploadImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createProductImageUrl']);
        // console.log(data?.data);
      },
      onError: (error) => {
        // console.log(error);
      },
    }
  );
  return {
    mutate,
  };
};

export const useCreateProduct = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/product/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createProduct']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return {
    mutate,
  };
};
export const useDeleteProductImageById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      console.log('query', data);
      const formData = {
        imgKeys: [
          {
            Key: data.id,
          },
        ],
      };

      return api.delete(`/product/deleteImage`, { data: formData });
    },

    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createProduct']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );

  return {
    deletedata: mutate,
  };
};

export const useUpdateProductById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { mutate } = useMutation(
    (data) => {
      // console.log("DATADATA", id, data)
      return api.put(`/product/update/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllProducts']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        // enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return {
    updateProduct: mutate,
  };
};

export const useDeleteProductById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/product/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteProductById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return { deleteProduct: mutate };
};

export const useStatusUpdateProductById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?._id;
      return api.put(`/product/updateProductStatus/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_statusUpdateProductById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return {
    updateProduct: mutate,
    isLoading,
  };
};

export const useTypeUpdateProductById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?._id;
      return api.put(`/product/updateProductType/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_typeUpdateProductById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return {
    updateProductType: mutate,
    isLoading,
  };
};
export const useUpdateProductEnquiryStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (payload) => {
      const formdata = payload;
      return api.put(`/product/productEnquiryUpdateViewStatus`, formdata);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateProductEnquiryStatus']);
      },
      onError: (error) => {
        // console.log(error);
      },
    }
  );
  return {
    updateProductEnquiryStatus: mutate,
  };
};

// unique slug generator
export const useCreateProductUniqueSlug = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/product/generateslug', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createProductUniqueSlug']);
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
export const useInputFieldsUpdateProductById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?._id;
      console.log("id-=-=-=", id);
      return api.put(`/product/updateInputFields/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllProducts']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return {
    updateProductInputFields: mutate,
    isLoading,
  };
};

export const useUpdateProductStockById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?._id;
      console.log("pppp");
      return api.put(`/product/updateProductStock/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_statusUpdateProductById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return {
    updateProductStock: mutate,
    isLoading,
  };
};
export const useGetAllDeleteProductRecyclebin = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllDeleteProductRecyclebin'],
    () => api.get('/product/getdeletedatas'),
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
export const useEmptyAllDataProduct = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      return api.delete(`/product/emptyalldata`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteProductRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { EmptyAllData: mutate };
};
export const usePermanentlyDeleteProductById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/product/permanentdeletedata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteStaffRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { PermanentlyDeleteProduct: mutate };
};
export const useReStoreAllDataProduct = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      return api.put(`/product/restorealldata`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteProductRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { ReStoreAllData: mutate };
};
export const useReStoreDataProductById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.put(`/product/restoredata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteStaffRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { ReStoreData: mutate };
};

export const useStatusUpdateReviewById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?._id;
      return api.put(`/productreview/updateStatus/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllProductReview']);
        queryClient.invalidateQueries(['_statusUpdateProductById']);

        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        // console.log(error);
      },
    }
  );
  return {
    updateProductStatus: mutate,
    isLoading,
  };
};