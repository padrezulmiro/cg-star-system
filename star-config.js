export const config = {
    animation: {
        // Animation time is in seconds
        cycle_period: 0.5
    },

    bodies: {
        // Distance is in AUs and time is in animation cycles given by
        // animation.cycle_period

        sun: {
            name: "sun",
            radius: 8,
            pos: [0, 0, 0],
            rotation_period: 10,
            texture: "./textures/2k_sun.jpg"
        },
        mercury : {
            name: "mercury",
            radius: 1,
            pos: [20, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0.206,
                ellipseRotation: 0,
                orbital_period: 88.0
            },
            texture: "./textures/2k_mercury.jpg"
        },
        venus : {
            name: "venus",
            radius: 3,
            pos: [30, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0,
                ellipseRotation: 0,
                orbital_period: 224.7 
            },
            texture: "./textures/2k_venus_atmosphere.jpg"
        },
        
        earth: {
            name: "earth",
            radius: 3,
            pos: [40, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0.017,
                ellipseRotation: 0,
                orbital_period: 365.2
            },
            texture: "./textures/2k_earth_daymap.jpg"
        },

        moon: {
            name: "moon",
            radius: 0.5,
            pos: [40, 5, 0],
            rotation_period: 1,
            orbit: {
                around: "earth",
                eccentricity: 0.055,
                ellipseRotation: 0,
                orbital_period: 100
            },
            texture: "./textures/2k_moon.jpg"
        },
        mars : {
            name: "mars",
            radius: 1.75,
            pos: [60, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0.094,
                ellipseRotation: 0,
                orbital_period: 687.0 	
            },
            texture: "./textures/2k_mars.jpg"
        },
        jupiter : {
            name: "jupiter",
            radius: 4,
            pos: [80, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0.049,
                ellipseRotation: 0,
                orbital_period: 4331 	
            },
            texture: "./textures/2k_jupiter.jpg"
        },
        saturn : {
            name: "saturn",
            radius: 6,
            pos: [100, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0.052,
                ellipseRotation: 0,
                orbital_period: 10747
            },
            texture: "./textures/2k_saturn.jpg"
        },

        uranus : {
            name: "uranus",
            radius: 4,
            pos: [130, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0.047,
                ellipseRotation: 0,
                orbital_period: 30589 	
            },
            texture: "./textures/2k_uranus.jpg"
        },

        neptune : {
            name: "neptune",
            radius: 4,
            pos: [150, 0, 0],
            rotation_period: 1,
            orbit: {
                around: "sun",
                eccentricity: 0.010,
                ellipseRotation: 0,
                orbital_period: 59800 	
            },
            texture: "./textures/2k_neptune.jpg"
        },


    }
}
