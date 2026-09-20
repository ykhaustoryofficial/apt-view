(() => {
  const heroScene = document.getElementById('heroScene');
  const mapScene = document.getElementById('mapScene');
  const enterTour = document.getElementById('enterTour');
  const backToHero = document.getElementById('backToHero');
  const resetMap = document.getElementById('resetMap');
  const mapStage = document.getElementById('mapStage');
  const mapHint = document.getElementById('mapHint');
  const points = [...document.querySelectorAll('.map-point')];
  const prevPoint = document.getElementById('prevPoint');
  const nextPoint = document.getElementById('nextPoint');
  const locationKicker = document.getElementById('locationKicker');
  const locationName = document.getElementById('locationName');
  const locationDescription = document.getElementById('locationDescription');
  const pointCounter = document.getElementById('pointCounter');

  const locations = [
    {
      name: '주출입구',
      label: 'ENTRANCE',
      description: '단지의 첫인상을 만나는 주출입구 주변입니다.',
      x: 73,
      y: 58,
      scale: 2.15
    },
    {
      name: '중앙정원',
      label: 'CENTRAL GARDEN',
      description: '단지 중심의 녹지와 휴식 공간을 살펴봅니다.',
      x: 50,
      y: 49,
      scale: 2.0
    },
    {
      name: '어린이놀이터',
      label: 'PLAYGROUND',
      description: '주동 사이에 배치된 놀이 공간 주변입니다.',
      x: 39,
      y: 38,
      scale: 2.15
    },
    {
      name: '커뮤니티',
      label: 'COMMUNITY',
      description: '커뮤니티 시설과 주변 보행 동선을 살펴봅니다.',
      x: 60,
      y: 50,
      scale: 2.2
    },
    {
      name: '남측정원',
      label: 'SOUTH GARDEN',
      description: '남측의 조경 공간과 산책 동선을 살펴봅니다.',
      x: 36,
      y: 67,
      scale: 2.05
    },
    {
      name: '북측정원',
      label: 'NORTH GARDEN',
      description: '북측의 조경과 휴식 공간을 살펴봅니다.',
      x: 37,
      y: 23,
      scale: 2.05
    }
  ];

  let activeIndex = -1;

  function showMap() {
    heroScene.classList.remove('is-active');
    mapScene.classList.add('is-active');
    setTimeout(() => mapHint.classList.remove('is-hidden'), 500);
  }

  function showHero() {
    mapScene.classList.remove('is-active');
    heroScene.classList.add('is-active');
    resetView();
  }

  function updateCard(index) {
    if (index < 0) {
      locationKicker.textContent = 'EXPLORE MAP';
      locationName.textContent = '단지 전체보기';
      locationDescription.textContent = '배치도의 포인트를 눌러 단지 곳곳을 살펴보세요.';
      pointCounter.textContent = `0 / ${locations.length}`;
      return;
    }
    const loc = locations[index];
    locationKicker.textContent = loc.label;
    locationName.textContent = loc.name;
    locationDescription.textContent = loc.description;
    pointCounter.textContent = `${index + 1} / ${locations.length}`;
  }

  function focusPoint(index) {
    const loc = locations[index];
    if (!loc) return;

    activeIndex = index;
    points.forEach((point, i) => point.classList.toggle('is-active', i === index));

    const dx = 50 - loc.x;
    const dy = 50 - loc.y;
    const tx = dx * loc.scale;
    const ty = dy * loc.scale;

    mapStage.style.transformOrigin = `${loc.x}% ${loc.y}%`;
    mapStage.style.transform = `translate(${tx * 0.17}vw, ${ty * 0.17}vh) scale(${loc.scale})`;

    updateCard(index);
    mapHint.classList.add('is-hidden');
  }

  function resetView() {
    activeIndex = -1;
    points.forEach(point => point.classList.remove('is-active'));
    mapStage.style.transformOrigin = '50% 50%';
    mapStage.style.transform = 'translate(0,0) scale(1)';
    updateCard(-1);
  }

  function step(direction) {
    if (activeIndex < 0) {
      focusPoint(direction > 0 ? 0 : locations.length - 1);
      return;
    }
    const next = (activeIndex + direction + locations.length) % locations.length;
    focusPoint(next);
  }

  enterTour.addEventListener('click', showMap);
  backToHero.addEventListener('click', showHero);
  resetMap.addEventListener('click', resetView);
  prevPoint.addEventListener('click', () => step(-1));
  nextPoint.addEventListener('click', () => step(1));
  points.forEach((point, index) => point.addEventListener('click', () => focusPoint(index)));

  document.addEventListener('keydown', (event) => {
    if (!mapScene.classList.contains('is-active')) return;
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'Escape') resetView();
  });

  // 모바일 좌우 스와이프
  let touchStartX = 0;
  let touchStartY = 0;
  mapScene.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  mapScene.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      step(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
})();
