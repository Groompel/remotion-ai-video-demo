import { loadFont } from '@remotion/google-fonts/Inter';
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Scenes } from './Scenes';

loadFont();

const container: React.CSSProperties = {
  backgroundColor: 'white',
};

const logo: React.CSSProperties = {
  justifyContent: 'center',
  alignItems: 'center',
};

type Props = {
  video: 1 | 2;
};

export const Main = ({ video }: Props) => {
  return (
    <AbsoluteFill style={container}>
      <Scenes video={video} />
    </AbsoluteFill>
  );
};
