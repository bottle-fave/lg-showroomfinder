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
const videoContainer = document.querySelector('.showroomfinder-video-container');
const mainVideo = document.getElementById('showroomfinder-mainVideo');
const scrollIndicator = document.querySelector('.showroomfinder-scroll-indicator');
const navButtons = document.querySelectorAll('.showroomfinder-nav-btn');
const sections = document.querySelectorAll('.showroomfinder-content-section');
const topButton = document.getElementById('showroomfinder-topButton');

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
    videoContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },
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
      
      videoContainer.style.clipPath = clipPath;
      
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

// 윈도우 리사이즈 시 ScrollTrigger 새로고침
window.addEventListener('resize', function() {
  ScrollTrigger.refresh();
});

// 스크롤 애니메이션 초기화
showroomfinderInitScrollAnimations(); 