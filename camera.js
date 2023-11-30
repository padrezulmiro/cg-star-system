
/*
cam_matrix - matrix for the camera
cam_location - rotate around where the camera is
THETA - x
PHI - y
 */
export function turnCamera(m4,cam_matrix, cam_location, THETA,PHI){

    // move world matrix to origin
    var m = m4.rotateY(m4.rotateX(cam_matrix, PHI),THETA)
    return m;
    // rotate?
    // move back
}