import { Scene, FreeCamera, Vector3, MeshBuilder } from "@babylonjs/core"
const log = console.log
export const createScene = async (_engine) => {
  const scene = new Scene(_engine)

  const cam = new FreeCamera('cam', new Vector3(0, 1, -5), scene)
  cam.attachControl()
  cam.setTarget(new Vector3(0, 1, 0))

  scene.createDefaultLight()
  const ground = MeshBuilder.CreateGround("nox", { width: 5, height: 10 }, scene)

  const bxL = MeshBuilder.CreateBox("bx", { size: .3 }, scene)
  bxL.position.x -= 1
  bxL.position.z += 2

  const xrHelper = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground],
    uiOptions: {
      sessionMode: "immersive-vr"
    },
    optionalFeatures: true
  })

  xrHelper.input.onControllerAddedObservable.add(controller => {
    controller.onMotionControllerInitObservable.add(motionController => {
      log(motionController.getComponent(motionController.getComponentIds()[1]))
      log(motionController.handness)
      if (motionController.handness === 'left') {
        const xr_ids = motionController.getComponentIds();


        let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
        triggerComponent.onButtonStateChangedObservable.add(() => {
          if (triggerComponent.pressed) {
            bxL.scaling = new Vector3(.2, .2, .2);

          } else {
            bxL.scaling = new Vector3(1, 1, 1);

          }
          log("is Pressing")
        });


        let squeezeComponent = motionController.getComponent(xr_ids[1]);//xr-standard-squeeze
        squeezeComponent.onButtonStateChangedObservable.add(() => {
          if (squeezeComponent.pressed) {
            bxL.locallyTranslate(new Vector3(0,0,.1))
            log("component[1]")
          } else {
            
          }
        });


        let thumbstickComponent = motionController.getComponent(xr_ids[2]);//xr-standard-thumbstick
        thumbstickComponent.onButtonStateChangedObservable.add(() => {
          if (thumbstickComponent.pressed) {
            bxL.scaling = new Vector3(1,3,1)
            log(thumbstickComponent.axes)
          } else {
            bxL.scaling = new Vector3(.7, .7, .7);
          }
          
          /*
              let axes = thumbstickComponent.axes;
              Box_Left_ThumbStick.position.x += axes.x;
              Box_Left_ThumbStick.position.y += axes.y;
          */
        });
        thumbstickComponent.onAxisValueChangedObservable.add((axes) => {
          log(axes)
          //https://playground.babylonjs.com/#INBVUY#87
          //inactivate camera rotation : not working so far

          /*
          let rotationValue = 0;
          const matrix = new BABYLON.Matrix();
          let deviceRotationQuaternion = webXRInput.xrCamera.getDirection(BABYLON.Axis.Z).toQuaternion(); // webXRInput.xrCamera.rotationQuaternion;
          var angle = rotationValue * (Math.PI / 8);
          var quaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, angle);
          const move = new BABYLON.Vector3(0,0,0);
          deviceRotationQuaternion = deviceRotationQuaternion.multiply(quaternion);
          BABYLON.Matrix.FromQuaternionToRef(deviceRotationQuaternion, matrix);
          const addPos = BABYLON.Vector3.TransformCoordinates(move, matrix);
          addPos.y = 0;

          webXRInput.xrCamera.position = webXRInput.xrCamera.position.add(addPos);
         // webXRInput.xrCamera.rotationQuaternion = BABYLON.Quaternion.Identity();

          //webXRInput.xrCamera.rotation = new BABYLON.Vector3(0,0,0);
          */
          //Box_Left_ThumbStick is moving according to stick axes but camera rotation is also changing..
          // Box_Left_ThumbStick.position.x += (axes.x)/100;
          //  Box_Left_ThumbStick.position.y -= (axes.y)/100;
          // console.log(values.x, values.y);
        });

        // let xbuttonComponent = motionController.getComponent(xr_ids[3]);//x-button
        // xbuttonComponent.onButtonStateChangedObservable.add(() => {
        //   if (xbuttonComponent.pressed) {
        //     Sphere_Left_XButton.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);

        //   } else {
        //     Sphere_Left_XButton.scaling = new BABYLON.Vector3(1, 1, 1);
        //   }
        // });
        // let ybuttonComponent = motionController.getComponent(xr_ids[4]);//y-button
        // ybuttonComponent.onButtonStateChangedObservable.add(() => {
        //   if (ybuttonComponent.pressed) {
        //     Sphere_Left_YButton.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);

        //   } else {
        //     Sphere_Left_YButton.scaling = new BABYLON.Vector3(1, 1, 1);
        //   }
        // });

      }
    })
  })

  await scene.whenReadyAsync()

  return scene
}