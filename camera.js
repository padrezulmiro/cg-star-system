
/*
cam_matrix - matrix for the camera
cam_location - rotate around where the camera is
THETA - x
PHI - y
 */
export function turnCamera(m4,cam_matrix, cam_pos, THETA,PHI){
    // return it to origin
    var cam_location = m4.translation(cam_pos); // translate vec3 to vec4
    var m = m4.multiply(cam_matrix, m4.inverse(cam_location));
    // apply rotation
    m = m4.rotateX(m, PHI);
    m = m4.rotateY(m,THETA);
    // put it back to camera origin
    m = m4.multiply(m, cam_location);
    return m;

    //attempt 1
    // // return it to origin
    // var cam_location = m4.translation(cam_pos); // translate vec3 to vec4
    // var m = m4.multiply(cam_matrix, m4.inverse(cam_location));
    // // apply rotation
    // m = m4.rotateX(m, PHI);
    // m = m4.rotateY(m,THETA);
    // // put it back to camera origin
    // m = m4.multiply(m, cam_location);
    // return m;
}

/*
run after planet's position is ran.
*/
export function lookAtPlanet(m4, cam_matrix, ){

}