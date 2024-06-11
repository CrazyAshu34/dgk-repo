import {
    Divider,
    Tab,
    Tabs,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Label from '../../../components/label';

SubTabs.propTypes = {
    dataFiltered: PropTypes.array,
    handleFilterStatus: PropTypes.func,
    filterStatus: PropTypes.string,
    subTabsFilterStatus: PropTypes.string,
    getLengthBySubTabsStatus: PropTypes.func,
    type: PropTypes.string,
    handleSubTabsFilterStatus: PropTypes.func,

};
export default function SubTabs({ dataFiltered, handleFilterStatus, filterStatus, subTabsFilterStatus, handleSubTabsFilterStatus, getLengthBySubTabsStatus, type }) {
    //  SHIP ROCKET ORDER LENGTH
    const [subTabs, setSubTabs] = useState([]);

    const NEW_ORDER_SUBTABS = [
        // { value: 'all', label: 'All', color: 'default', count: tableData?.length },
        { value: 'PLACED', label: 'Placed', color: 'default', count: getLengthBySubTabsStatus('PLACED') },
        {
            value: 'PROCESSING',
            label: 'On Process',
            color: 'info',
            count: getLengthBySubTabsStatus('PROCESSING'),
        },
        {
            value: 'PACKED',
            label: 'Packed Now',
            color: 'success',
            count: getLengthBySubTabsStatus('PACKED'),
        },
        {
            value: 'ASSIGN_TO_SHIPROCKET',
            label: 'Assign To Shiprocket',
            color: 'success',
            count: getLengthBySubTabsStatus('ASSIGN_TO_SHIPROCKET'),
        },
        {
            value: 'SHIPROCKET_PICKUP',
            label: 'Shiprocket Pickup',
            color: 'success',
            count: getLengthBySubTabsStatus('SHIPROCKET_PICKUP'),
        },
        {
            value: 'SHIPROCKET_IN_TRANSIT',
            label: 'Shiprocket In Transit',
            color: 'success',
            count: getLengthBySubTabsStatus('SHIPROCKET_IN_TRANSIT'),
        },
        {
            value: 'SHIPROCKET_DELIVERED',
            label: 'Shiprocket Delivered',
            color: 'success',
            count: getLengthBySubTabsStatus('SHIPROCKET_DELIVERED'),
        },

    ];
    const EXCHANGE_ORDER_SUBTABS = [
        { value: 'EXCHANGE_INITIATED', label: 'Initiated', color: 'default', count: getLengthBySubTabsStatus('EXCHANGE_INITIATED') },
        {
            value: 'EXCHANGE_ACCEPTED',
            label: 'Accepted',
            color: 'info',
            count: getLengthBySubTabsStatus('EXCHANGE_ACCEPTED'),
        },
        {
            value: 'EXCHANGE_PRODUCT_PICKED_UP',
            label: 'Picked Up',
            color: 'success',
            count: getLengthBySubTabsStatus('EXCHANGE_PRODUCT_PICKED_UP'),
        },
        {
            value: 'EXCHANGE_RECEIVED',
            label: 'Received Back',
            color: 'success',
            count: getLengthBySubTabsStatus('EXCHANGE_RECEIVED'),
        },
        {
            value: 'EXCHANGE_PROCESSING',
            label: 'On Process',
            color: 'info',
            count: getLengthBySubTabsStatus('EXCHANGE_PROCESSING'),
        },
        {
            value: 'EXCHANGE_PACKED',
            label: 'Packed Now',
            color: 'success',
            count: getLengthBySubTabsStatus('EXCHANGE_PACKED'),
        },
        {
            value: 'EXCHANGE_ASSIGN_TO_SHIPROCKET',
            label: 'Assign To Shiprocket',
            color: 'success',
            count: getLengthBySubTabsStatus('EXCHANGE_ASSIGN_TO_SHIPROCKET'),
        },
        {
            value: 'EXCHANGE_SHIPROCKET_PICKUP',
            label: 'Shiprocket Pickup',
            color: 'success',
            count: getLengthBySubTabsStatus('EXCHANGE_SHIPROCKET_PICKUP'),
        },
        {
            value: 'EXCHANGE_SHIPROCKET_IN_TRANSIT',
            label: 'Shiprocket In Transit',
            color: 'success',
            count: getLengthBySubTabsStatus('EXCHANGE_SHIPROCKET_IN_TRANSIT'),
        },
        {
            value: 'EXCHANGED',
            label: 'Shiprocket Exchanged',
            color: 'success',
            count: getLengthBySubTabsStatus('EXCHANGED'),
        },
    ];
    const RETURN_ORDER_SUBTABS = [
        { value: 'RETURN_INITIATED', label: 'Initiated', color: 'default', count: getLengthBySubTabsStatus('RETURN_INITIATED') },
        {
            value: 'RETURN_ACCEPTED',
            label: 'Accepted',
            color: 'info',
            count: getLengthBySubTabsStatus('RETURN_ACCEPTED'),
        },
        {
            value: 'RETURN_PRODUCT_PICKED_UP',
            label: 'Picked Up',
            color: 'success',
            count: getLengthBySubTabsStatus('RETURN_PRODUCT_PICKED_UP'),
        },
        {
            value: 'RETURNED',
            label: 'Received Back',
            color: 'success',
            count: getLengthBySubTabsStatus('RETURNED'),
        },
    ];
    useEffect(() => {
        setSubTabs([]);
        handleFilterStatus('', type);
        if (filterStatus === "PLACED") {
            setSubTabs(NEW_ORDER_SUBTABS);
        } else if (filterStatus === "EXCHANGE_INITIATED") {
            setSubTabs(EXCHANGE_ORDER_SUBTABS);
        } else if (filterStatus === "RETURN_INITIATED") {
            setSubTabs(RETURN_ORDER_SUBTABS);
        } else if (filterStatus === "CANCELLED") {
            setSubTabs([]);
        }

    }, [filterStatus, type]);
    useEffect(() => {
        if (filterStatus === "PLACED") {
            setSubTabs(NEW_ORDER_SUBTABS);
        } else if (filterStatus === "EXCHANGE_INITIATED") {
            setSubTabs(EXCHANGE_ORDER_SUBTABS);
        } else if (filterStatus === "RETURN_INITIATED") {
            setSubTabs(RETURN_ORDER_SUBTABS);
        } else if (filterStatus === "CANCELLED") {
            setSubTabs([]);
        }
    }, [type, dataFiltered]);
    return (
        <>
            <Tabs
                value={subTabsFilterStatus}
                onChange={handleSubTabsFilterStatus}
                sx={{
                    px: 2,
                    bgcolor: '#fbfbfb',
                }}
            >
                {subTabs?.map(tab => {
                    console.log("fjdkfjksldflsd", tab)
                    return (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={tab.label}
                            icon={
                                <Label color={tab.color} sx={{ mr: 1 }}>
                                    {tab.count}
                                </Label>
                            }
                        />
                    )
                }


                )}
            </Tabs>
            <Divider />
        </>
    );
}
