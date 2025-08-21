// GSAP ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// 영상 제어 설정 (고객사 요청에 따라 쉽게 수정 가능)
const VIDEO_CONFIG = {
  // 스크롤 시작 시 영상 재생 시작 지점 (0~1, 0은 스크롤 시작, 1은 스크롤 끝)
  playStartPoint: 0.1,
  // 스크롤 완료 시 영상 재생 완료 지점 (0~1)
  playEndPoint: 0.9,
  // 영상 재생 속도 (1.0이 정상 속도)
  playbackRate: 1.0,
  // 영상이 반복 재생되는지 여부
  loop: true
};

// DOM 요소들
const kvSection = document.querySelector('.showroomfinder-kv-section');
const kvContent = document.querySelector('.showroomfinder-kv-content');
const title = document.querySelector('.showroomfinder-title');
const kvVideoContainer = document.querySelector('.showroomfinder-kv-video-container');
const mainVideo = document.getElementById('showroomfinder-mainVideo');
const scrollIndicator = document.querySelector('.showroomfinder-scroll-indicator');
const navButtons = document.querySelectorAll('.showroomfinder-nav-btn');
const sections = document.querySelectorAll('.showroomfinder-content-section');
const topButton = document.getElementById('showroomfinder-topButton');

// Section3 비디오 관련 요소들
const section3Content = document.querySelector('#section3 .showroomfinder-section-content');
const section3Video = document.getElementById('showroomfinder-section3Video');
const playButton = document.querySelector('.showroomfinder-play-button');

// 비디오 초기화 함수
function showroomfinderInitVideo() {
  // 비디오 속성 설정
  mainVideo.muted = true;
  mainVideo.loop = VIDEO_CONFIG.loop;
  mainVideo.playsInline = true;
  mainVideo.preload = 'auto';
  mainVideo.playbackRate = VIDEO_CONFIG.playbackRate;
  
  // 비디오 로드 이벤트
  mainVideo.addEventListener('loadeddata', () => {
    // 초기 상태로 설정
    showroomfinderResetVideo();
  });
  
  // 비디오 에러 처리
  mainVideo.addEventListener('error', (e) => {
    kvVideoContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  });
}

// 비디오 초기화 (currentTime을 0으로)
function showroomfinderResetVideo() {
  mainVideo.currentTime = 0;
  mainVideo.pause();
}

// 비디오 재생 함수
function showroomfinderPlayVideo() {
  const playPromise = mainVideo.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      // 사용자 인터랙션 후 재생 시도
      document.addEventListener('click', () => {
        mainVideo.play().catch(e => {});
      }, { once: true });
    });
  }
}

// 스크롤 위치에 따른 비디오 제어
function showroomfinderControlVideoByScroll(progress) {
  if (!mainVideo.duration || isNaN(mainVideo.duration)) {
    return;
  }
  
  // 스크롤이 최상단(0)일 때만 비디오 초기화
  if (progress <= 0.01) {
    if (mainVideo.currentTime !== 0) {
      showroomfinderResetVideo();
    }
    return;
  }
  
  // 스크롤 시작 지점에서 영상 재생 시작
  if (progress >= VIDEO_CONFIG.playStartPoint && mainVideo.paused) {
    showroomfinderPlayVideo();
  }
}

// 스크롤 다운 텍스트 제어
function showroomfinderControlScrollIndicator(progress) {
  // 스크롤 다운 텍스트는 스크롤 80% 지점에서 opacity로 사라짐
  if (progress > 0.8) {
    scrollIndicator.style.opacity = '0';
  } else {
    scrollIndicator.style.opacity = '1';
  }
}

// Top 버튼 기능
function showroomfinderInitTopButton() {
  // Top 버튼 클릭 이벤트
  topButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // 스크롤에 따른 Top 버튼 표시/숨김
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const showThreshold = window.innerHeight * 3;
    
    if (scrollY > showThreshold) {
      topButton.classList.add('visible');
    } else {
      topButton.classList.remove('visible');
    }
  });
}

// Swiper 초기화
function showroomfinderInitSwiper() {
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    loop: false,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      // 767: {
      //   slidesPerView: 1.5,
      //   spaceBetween: 0,
      //   centeredSlides: true,
      // },
      0: {
        slidesPerView: 1.25,
        spaceBetween: 0,
        centeredSlides: true,
      },
      1024: {
        slidesPerView: 2.5,
        spaceBetween: 0,
        centeredSlides: true,
      }
    }
  });
}

// 아코디언 기능
function showroomfinderInitAccordion() {
  const accordionButtons = document.querySelectorAll('.showroomfinder-accordion-button');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const accordionItem = this.parentElement;
      const accordionContent = accordionItem.querySelector('.showroomfinder-accordion-content');
      const isActive = this.classList.contains('active');
      
      // 모든 아코디언 닫기
      accordionButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.parentElement.querySelector('.showroomfinder-accordion-content').classList.remove('active');
      });
      
      // 클릭된 아코디언이 닫혀있었다면 열기
      if (!isActive) {
        this.classList.add('active');
        accordionContent.classList.add('active');
      }
    });
  });
}

// Section3 비디오 인터랙션 기능
function showroomfinderInitSection3Video() {
  if (!section3Video || !section3Content || !playButton) return;

  // 비디오 초기화
  section3Video.muted = true;
  section3Video.loop = true;
  section3Video.playsInline = true;
  section3Video.autoplay = true;

  // 비디오 영역 클릭 이벤트 (전체 영역에서 동작)
  const videoWrapper = document.querySelector('#section3 .showroomfinder-view-video-wrapper');
  if (videoWrapper) {
    videoWrapper.addEventListener('click', function(e) {
      // 재생 버튼 클릭이 아닌 경우에만 동작
      if (!playButton.contains(e.target)) {
        // 음소거 토글
        section3Video.muted = !section3Video.muted;
        
        // 음소거 해제된 경우 스크롤 이동
        if (!section3Video.muted) {
          // Section4의 offsetTop에서 100vh를 뺀 위치로 스크롤 이동
          const section4 = document.getElementById('section4');
          const targetScrollPosition = section4.offsetTop - window.innerHeight;
          
          window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
          });
        }
        
        // 음소거 상태에 따른 시각적 피드백
        if (section3Video.muted) {
          console.log('음소거됨');
        } else {
          console.log('음소거 해제됨 + 스크롤 이동');
        }
      }
    });
  }

  // 재생 버튼 클릭 이벤트
  playButton.addEventListener('click', function() {
    // 음소거 해제
    section3Video.muted = false;
    
    // Section4의 offsetTop에서 100vh를 뺀 위치로 스크롤 이동
    const section4 = document.getElementById('section4');
    const targetScrollPosition = section4.offsetTop - window.innerHeight;
    
    window.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth'
    });
  });

  // 키보드 M키로 음소거 토글
  document.addEventListener('keydown', function(e) {
    // Section3가 화면에 보일 때만 작동
    const section3 = document.getElementById('section3');
    const rect = section3.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        section3Video.muted = !section3Video.muted;
        
        // 음소거 상태에 따른 시각적 피드백
        if (section3Video.muted) {
          console.log('음소거됨 (M키)');
        } else {
          console.log('음소거 해제됨 (M키)');
        }
      }
    }
  });
}



// 반응형 초기값 계산 함수
function getResponsiveInitialValues() {
  const isMobile = window.innerWidth <= 767;
  return {
    width: isMobile ? 320 : 700,
    height: isMobile ? 200 : 400,
    widthPx: isMobile ? '320px' : '700px',
    heightPx: isMobile ? '200px' : '400px'
  };
}

/* 비디오 확장/축소는 스크롤 기반 애니메이션으로 처리 */

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 비디오 초기화
  showroomfinderInitVideo();
  
  // 네비게이션 초기화
  showroomfinderInitNavigation();
  
  // Top 버튼 초기화
  showroomfinderInitTopButton();
  
  // Swiper 초기화
  showroomfinderInitSwiper();
  
  // 아코디언 초기화
  showroomfinderInitAccordion();
  
  // Section3 비디오 인터랙션 초기화
  showroomfinderInitSection3Video();
  
  // 타이틀 애니메이션
  gsap.to(title, {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: 'power2.out',
    delay: 0.5
  });
});

// 스크롤 기반 애니메이션 설정
function showroomfinderInitScrollAnimations() {
  // KV 섹션 스크롤 애니메이션
  ScrollTrigger.create({
    trigger: kvSection,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: function(self) {
      const progress = self.progress;
      
      // 스크롤 진행도에 따른 비디오 클립 애니메이션
      // 화면 중앙부터 위, 아래로 마스킹 효과
      const clipProgress = Math.min(progress * 2, 1); // 50% 지점에서 완전히 보이도록
      const clipValue = 50 - (clipProgress * 50);
      const clipPath = `inset(${clipValue}% 0 ${clipValue}% 0)`;
      
      kvVideoContainer.style.clipPath = clipPath;
      
      // KV 콘텐츠는 화면 중앙부터 위아래로 clip되어 사라짐
      // polygon을 사용하여 중앙에서 시작해서 위아래로 clip
      const kvClipValue = clipProgress * 50;
      const kvClipPath = `polygon(0 0%, 100% 0%, 100% ${50 - kvClipValue}%, 0 ${50 - kvClipValue}%, 0 ${50 + kvClipValue}%, 100% ${50 + kvClipValue}%, 100% 100%, 0 100%)`;
      kvContent.style.clipPath = kvClipPath;
      
      // 스크롤 위치에 따른 비디오 제어
      showroomfinderControlVideoByScroll(progress);
      
      // 스크롤 인디케이터 표시/숨김 (스크롤 30% 지점에서)
      showroomfinderControlScrollIndicator(progress);
    }
  });

  // Section3 비디오 스크롤 애니메이션
  if (section3Content) {
    // 동적으로 end 값을 계산하는 함수
    function getSection3EndValue() {
      const section3 = document.getElementById('section3');
      if (!section3) return 'bottom bottom';
      
      const section3Height = section3.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // 확장 타이밍이 느려졌으므로 더 많은 스크롤 공간 확보
      const extraSpace = viewportHeight * 1.0; // 뷰포트 높이의 100% 추가
      
      return `+=${extraSpace}`;
    }

    // ScrollTrigger 인스턴스를 변수로 저장하여 나중에 업데이트할 수 있도록 함
    const section3ScrollTrigger = ScrollTrigger.create({
      trigger: document.getElementById('section3'),
      start: 'top top',
      end: getSection3EndValue(),
      scrub: true,
      onUpdate: function(self) {
        const progress = self.progress;
        
        // 스크롤 진행도에 따른 비디오 영역 확장
        if (progress > 0) {
          // 반응형에 따른 초기값 설정
          const initialValues = getResponsiveInitialValues();
          const initialWidth = initialValues.width;
          const initialHeight = initialValues.height;
          
          // Easing 함수로 부드러운 애니메이션 (더 느리게)
          const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
          const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3); // 더 부드러운 easing
          
          // 확장 타이밍을 더 느리게 (0.925 -> 0.95)
          const expansionEndPoint = 0.95;
          
          // 너비 확장 (초기값 -> 100vw) - 0~0.95 구간에서 완료 (더 느리게)
          const widthProgress = easeOutCubic(Math.min(progress / expansionEndPoint, 1));
          const widthValue = initialWidth + (widthProgress * (window.innerWidth - initialWidth));
          
          // 높이 확장 (초기값 -> 100vh) - 0~0.95 구간에서 완료 (더 느리게)
          const heightProgress = easeOutCubic(Math.min(progress / expansionEndPoint, 1));
          const heightValue = initialHeight + (heightProgress * (window.innerHeight - initialHeight));
          
          // 스타일 적용
          section3Content.style.width = `${widthValue}px`;
          section3Content.style.height = `${heightValue}px`;
          
          // 비디오 영역을 항상 화면 중앙에 고정
          section3Content.style.top = '50%';
          section3Content.style.transform = 'translateY(-50%)';
          
          // 비디오 확장이 완료되면 상단으로 이동
          if (progress >= expansionEndPoint) {
            // 확장 완료 후 바로 상단으로 고정
            section3Content.style.top = '0%';
            section3Content.style.transform = 'translateY(0%)';
          } else {
            // 확장 중에는 중앙에 고정
            section3Content.style.top = '50%';
            section3Content.style.transform = 'translateY(-50%)';
          }
          
          // 모바일에서는 확장 완료 후 위치 고정을 더 확실하게
          if (window.innerWidth <= 767 && progress >= expansionEndPoint) {
            // 모바일에서는 확장 완료 시점에 한 번만 설정
            if (!section3Content.dataset.expanded) {
              section3Content.dataset.expanded = 'true';
              section3Content.style.top = '0%';
              section3Content.style.transform = 'translateY(0%)';
            }
          } else if (window.innerWidth <= 767 && progress < expansionEndPoint) {
            // 모바일에서 확장 중일 때는 중앙 고정
            section3Content.dataset.expanded = 'false';
            section3Content.style.top = '50%';
            section3Content.style.transform = 'translateY(-50%)';
          }
          
          // 재생 버튼 투명도 조절
          const buttonOpacity = Math.max(0, 1 - (progress * 1.5));
          playButton.style.opacity = buttonOpacity;
          playButton.style.pointerEvents = progress > 0.7 ? 'none' : 'auto';
        } else {
          // 초기 상태로 복원 (반응형에 맞게)
          const initialValues = getResponsiveInitialValues();
          const initialWidth = initialValues.widthPx;
          const initialHeight = initialValues.heightPx;
          
          section3Content.style.width = initialWidth;
          section3Content.style.height = initialHeight;
          section3Content.style.top = '50%';
          section3Content.style.transform = 'translateY(-50%)';
          playButton.style.opacity = '1';
          playButton.style.pointerEvents = 'auto';
        }
      }
    });

    // 리사이즈 시 ScrollTrigger 업데이트를 위한 함수
    function updateSection3ScrollTrigger() {
      if (section3ScrollTrigger) {
        // 현재 진행도 저장
        const currentProgress = section3ScrollTrigger.progress;
        
        // 모바일 상태 초기화
        if (section3Content) {
          section3Content.dataset.expanded = 'false';
          
          // 인라인 스타일 초기화 (반응형 대응)
          section3Content.style.width = '';
          section3Content.style.height = '';
          section3Content.style.top = '';
          section3Content.style.transform = '';
        }
        
        // ScrollTrigger의 end 값을 업데이트
        section3ScrollTrigger.vars.end = getSection3EndValue();
        
        // ScrollTrigger 새로고침
        section3ScrollTrigger.refresh();
        
        // 현재 진행도에 맞게 스타일 다시 적용
        if (currentProgress > 0) {
          setTimeout(() => {
            // 반응형에 따른 초기값 설정
            const initialValues = getResponsiveInitialValues();
            const initialWidth = initialValues.width;
            const initialHeight = initialValues.height;
            
            // Easing 함수
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const expansionEndPoint = 0.95;
            
            // 현재 진행도에 맞는 크기 계산
            const widthProgress = easeOutCubic(Math.min(currentProgress / expansionEndPoint, 1));
            const heightProgress = easeOutCubic(Math.min(currentProgress / expansionEndPoint, 1));
            
            const widthValue = initialWidth + (widthProgress * (window.innerWidth - initialWidth));
            const heightValue = initialHeight + (heightProgress * (window.innerHeight - initialHeight));
            
            // 스타일 적용
            section3Content.style.width = `${widthValue}px`;
            section3Content.style.height = `${heightValue}px`;
            
            // 위치 설정
            if (currentProgress >= expansionEndPoint) {
              section3Content.style.top = '0%';
              section3Content.style.transform = 'translateY(0%)';
            } else {
              section3Content.style.top = '50%';
              section3Content.style.transform = 'translateY(-50%)';
            }
          }, 100);
        }
        
        // Section3가 화면에 보이는 상태라면 스크롤 위치 조정
        setTimeout(() => {
          const section3 = document.getElementById('section3');
          if (section3) {
            const rect = section3.getBoundingClientRect();
            const isSectionVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isSectionVisible && currentProgress > 0) {
              // 현재 진행도에 맞는 스크롤 위치로 조정
              const section3Top = section3.offsetTop;
              const section3Height = section3.offsetHeight;
              const viewportHeight = window.innerHeight;
              
              // 진행도에 따른 스크롤 위치 계산
              const targetScrollY = section3Top + (section3Height - viewportHeight) * currentProgress;
              window.scrollTo(0, targetScrollY);
            }
          }
        }, 150);
      }
    }

    // 반응형 변경 시 즉시 적용하는 함수
    function applyResponsiveStyles() {
      if (section3Content) {
        const initialValues = getResponsiveInitialValues();
        
        // 현재 스크롤 진행도 확인
        const section3 = document.getElementById('section3');
        if (section3) {
          const rect = section3.getBoundingClientRect();
          const isSectionVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isSectionVisible) {
            // Section3가 보이는 상태라면 현재 진행도에 맞게 스타일 적용
            const scrollY = window.scrollY;
            const section3Top = section3.offsetTop;
            const section3Height = section3.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // 대략적인 진행도 계산
            const estimatedProgress = Math.max(0, Math.min(1, (scrollY - section3Top) / (section3Height - viewportHeight)));
            
            if (estimatedProgress > 0) {
              const expansionEndPoint = 0.95;
              const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
              
              const widthProgress = easeOutCubic(Math.min(estimatedProgress / expansionEndPoint, 1));
              const heightProgress = easeOutCubic(Math.min(estimatedProgress / expansionEndPoint, 1));
              
              const widthValue = initialValues.width + (widthProgress * (window.innerWidth - initialValues.width));
              const heightValue = initialValues.height + (heightProgress * (window.innerHeight - initialValues.height));
              
              section3Content.style.width = `${widthValue}px`;
              section3Content.style.height = `${heightValue}px`;
              
              if (estimatedProgress >= expansionEndPoint) {
                section3Content.style.top = '0%';
                section3Content.style.transform = 'translateY(0%)';
              } else {
                section3Content.style.top = '50%';
                section3Content.style.transform = 'translateY(-50%)';
              }
            }
          }
        }
      }
    }

    // updateSection3ScrollTrigger 함수를 전역에서 접근할 수 있도록 설정
    window.updateSection3ScrollTrigger = updateSection3ScrollTrigger;
    window.applyResponsiveStyles = applyResponsiveStyles;
  }

  // 각 섹션별 페이드인 애니메이션
//   sections.forEach((section, index) => {
//     gsap.fromTo(section, 
//       {
//         opacity: 0,
//         y: 50
//       },
//       {
//         scrollTrigger: {
//           trigger: section,
//           start: 'top 80%',
//           end: 'top 20%',
//           scrub: false,
//           toggleActions: 'play none none reverse'
//         },
//         opacity: 1,
//         y: 0,
//         duration: 1,
//         delay: index * 0.2,
//         ease: 'power2.out'
//       }
//     );
//   });
}

// 네비게이션 기능
function showroomfinderInitNavigation() {
  // 네비게이션 버튼 클릭 이벤트
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-section');
      const targetElement = document.getElementById(targetSection);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// 키보드 네비게이션 (iOS에서는 비활성화)
if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const firstSection = sections[0];
      if (firstSection) {
        const targetPosition = firstSection.offsetTop;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

// 윈도우 리사이즈 시 ScrollTrigger 새로고침 (통합)
let resizeTimeout;
window.addEventListener('resize', function() {
  // 기본 ScrollTrigger 새로고침
  ScrollTrigger.refresh();
  
  // 즉시 반응형 스타일 적용
  if (typeof applyResponsiveStyles === 'function') {
    applyResponsiveStyles();
  }
  
  // 디바운싱을 위한 타임아웃
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Section3 전용 업데이트 (이미 등록된 경우에만)
    if (typeof updateSection3ScrollTrigger === 'function') {
      updateSection3ScrollTrigger();
    }
  }, 250);
});

// 스크롤 애니메이션 초기화
showroomfinderInitScrollAnimations(); 