import React, { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from '../constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function VideoCarousel() {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setvideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loaderData, setloaderData] = useState([]);
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    });
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setvideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loaderData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loaderData]);

  const handleLoadedMetadata = (i, e) => setloaderData((pre) => [...pre, e]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;
            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw',
            });
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            });
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            });
          }
        },
      });
      if (videoId === 0) {
        anim.restart();
      }
      const animUpdate = () => {
        anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
      };
      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setvideo((prevVideo) => ({ ...prevVideo, isEnd: true, videoId: i + 1 }));
        break;
      case 'video-last':
        setvideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
        break;
      case 'video-reset':
        setvideo((prevVideo) => ({ ...prevVideo, isLastVideo: false, videoId: 0 }));
        break;
      case 'play':
        setvideo((prevVideo) => ({ ...prevVideo, isPlaying: !prevVideo.isPlaying }));
        break;
      case 'pause':
        setvideo((prevVideo) => ({ ...prevVideo, isPlaying: !prevVideo.isPlaying }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className='flex items-center'>
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
            <div className='video-carousel_container'>
              <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                <video
                  className={`${list.id === 2 && 'translate-x-44'} pointer-events-none`}
                  id='video'
                  onEnded={() => {
                    i !== hightlightsSlides.length - 1
                      ? handleProcess('video-end', i)
                      : handleProcess('video-last');
                  }}
                  onPlay={() => {
                    setvideo((prevVideo) => ({ ...prevVideo, isPlaying: true }));
                  }}
                  ref={(el) => (videoRef.current[i] = el)}
                  playsInline={true}
                  onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                  preload='auto'
                  muted
                  src={list.video}
                ></video>

              </div>
              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text) => (
                  <p key={text} className='md:text-2xl text-xl font-medium'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='relative flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((item, i) => (
            <span
              className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer '
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span className='absolute h-full w-full rounded-full' ref={(el) => (videoSpanRef.current[i] = el)}></span>
            </span>
          ))}
        </div>
        <button className='control-btn'>
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={isLastVideo ? () => handleProcess('video-reset') : !isPlaying ? () => handleProcess('play') : () => handleProcess('pause')}
          />
        </button>
      </div>
    </>
  );
}

export default VideoCarousel;
