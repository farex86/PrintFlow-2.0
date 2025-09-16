import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  MoreVert as MoreIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'number' | 'percentage';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
  icon?: string;
  description?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend,
  format,
  color,
  icon,
  description,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp fontSize="small" />;
      case 'down':
        return <TrendingDown fontSize="small" />;
      default:
        return <TrendingFlat fontSize="small" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getBackgroundGradient = () => {
    const baseColor = theme.palette[color].main;
    return `linear-gradient(135deg, ${alpha(baseColor, 0.1)} 0%, ${alpha(baseColor, 0.05)} 100%)`;
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: getBackgroundGradient(),
          position: 'relative',
          overflow: 'visible',
          border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
          '&:hover': {
            boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.25)}`,
            '& .kpi-icon': {
              transform: 'scale(1.1)',
            },
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ p: 3, pb: '16px !important' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {icon && (
                <Box
                  className="kpi-icon"
                  sx={{
                    fontSize: '2rem',
                    transition: 'transform 0.2s ease',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  }}
                >
                  {icon}
                </Box>
              )}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 600, 
                    textTransform: 'uppercase', 
                    letterSpacing: 0.5,
                    fontSize: '0.75rem'
                  }}
                >
                  {title}
                </Typography>
                {description && (
                  <Tooltip title={description} arrow>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.7rem',
                        opacity: 0.8,
                        cursor: 'help'
                      }}
                    >
                      {description}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            </Box>
            
            <IconButton 
              size="small" 
              onClick={handleMenuClick}
              sx={{ 
                opacity: 0.7,
                '&:hover': { opacity: 1 }
              }}
            >
              <MoreIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Value */}
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 800,
              color: theme.palette[color].main,
              mb: 2,
              lineHeight: 1,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            {formatValue(value)}
          </Typography>

          {/* Change Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getTrendIcon()}
              label={`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
              size="small"
              sx={{
                backgroundColor: alpha(getTrendColor(), 0.15),
                color: getTrendColor(),
                border: `1px solid ${alpha(getTrendColor(), 0.3)}`,
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: getTrendColor(),
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              vs last period
            </Typography>
          </Box>
        </CardContent>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 180 }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <OpenIcon sx={{ mr: 1, fontSize: '1rem' }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Export Data
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Set Alert
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default KPICard;
