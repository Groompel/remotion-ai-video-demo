import { VideoMetadata } from '@remotion/media-utils';
import { OffthreadVideo, staticFile } from 'remotion';
import { VIDEO_HEIGHT } from '../../types/constants';
import { FaceContainer } from './FaceContainer';
import { TFace, TScene } from './Scenes';

type Props = {
  face: TFace;
  scene: TScene;
  index: number;
  layout: 'single' | 'split';
  videoMetadata: VideoMetadata;
  video: 1 | 2;
};

const findCenter = (x1: number, x2: number, y1: number, y2: number) => {
  return [(x1 + x2) / 2, (y1 + y2) / 2] as [number, number];
};

export function Face({
  face,
  scene,
  index,
  layout,
  videoMetadata,
  video,
}: Props) {
  const resolutionDiff = VIDEO_HEIGHT / videoMetadata.height;

  const sectionHeight = layout === 'single' ? VIDEO_HEIGHT : VIDEO_HEIGHT / 2;

  // Height of the face in the target video section
  // const faceTargetHeight = sectionHeight * (layout === 'single' ? 0.5 : 0.9);

  const faceHeightPercentage = layout === 'single' ? 0.1 : 0.4;

  const addScale =
    (sectionHeight * faceHeightPercentage) /
    ((face.y2 - face.y1) * resolutionDiff);

  const finalScale = resolutionDiff + addScale;

  // const [centerX, centerY] = findCenter(0, VIDEO_WIDTH, 0, sectionHeight);
  const [videoCenterX, videoCenterY] = findCenter(
    0,
    videoMetadata.width,
    0,
    videoMetadata.height
  );
  const [faceCenterX, faceCenterY] = findCenter(
    face.x1,
    face.x2,
    face.y1,
    face.y2
  );

  // Make sure to not move the video too much so there is no blank space
  const offsetX = Math.max(
    Math.min(videoCenterX - faceCenterX, videoMetadata.width / 2),
    -videoMetadata.width / 2
  );

  const diffY = videoCenterY - faceCenterY;
  const sec = diffY - (layout === 'single' ? diffY / 2 : 0);

  const offsetY = Math.min(diffY, sec);

  console.log(diffY, sec);

  return (
    // <Sequence from={scene.start_frame}>
    <FaceContainer layout={layout} index={index}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: videoMetadata.width,
          height: videoMetadata.height,
        }}
      >
        <OffthreadVideo
          src={staticFile(`${video}.mp4`)}
          startFrom={scene.start_frame}
          endAt={scene.end_frame}
          style={{
            position: 'absolute',

            transform: `scale(${finalScale}) translate(${offsetX}px, ${offsetY}px)`,
          }}
          name={`Face ${index + 1}`}
          muted
        />

        {/* Draw a circle in the center */}
        <div
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: 5,
            backgroundColor: '#46fa05',
            top: videoCenterY,
            left: videoCenterX,
          }}
        />

        {/* Draw a rect around the face */}

        <div
          style={{
            position: 'absolute',
            border: '2px solid red',
            top: face.y1 * resolutionDiff + offsetY,
            left: face.x1 * resolutionDiff + offsetX,
            width: (face.x2 - face.x1) * resolutionDiff,
            height: (face.y2 - face.y1) * resolutionDiff,
          }}
        />
      </div>
    </FaceContainer>
    // </Sequence>
  );
}
