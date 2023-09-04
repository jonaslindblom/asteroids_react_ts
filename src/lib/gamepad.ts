function gamepadsSupported() {
  return !!navigator.getGamepads;
}

export function pollGamepad() {
  if (!gamepadsSupported()) {
    return { gpTurn: 0, gpFire: 0 };
  }

  const thold = 0;
  const gamepads = navigator.getGamepads();
  let gpTurn = 0;
  let gpFire = 0;

  for (const gp of gamepads) {
    if (!gp || gp.id.includes("Tesla")) continue;

    // Shooting
    if (gp.buttons.length > 7) {
      if (
        gp.buttons[0].value > thold ||
        gp.buttons[1].value > thold ||
        gp.buttons[2].value > thold ||
        gp.buttons[3].value > thold
      ) {
        gpFire = 1;
      } else if (gp.buttons[6].value) {
        gpFire = gp.buttons[6].value;
      } else if (gp.buttons[7].value) {
        gpFire = gp.buttons[7].value;
      } else {
        gpFire = 0;
      }
    }

    // Turning
    if (gp.axes[0]) {
      gpTurn = gp.axes[0];
    } else if (gp.axes[2]) {
      gpTurn = gp.axes[2];
    }
  }

  return { gpTurn, gpFire };
}
