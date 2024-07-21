import { VideoMetadata } from '@remotion/media-utils';
import { useMemo } from 'react';
import { Face } from './Face';
import { TScene } from './Scenes';

type Props = {
  scene: TScene;
  videoMetadata: VideoMetadata;
  video: 1 | 2;
};

export function Faces({ scene, videoMetadata, video }: Props) {
  const facesLength = useMemo(
    () => Math.max(...scene.frames.map((frame) => frame.faces.length)),
    [scene]
  );

  const faces = useMemo(() => {
    // Find first frame with faces
    const firstFrameWithFaces = scene.frames.find(
      (frame) => frame.faces.length === facesLength
    );

    // Get the faces
    return firstFrameWithFaces?.faces ?? [];
  }, [facesLength, scene]);

  const layout = useMemo(() => {
    if (facesLength === 1) {
      return 'single';
    }

    return 'split';
  }, [facesLength]);

  return faces.map((face, index) => (
    <Face
      key={face.x1}
      face={face}
      scene={scene}
      index={index}
      layout={layout}
      videoMetadata={videoMetadata}
      video={video}
    />
  ));
}
