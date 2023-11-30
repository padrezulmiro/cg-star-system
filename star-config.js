export const config = {
  canvas: {
    width: 400,
    height: 300
  },

  animation: {
    _comment: "Animation time is in seconds",
    cycle_period: 300
  },

  bodies: {
    _comment: "Distance is in AUs and time is in Kerbin days",

    kerbol: {
      radius: 4,
      rotation_period: 10
    },

    kerbin: {
      radius: 1,
      rotation_period: 1,
      orbit: {
        type: "ellipse",
        around: "kerbol",
        orbital_period: 100
      }
    },

    mun: {}

  }
}
