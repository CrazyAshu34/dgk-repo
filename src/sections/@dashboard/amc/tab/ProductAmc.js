import { Box, Button, DialogActions, Grid, Paper, Stack, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useGetOneAmcById } from 'services/amcServices';

ProductAmc.propTypes = {
    id: PropTypes.object,
};

export default function ProductAmc({ id }) {
    const { data, isLoading: amcIsLoading, isError: amcIsError } = useGetOneAmcById(id);
    console.log("oneAmc==", data);
    return (
        <Grid container >
            <Grid item xs={12} md={12} style={{ padding: "25px 25px 25px 25px" }}>
                <Grid container >
                    <strong>Product Details </strong>
                    {amcIsLoading ? null : data?.products.map((item, index) =>
                        <>
                            <Grid item xs={12} md={12} >({index + 1}) {item.title}</Grid>
                        </>
                    )}
                </Grid>

                <Grid container style={{ marginTop: '25px' }}>
                    <strong>Service Category </strong>
                    {amcIsLoading ? null : data?.servicecategory.map((item, index) =>
                        <>
                            <Grid item xs={12} md={12} >({index + 1}) {item.name}</Grid>
                        </>
                    )}
                </Grid>
                <Grid style={{ marginTop: '25px' }}>
                    <p><strong>Total Visit - </strong>{data?.result.total_visit}</p>

                </Grid>
                <Grid style={{ marginTop: '10px' }}>
                    <p><strong>Visit Done- </strong>{data?.result.visit_done}</p>
                </Grid>
                <Grid style={{ marginTop: '10px' }}>
                    <p><strong>Balance Visit- </strong>{data?.result.total_visit}</p>
                </Grid>
                {data?.result.invoice_file !== "" ?
                    <small style={{ textAlign: 'end' }}><a href={data?.result.invoice_file} rel="noreferrer" target="_blank">View File</a></small>
                    : null}
            </Grid>
        </Grid>
    );
}
