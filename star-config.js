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
            radius: 6,
            pos: [0, 0, 0],
            rotation_period: 10
        },

        kerbin: {
            name: "kerbin",
            radius: 1,
            pos: [8, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "kerbol",
                eccentricity: 0.5,
                ellipseRotation: Math.PI / 6,
                orbital_period: 100
            }
        },

        mun: {
            name: "mun",
            radius: 0.5,
            pos: [9, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "kerbin",
                eccentricity: 0.5,
                ellipseRotation: Math.PI / 6,
                orbital_period: 100
            }
        },

        jool : {
            name: "jool",
            radius: 1.5,
            pos: [40, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "kerbol",
                eccentricity: 0.3,
                ellipseRotation: 0,
                orbital_period: 100
            }
        },
    }
}
