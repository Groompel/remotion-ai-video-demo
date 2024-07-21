import { AbsoluteFill } from 'remotion';
import { VIDEO_HEIGHT } from '../../types/constants';

type Props = {
  layout: 'single' | 'split';
  index: number;
  children: React.ReactNode;
};

export function FaceContainer({ layout, index, children }: Props) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: index === 0 ? 'red' : 'blue',
        overflow: 'hidden',

        ...(layout === 'split' && {
          top: (index * VIDEO_HEIGHT) / 2,
          height: VIDEO_HEIGHT / 2,
        }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
}
