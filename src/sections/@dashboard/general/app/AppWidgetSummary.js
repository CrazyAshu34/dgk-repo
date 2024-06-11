import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'components/chart';
import Label from '../../../../components/label/Label';
import { StyledIcon } from '../../../../components/nav-section/horizontal/styles';
import { fNumber } from '../../../../utils/formatNumber';
// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  sx: PropTypes.object,
  icon: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  totalNewNotify: PropTypes.number,
  percent: PropTypes.object,
  chartColor: PropTypes.string,
  chartData: PropTypes.object,
};

export default function AppWidgetSummary({
  icon,
  title,
  percent,
  total,
  totalNewNotify,
  chartColor,
  chartData,
  sx,
  ...other
}) {
  const theme = useTheme();
  const chartOptions = {
    colors: [chartColor],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `@${seriesName}`,
        },
      },
      marker: { show: false },
    },
  };

  console.log('totalNewNotify', totalNewNotify);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">
          <StyledIcon sx={{ float: 'left' }}>{icon}</StyledIcon>
          {title}
        </Typography>
        <Typography variant="h3">{total}</Typography>
      </Box>

      <Box>
        {totalNewNotify > 0 ? (
          <Box sx={{ pb: 5 }}>
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color="error"
              sx={{ float: 'right', color: 'red', background: '#ff00001a' }}
            >
              New {totalNewNotify}
            </Label>
          </Box>
        ) : null}

        <Chart
          type="bar"
          series={[{ data: chartData }]}
          options={chartOptions}
          width={60}
          height={36}
        />
      </Box>
    </Card>
  );
}
