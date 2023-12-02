import * as twgl from "./node_modules/twgl.js/dist/5.x/twgl-full.module.js"
const v3 = twgl.v3; 
const m4 = twgl.m4;

export class Camera{
    camera;
    eye;
    target;
    up;
    xAxis = [1,0,0];
    yAxis = [0,1,0];
    zAxis = [0,0,1];
    rt_dX;
    rt_dY;

    constructor(eye,target,up){
        this.camera = m4.lookAt(eye,target,up,m4.create());
        // console.log(this.camera);
        this.zAxis = v3.normalize(v3.subtract(eye, target));
        this.xAxis = v3.normalize(v3.cross(up, this.zAxis));
        this.yAxis = v3.normalize(v3.cross(this.zAxis, this.xAxis));
        // console.log('zAxis', this.zAxis);
        this.eye = eye;
        this.target = target;
        this.up = up;
        this.rt_dX = 0;
        this.rt_dY = 0;
    }
    /*
    cam_matrix - matrix for the camera
    cam_location - rotate around where the camera is
    THETA - x
    PHI - y
    */
    turnCamera(THETA,PHI){
        // VERSION 1: axisRotate
        this.camera = m4.axisRotate(this.camera,this.yAxis,THETA);
        this.xAxis = m4.transformDirection(m4.rotationY(THETA),this.xAxis);
        this.zAxis = m4.transformDirection(m4.rotationY(THETA),this.zAxis);
        this.camera = m4.axisRotate(this.camera,this.xAxis,PHI);
        this.yAxis = m4.transformDirection(m4.rotationX(PHI),this.yAxis);
        this.zAxis = m4.transformDirection(m4.rotationX(PHI),this.zAxis);
        this.rt_dX = THETA;
        this.rt_dY = PHI;
    }

    moveCameraByV(v){
        this.camera = m4.translate(this.camera,v);
        this.eye = v3.add(this.eye,v);
        this.target = v3.add(this.target,v);
        // console.log("eye",this.eye,"target",this.target);
    }

    moveCameraToTarget(eye,target,up){
        // eye = eye || this.eye;
        // target = target || this.target;
        // up = up ||this.up;
        this.camera = m4.lookAt(eye,target,up);
        this.zAxis = v3.normalize(v3.subtract(eye, target));
        this.xAxis = v3.normalize(v3.cross(up, this.zAxis));
        this.yAxis = v3.normalize(v3.cross(this.zAxis, this.xAxis));
        this.eye = eye;
        this.target = target;
        this.up = up;
    }
}