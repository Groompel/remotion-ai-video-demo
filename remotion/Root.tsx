import { Composition } from 'remotion';
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from '../types/constants';
import { Main } from './MyComp/Main';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={'Video-1'}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{ video: 1 }}
      />
      <Composition
        id={'Video-2'}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{ video: 2 }}
      />
    </>
  );
};
