import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'Hooks/Redux';
import {
  Box,
  Button,
  Dialog,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { PropertyForm, ImagesForm, TransitionDialog } from 'Components';
import {
  Close,
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded
} from '@mui/icons-material';
import convertToBase64 from 'Utils/convertFileToBase64';
import { addNewRealEstate } from 'Services/Dashboard/Dashboard.actions';
import { IrealEstates } from 'Types/Dashboard/Dashboard.types';
import compressBase64Image from 'Utils/compressBase64Image';

interface PropertyFormModalProps {
  open: boolean;
  handleClose: () => void;
  edit?: boolean;
}

const PropertyFormModal = ({
  open,
  handleClose,
  edit
}: PropertyFormModalProps) => {
  const { control, handleSubmit } = useForm();
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();

  // Steps titles
  const steps: string[] = ['Add property information', 'Add images'];

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return <PropertyForm control={control} />;
      case 1:
        return <ImagesForm control={control} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      // We do this so we don't have to set the last step to be completed
      prevActiveStep < steps.length - 1 ? prevActiveStep + 1 : prevActiveStep
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
    );
  };

  const onSubmit = handleSubmit(async (values: IrealEstates) => {
    const images: unknown[] = await Promise.all(
      values.images.map(async (image: any) => {
        const base64Image = await convertToBase64(image.value[0]);
        return await compressBase64Image(base64Image as string);
      })
    );

    return await dispatch(
      addNewRealEstate({ ...values, images } as IrealEstates)
    );
  });

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={TransitionDialog}
      >
        <form onSubmit={onSubmit}>
          <AppBar
            sx={{ position: 'relative', backgroundColor: 'primary.dark' }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <Close />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {edit ? 'Edit Property' : 'Add Property'}
              </Typography>
              <Button color="secondary" type="submit">
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <Stepper
            activeStep={activeStep}
            sx={{ width: '600px', m: '20px auto' }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderForm()}
          <Box
            sx={{
              justifyContent: 'flex-end',
              position: 'fixed',
              top: '93vh',
              right: 0,
              mr: 3
              //mb: 8
            }}
          >
            <Button
              onClick={handleBack}
              sx={{ width: '120px', mr: 2 }}
              startIcon={<ArrowBackIosNewRounded />}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              sx={{ width: '120px' }}
              endIcon={<ArrowForwardIosRounded />}
              // We do this so we don't have to set the last step to be completed
              disabled={activeStep === steps.length - 1}
            >
              Next
            </Button>
          </Box>
        </form>
      </Dialog>
    </Box>
  );
};

export default PropertyFormModal;