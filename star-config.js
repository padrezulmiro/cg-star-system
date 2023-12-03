export const config = {
    animation: {
        // Animation time is in seconds
        cycle_period: 15
    },

    bodies: {
        // Distance is in AUs and time is in animation cycles given by
        // animation.cycle_period

        kerbol: {
            name: "kerbol",
            radius: 6,
            pos: [0, 0, 0],
            rotation_period: 10,
            texture: "./textures/2k_sun.jpg"
        },

        kerbin: {
            name: "kerbin",
            radius: 1,
            pos: [10, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "kerbol",
                eccentricity: 0.5,
                ellipseRotation: 30,
                orbital_period: 0.5
            },
            texture: "./textures/2k_earth_daymap.jpg"
        },

        mun: {
            name: "mun",
            radius: 0.5,
            pos: [12, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "kerbin",
                eccentricity: 0.5,
                ellipseRotation: 45,
                orbital_period: 1 / 12
            },
            texture: "./textures/2k_moon.jpg"
        },

        jool : {
            name: "jool",
            radius: 1.5,
            pos: [20, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "kerbol",
                eccentricity: 0.3,
                ellipseRotation: 60,
                orbital_period: 2
            },
            texture: "./textures/2k_jupiter.jpg"
        },
    }
}
