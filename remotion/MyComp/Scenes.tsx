import { Audio, Sequence, staticFile } from 'remotion';

// {
//     "frame_number": 7,
//     "faces": [
//       {
//         "x1": 488,
//         "y1": 70,
//         "x2": 543,
//         "y2": 125,
//         "speaking_score": -0.033333333830038704,
//         "active": false
//       },
//       {
//         "x1": 106,
//         "y1": 56,
//         "x2": 161,
//         "y2": 111,
//         "speaking_score": -1.4333333174387615,
//         "active": false
//       }
//     ],
//     "related_scene": {
//       "start_seconds": 0,
//       "end_seconds": 4.68,
//       "start_frame": 0,
//       "end_frame": 116,
//       "start_timecode": "00:00:00.000",
//       "end_timecode": "00:00:04.679",
//       "scene_number": 0
//     }
//   },

/**
 * Data is an array of objects with the following structure:
 *
 * {
 *  frame_number: number,
 *  faces: [
 *   {
 *   x1: number,
 *   y1: number,
 *   x2: number,
 *   y2: number,
 *   speaking_score: number,
 *    active: boolean
 *  }
 * ],
 *
 * related_scene: {
 *  start_seconds: number,
 *  end_seconds: number,
 *  start_frame: number,
 *  end_frame: number,
 *  start_timecode: string,
 *  end_timecode: string,
 *  scene_number: number
 * }
 *
 *
 * }
 */
import { getVideoMetadata, VideoMetadata } from '@remotion/media-utils';
import { useEffect, useState } from 'react';

import data1 from '../../assets/1.json';
import data2 from '../../assets/2.json';

import { Faces } from './Faces';

export type TFace = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  speaking_score: number;
  active: boolean;
};

export type TFrame = {
  frame_number: number;
  faces: TFace[];
  related_scene: Omit<TScene, 'frames'>;
};

export type TScene = {
  frames: TFrame[];
  start_seconds: number;
  end_seconds: number;
  start_frame: number;
  end_frame: number;
  start_timecode: string;
  end_timecode: string;
  scene_number: number;
};

// First let's prep the data to optimize the rendering
// Find all scenes and group them by scene number

const scenes1 = data1.reduce((acc, current) => {
  const sceneNumber = current.related_scene.scene_number;

  if (!acc[sceneNumber]) {
    acc[sceneNumber] = {
      ...current.related_scene,
      frames: [] as TFrame[],
      end_frame: current.related_scene.end_frame + 1,
    };
  }

  const { related_scene, ...currentWithoutScene } = current;

  acc[sceneNumber].frames.push(currentWithoutScene as TFrame);

  return acc;
}, [] as TScene[]);

const scenes2 = data2.reduce((acc, current) => {
  const sceneNumber = current.related_scene.scene_number;

  if (!acc[sceneNumber]) {
    acc[sceneNumber] = {
      ...current.related_scene,
      frames: [] as TFrame[],
      end_frame: current.related_scene.end_frame + 1,
    };
  }

  const { related_scene, ...currentWithoutScene } = current;

  acc[sceneNumber].frames.push(currentWithoutScene as TFrame);

  return acc;
}, [] as TScene[]);

export function Scenes({ video }: { video: 1 | 2 }) {
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    aspectRatio: 16 / 9,
    width: 1920,
    height: 1080,
    durationInSeconds: 10,
    isRemote: false,
  });
  const videoSrc = staticFile(`${video}.mp4`);

  const scenes = video === 1 ? scenes1 : scenes2;

  useEffect(() => {
    const getMetadata = async () => {
      const data = await getVideoMetadata(videoSrc);

      setVideoMetadata(data);
    };

    getMetadata();
  }, []);

  return (
    <>
      {scenes.map((scene) => (
        <Sequence
          key={'scene' + scene.scene_number}
          from={scene.start_frame}
          durationInFrames={scene.end_frame - scene.start_frame}
          name={`Scene ${scene.scene_number + 1}`}
        >
          <Faces scene={scene} videoMetadata={videoMetadata} video={video} />
        </Sequence>
      ))}

      <Audio src={staticFile(`${video}.mp4`)} />
    </>
  );

  // return faces.map((face, index) => {
  //   const sectionHeight = isSingleFace ? VIDEO_HEIGHT : VIDEO_HEIGHT / 2;

  //   // The multiplier is the height of a section divided by the height of the face
  //   const multiplier = (sectionHeight / (face.y2 - face.y1)) * resolutionDiff;

  //   console.log('multiplier', multiplier);

  //   const left = face.x1 + padding;
  //   const right = VIDEO_WIDTH - face.x2 + padding;

  //   const isLeft = left < right;

  //   return (
  //     <Sequence key={'face ' + index} name={`Speaker ${index + 1}`}>
  //       {/*
  //       Screen is vertical split in half if there are two faces
  //       If there is only one face, position it in the center of the screen
  //     */}
  //       <AbsoluteFill
  //         style={{
  //           position: 'absolute',
  //           border: '2px solid red',

  //           top: index * sectionHeight,
  //           height: sectionHeight,
  //           width: VIDEO_WIDTH,
  //           backgroundColor: index === 0 ? 'red' : 'blue',
  //         }}
  //       >
  //         <div
  //           style={{
  //             position: 'absolute',
  //             transform: `scale(${multiplier})`,
  //           }}
  //         >
  //           <OffthreadVideo
  //             src={staticFile('test.mp4')}
  //             style={{
  //               position: 'absolute',
  //               objectFit: 'cover',

  //               // We also need to account for cases when the face is shifted to a side of the screen

  //               top: -face.y1 + padding,

  //               ...(isLeft
  //                 ? {
  //                     left: -left,
  //                   }
  //                 : {
  //                     right: -right,
  //                   }),
  //             }}
  //           />
  //         </div>
  //       </AbsoluteFill>
  //     </Sequence>
  //   );
  // });
}
