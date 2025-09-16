import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  FormControlLabel,
  Switch,
  Slider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import api from '../../services/api';

const PRINT_TYPES = [
  { value: 'digital', label: 'Digital Printing' },
  { value: 'offset', label: 'Offset Printing' },
  { value: 'screen', label: 'Screen Printing' },
  { value: 'flexo', label: 'Flexographic' },
  { value: 'gravure', label: 'Gravure' }
];

const PAPER_TYPES = [
  { value: 'bond', label: 'Bond Paper' },
  { value: 'text', label: 'Text Paper' },
  { value: 'cover', label: 'Cover Stock' },
  { value: 'cardstock', label: 'Cardstock' },
  { value: 'glossy', label: 'Glossy Photo' },
  { value: 'matte', label: 'Matte Photo' },
  { value: 'recycled', label: 'Recycled' }
];

const FINISHING_OPTIONS = [
  { value: 'cutting', label: 'Cutting' },
  { value: 'folding', label: 'Folding' },
  { value: 'binding_saddle', label: 'Saddle Stitch Binding' },
  { value: 'binding_perfect', label: 'Perfect Binding' },
  { value: 'binding_spiral', label: 'Spiral Binding' },
  { value: 'laminating', label: 'Laminating' },
  { value: 'uv_coating', label: 'UV Coating' },
  { value: 'embossing', label: 'Embossing' },
  { value: 'foil_stamping', label: 'Foil Stamping' },
  { value: 'die_cutting', label: 'Die Cutting' }
];

const SIZE_OPTIONS = [
  { value: 'business_card', label: 'Business Card (3.5" × 2")', dimensions: { width: 89, height: 51 } },
  { value: 'postcard', label: 'Postcard (6" × 4")', dimensions: { width: 152, height: 102 } },
  { value: 'flyer', label: 'Flyer (8.5" × 11")', dimensions: { width: 216, height: 279 } },
  { value: 'brochure', label: 'Brochure (11" × 8.5")', dimensions: { width: 279, height: 216 } },
  { value: 'poster', label: 'Poster (18" × 24")', dimensions: { width: 457, height: 610 } },
  { value: 'banner', label: 'Banner (36" × 24")', dimensions: { width: 914, height: 610 } },
  { value: 'custom', label: 'Custom Size', dimensions: null }
];

const Estimator = ({ onSave }) => {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bulkEsti
