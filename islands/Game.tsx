import { IS_BROWSER } from "$fresh/runtime.ts";
import { useContext, useEffect, useState } from "preact/hooks";
// import Phaser from "phaser";
import { Ship } from '../types/ship.ts';

// const game = new Phaser.Game(config);
let game: Phaser.Game;
let scene: Phaser.Scene;

export default function Game({ ships }: { ships: Ship[]}) {
  if (!IS_BROWSER) {
    return <p />;
  }

  const [value, setValue] = useState(false);
  useEffect(() => {
    if (value) {
      class Example extends Phaser.Scene {
        text: Phaser.GameObjects.Text[] = new Array(ships.length);
        preload() {
          this.load.image("sky", "/assets/darkPurple.png");
          this.load.image("ship1blue", "/assets/playerShip1_blue.png");
        }

        create() {
          scene = this;
          this.add.tileSprite(0, 0, 400, 400, "sky").setOrigin(0, 0);
          ships.forEach((ship, index) => {
            this.add.image(80, ((80+40) * index) + 80, "ship1blue").setRotation(2 * Math.PI / 4);
            this.text[index] = this.add.text(50, ((80+40) * index) + 130, ship.cooldown.remainingSeconds.toString()).setFontSize(12).setShadow(2, 2);
          });

          setInterval(() => {
            this.text.forEach((text, index) => {
              if (Number(text.text) > 0) {
                text.setText((Number(text.text) - 1).toString());
              } 
            });
          }, 1000);
          // this.add.image(80, 80, "ship1blue").setRotation(2 * Math.PI / 4);
        }
      }

      const config = {
        type: Phaser.AUTO,
        width: 400,
        height: 400,
        scene: Example,
        parent: "game",
      };

      game = new Phaser.Game(config);
    }
  }, [value]);

  return (
    <div>
      <script
        onLoad={() => setValue(true)}
        src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser-arcade-physics.min.js"
      />
      <div id="game"></div>
    </div>
  );
}
