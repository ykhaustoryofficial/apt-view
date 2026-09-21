(() => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

const buildingLayer =
    document.getElementById("buildingLayer");

    const heroScene =
        document.getElementById("heroScene");

    const mapScene =
        document.getElementById("mapScene");

    const walkScene =
        document.getElementById("walkScene");


    const enterTour =
        document.getElementById("enterTour");

    const backToHero =
        document.getElementById("backToHero");

    const resetMap =
        document.getElementById("resetMap");


    const mapStage =
        document.getElementById("mapStage");

    const mapPoints = [
        ...document.querySelectorAll(".map-point")
    ];


    const locationKicker =
        document.getElementById("locationKicker");

    const locationName =
        document.getElementById("locationName");

    const locationDescription =
        document.getElementById("locationDescription");

    const pointCounter =
        document.getElementById("pointCounter");


    const prevPoint =
        document.getElementById("prevPoint");

    const nextPoint =
        document.getElementById("nextPoint");


    const openVirtualWalk =
        document.getElementById("openVirtualWalk");

    const backToMap =
        document.getElementById("backToMap");

    const toggleDayNight =
        document.getElementById("toggleDayNight");


    const mapHint =
        document.getElementById("mapHint");



    /* =====================================================
       LOCATION DATA
    ====================================================== */

    const locations = [

        {

            name:
                "주출입구",

            label:
                "ENTRANCE",

            description:
                "단지의 첫인상을 만나는 주출입구 주변입니다.",

            x: 73,

            y: 58,

            scale: 2.15,

            walk: false

        },


        {

            name:
                "중앙정원",

            label:
                "CENTRAL GARDEN",

            description:
                "단지 중심의 녹지와 산책 공간을 둘러봅니다.",

            x: 50,

            y: 49,

            scale: 2,

            walk: true

        },


        {

            name:
                "어린이놀이터",

            label:
                "PLAYGROUND",

            description:
                "어린이 놀이시설과 주변 녹지 공간입니다.",

            x: 39,

            y: 38,

            scale: 2.15,

            walk: false

        },


        {

            name:
                "커뮤니티",

            label:
                "COMMUNITY",

            description:
                "커뮤니티 시설과 주변 보행 공간입니다.",

            x: 60,

            y: 50,

            scale: 2.2,

            walk: false

        },


        {

            name:
                "남측정원",

            label:
                "SOUTH GARDEN",

            description:
                "남측 녹지와 산책 공간을 살펴봅니다.",

            x: 36,

            y: 67,

            scale: 2.05,

            walk: false

        },


        {

            name:
                "북측정원",

            label:
                "NORTH GARDEN",

            description:
                "북측 조경 공간과 휴식 공간입니다.",

            x: 37,

            y: 23,

            scale: 2.05,

            walk: false

        }

    ];


    let activeIndex = -1;



    /* =====================================================
       SCENE
    ====================================================== */

    function setScene(targetScene) {

        [
            heroScene,
            mapScene,
            walkScene

        ].forEach(scene => {

            scene.classList.toggle(
                "is-active",
                scene === targetScene
            );

        });

    }



    /* =====================================================
       HERO → MAP
    ====================================================== */

    enterTour.addEventListener(
        "click",
        () => {

            setScene(mapScene);

        }
    );


    backToHero.addEventListener(
        "click",
        () => {

            resetMapView();

            setScene(heroScene);

        }
    );



    /* =====================================================
       MAP CARD
    ====================================================== */

    function updateLocationCard(index) {

        if (index < 0) {

            locationKicker.textContent =
                "EXPLORE MAP";

            locationName.textContent =
                "단지 전체보기";

            locationDescription.textContent =
                "배치도의 포인트를 눌러 단지 곳곳을 살펴보세요.";

            pointCounter.textContent =
                `0 / ${locations.length}`;

            openVirtualWalk.classList.remove(
                "is-visible"
            );

            return;

        }


        const location =
            locations[index];


        locationKicker.textContent =
            location.label;

        locationName.textContent =
            location.name;

        locationDescription.textContent =
            location.description;

        pointCounter.textContent =
            `${index + 1} / ${locations.length}`;


        openVirtualWalk.classList.toggle(
            "is-visible",
            location.walk
        );

    }



    /* =====================================================
       MAP FOCUS
    ====================================================== */

    function focusPoint(index) {

        const location =
            locations[index];

        if (!location) return;


        activeIndex =
            index;


        mapPoints.forEach(
            (point, i) => {

                point.classList.toggle(
                    "is-active",
                    i === index
                );

            }
        );


        const scale =
            location.scale;


        const offsetX =
            (50 - location.x)
            * scale
            * .17;


        const offsetY =
            (50 - location.y)
            * scale
            * .17;


        mapStage.style.transformOrigin =
            `${location.x}% ${location.y}%`;


        mapStage.style.transform =

            `translate(
                ${offsetX}vw,
                ${offsetY}vh
            )
            scale(${scale})`;


        updateLocationCard(index);


        mapHint.classList.add(
            "is-hidden"
        );

    }



    /* =====================================================
       RESET MAP
    ====================================================== */

    function resetMapView() {

        activeIndex = -1;


        mapPoints.forEach(
            point => {

                point.classList.remove(
                    "is-active"
                );

            }
        );


        mapStage.style.transformOrigin =
            "50% 50%";


        mapStage.style.transform =
            "translate(0,0) scale(1)";


        updateLocationCard(-1);


        mapHint.classList.remove(
            "is-hidden"
        );

    }


    resetMap.addEventListener(
        "click",
        resetMapView
    );



    /* =====================================================
       POINT CLICK
    ====================================================== */

    mapPoints.forEach(
        (point,index) => {

            point.addEventListener(
                "click",
                () => {

                    focusPoint(index);

                }
            );

        }
    );



    /* =====================================================
       PREVIOUS / NEXT
    ====================================================== */

    function movePoint(direction) {

        if (activeIndex < 0) {

            focusPoint(
                direction > 0
                    ? 0
                    : locations.length - 1
            );

            return;

        }


        const nextIndex =

            (
                activeIndex
                + direction
                + locations.length
            )

            % locations.length;


        focusPoint(nextIndex);

    }


    prevPoint.addEventListener(
        "click",
        () => movePoint(-1)
    );


    nextPoint.addEventListener(
        "click",
        () => movePoint(1)
    );



    /* =====================================================
       OPEN VIRTUAL WALK
    ====================================================== */

    openVirtualWalk.addEventListener(
        "click",
        () => {

            if (activeIndex !== 1) {

                return;

            }


            setScene(
                walkScene
            );

        }
    );



    /* =====================================================
       BACK TO MAP
    ====================================================== */

    backToMap.addEventListener(
        "click",
        () => {

            setScene(
                mapScene
            );

        }
    );



    /* =====================================================
       DAY / NIGHT
    ====================================================== */

    toggleDayNight.addEventListener(
        "click",
        () => {

            const isNight =
                walkScene.classList.toggle(
                    "is-night"
                );


            toggleDayNight.textContent =
                isNight
                    ? "주간"
                    : "야간";


            const themeColor =
                document.querySelector(
                    'meta[name="theme-color"]'
                );


            if (themeColor) {

                themeColor.setAttribute(

                    "content",

                    isNight
                        ? "#101e31"
                        : "#a8d6e8"

                );

            }

        }
    );



    /* =====================================================
       WALK PARALLAX
    ====================================================== */

    function setLookPosition(
        clientX,
        clientY
    ) {

        const x =

            (
                clientX
                / window.innerWidth
                - .5
            )

            * 2;


        const y =

            (
                clientY
                / window.innerHeight
                - .5
            )

            * 2;


        walkScene.style.setProperty(

            "--look-x",

            `${x * 35}px`

        );


        walkScene.style.setProperty(

            "--look-y",

            `${y * 15}px`

        );

    }



    /* =====================================================
       POINTER
    ====================================================== */

    walkScene.addEventListener(
        "pointermove",
        event => {

            setLookPosition(
                event.clientX,
                event.clientY
            );

        }
    );


    walkScene.addEventListener(
        "pointerleave",
        () => {

            walkScene.style.setProperty(
                "--look-x",
                "0px"
            );

            walkScene.style.setProperty(
                "--look-y",
                "0px"
            );

        }
    );



    /* =====================================================
       MOBILE TOUCH
    ====================================================== */

    let touchStartX = 0;


    walkScene.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

        },

        {
            passive: true
        }
    );


    walkScene.addEventListener(
        "touchmove",
        event => {

            const touch =
                event.touches[0];


            let diff =
                touch.clientX
                - touchStartX;


            diff =
                Math.max(
                    -140,
                    Math.min(
                        140,
                        diff
                    )
                );


            const ratio =
                diff / 140;


            walkScene.style.setProperty(

                "--look-x",

                `${ratio * 42}px`

            );

        },

        {
            passive: true
        }
    );


    walkScene.addEventListener(
        "touchend",
        () => {

            walkScene.style.setProperty(
                "--look-x",
                "0px"
            );

        },

        {
            passive: true
        }
    );



    /* =====================================================
       MAP SWIPE
    ====================================================== */

    let mapTouchX = 0;

    let mapTouchY = 0;


    mapScene.addEventListener(
        "touchstart",
        event => {

            mapTouchX =
                event.changedTouches[0]
                .clientX;

            mapTouchY =
                event.changedTouches[0]
                .clientY;

        },

        {
            passive: true
        }
    );


    mapScene.addEventListener(
        "touchend",
        event => {

            const touch =
                event.changedTouches[0];


            const diffX =
                touch.clientX
                - mapTouchX;


            const diffY =
                touch.clientY
                - mapTouchY;


            if (
                Math.abs(diffX) > 60
                &&
                Math.abs(diffX)
                >
                Math.abs(diffY) * 1.4
            ) {

                movePoint(
                    diffX < 0
                        ? 1
                        : -1
                );

            }

        },

        {
            passive: true
        }
    );



    /* =====================================================
       KEYBOARD
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                mapScene.classList.contains(
                    "is-active"
                )
            ) {

                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    movePoint(1);

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    movePoint(-1);

                }


                if (
                    event.key ===
                    "Escape"
                ) {

                    resetMapView();

                }

            }


            if (
                walkScene.classList.contains(
                    "is-active"
                )
                &&
                event.key ===
                "Escape"
            ) {

                setScene(
                    mapScene
                );

            }

        }
    );
    
    function renderBuildings() {
    buildingLayer.innerHTML = "";

    const buildings =
        CYBER_TOUR_DATA.site.buildings;

    buildings.forEach(building => {
        const el =
            document.createElement("div");

        el.className = "generated-building";

        const floors =
            building.floors ?? 20;

        const height =
            Math.max(180, floors * 11);

        el.style.left =
            `${building.x}%`;

        el.style.top =
            `${building.y}%`;

        el.style.height =
            `${height}px`;

        el.style.transform =
            `translate(-50%, -100%)
             rotate(${building.rotation}deg)`;

        el.innerHTML = `
            <div class="building-face"></div>
            <div class="building-side"></div>
            <div class="building-roof"></div>
            <span class="building-label">
                ${building.name}
            </span>
        `;

        buildingLayer.appendChild(el);
    });
}
renderBuildings();

})();