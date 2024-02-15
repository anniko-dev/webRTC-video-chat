import { AppBar, Typography } from '@mui/material';
import { VideoPlayer } from './components';

export const App = () => {
  return (
    <>
      <AppBar position={'static'}>
        <Typography>Meets</Typography>
      </AppBar>
      <VideoPlayer />
    </>
  );
};
