const CYBER_TOUR_DATA = {
  site: {
    name: "역곡지구 하우스토리",

    /*
      배치도 원본 기준 좌표.
      x, y는 이미지 좌측 상단을 0,0
      우측 하단을 100,100으로 본 비율값.
    */

    buildings: [
      {
        id: "B01",
        name: "동 미지정 01",
        x: 31.5,
        y: 38.5,
        rotation: -4,
        floors: null
      },
      {
        id: "B02",
        name: "동 미지정 02",
        x: 40.0,
        y: 42.5,
        rotation: 2,
        floors: null
      },
      {
        id: "B03",
        name: "동 미지정 03",
        x: 49.0,
        y: 43.5,
        rotation: -3,
        floors: null
      },
      {
        id: "B04",
        name: "동 미지정 04",
        x: 60.5,
        y: 50.0,
        rotation: 3,
        floors: null
      },
      {
        id: "B05",
        name: "동 미지정 05",
        x: 33.5,
        y: 54.5,
        rotation: -4,
        floors: null
      },
      {
        id: "B06",
        name: "동 미지정 06",
        x: 47.0,
        y: 60.5,
        rotation: 1,
        floors: null
      },
      {
        id: "B07",
        name: "동 미지정 07",
        x: 60.5,
        y: 64.0,
        rotation: 2,
        floors: null
      },
      {
        id: "B08",
        name: "동 미지정 08",
        x: 42.0,
        y: 70.0,
        rotation: -4,
        floors: null
      }
    ],

    facilities: {
      centralGarden: {
        id: "central-garden",
        name: "중앙정원",
        x: 42.5,
        y: 52.0
      },

      playgroundNorth: {
        id: "playground-north",
        name: "북측 놀이터",
        x: 36.0,
        y: 39.0
      },

      playgroundSouth: {
        id: "playground-south",
        name: "남측 놀이터",
        x: 52.0,
        y: 65.0
      },

      community: {
        id: "community",
        name: "커뮤니티",
        x: 57.0,
        y: 55.5
      },

      entranceEast: {
        id: "entrance-east",
        name: "동측 주출입구",
        x: 66.5,
        y: 56.0
      }
    },

    paths: [
      {
        id: "main-walk-01",
        name: "중앙 산책로",
        points: [
          [42, 76],
          [41, 70],
          [40, 64],
          [41, 58],
          [43, 52],
          [46, 47],
          [49, 43]
        ]
      },

      {
        id: "west-walk-01",
        name: "서측 산책로",
        points: [
          [32, 76],
          [29, 68],
          [27, 60],
          [28, 51],
          [30, 43],
          [33, 36]
        ]
      },

      {
        id: "east-walk-01",
        name: "동측 산책로",
        points: [
          [56, 70],
          [59, 64],
          [61, 57],
          [61, 50],
          [58, 45],
          [54, 41]
        ]
      }
    ]
  },

  scenes: {
    centralGarden: {
      id: "central-garden",
      name: "중앙정원",

      camera: {
        x: 42.5,
        y: 59.0,
        direction: -8,
        eyeHeight: 1.65
      },

      visibleBuildings: [
        "B02",
        "B03",
        "B05",
        "B06"
      ]
    }
  }
};
