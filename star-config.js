export const config = {
    canvas: {
        width: 400,
        height: 300
    },

    animation: {
        // Animation time is in seconds
        cycle_period: 300
    },

    bodies: {
        // Distance is in AUs and time is in Kerbin days

        kerbol: {
            name: "kerbol",
            radius: 4.1,
            pos: [0, 0, 0],
            rotation_period: 10
        },

        kerbin: {
            name: "kerbin",
            radius: 3.9,
            pos: [5, 0, 0],
            rotation_period: 1,
            orbit: {
                type: "ellipse",
                around: "kerbol",
                orbital_period: 100
            }
        },
    }
}
