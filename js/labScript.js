'use strict';

const canvas = document.getElementById("labCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 24;
const imgWall = new Image();
imgWall.src = "img/labWall.jpg";
const imgFloor = new Image();
imgFloor.src = "img/labFloor.jpg";

class Board {
    constructor() {
        this.width = Math.floor(canvas.clientWidth / gridSize);
        this.height = Math.floor(canvas.clientHeight / gridSize);
        this.grid = Array(this.width).fill(false).map(x => Array(this.height).fill(false))
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x == 0 || y == 0
                    || x == this.width - 1
                    || y == this.height - 1
                    || (x % 6 == 5 && (x+y) % 10 < 5)
                    || (y % 5 == 3 && (x+y) % 9 < 3)
                ) {
                    this.grid[x][y] = true;
                }
            }
        }
    }

    draw() {
        
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.grid[x][y] === true) {
                    ctx.drawImage(imgWall, x * gridSize, y * gridSize, gridSize, gridSize);
                }
                else {
                    ctx.drawImage(imgFloor, x * gridSize, y * gridSize, gridSize, gridSize);
                }
            }
        }
    }
}

class Mouse {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.direction = 0.0;
        this.deltaDirection = 0.0;
        this.speed = 2.0;
        this.bodySize = 10;
        this.tailLength = 15;
        this.tail = Array(this.tailLength).fill({x: this.x, y: this.y})
    }

    isWallAhead() {
        let aheadLeftX = this.x + 2 * this.bodySize * Math.cos(this.direction - 0.5);
        let aheadLeftY = this.y + 2 * this.bodySize * Math.sin(this.direction - 0.5);
        let aheadRightX = this.x + 2 * this.bodySize * Math.cos(this.direction + 0.5);
        let aheadRightY = this.y + 2 * this.bodySize * Math.sin(this.direction + 0.5);

        return board.grid[Math.floor(aheadLeftX / gridSize)][Math.floor(aheadLeftY / gridSize)]
            || board.grid[Math.floor(aheadRightX / gridSize)][Math.floor(aheadRightY / gridSize)];
    }

    isWallLeftRight() {
        let leftX = this.x + 2 * this.bodySize * Math.cos(this.direction - 1.2);
        let leftY = this.y + 2 * this.bodySize * Math.sin(this.direction - 1.2);
        let rightX = this.x + 2 * this.bodySize * Math.cos(this.direction + 1.2);
        let rightY = this.y + 2 * this.bodySize * Math.sin(this.direction + 1.2);

        let leftWall = board.grid[Math.floor(leftX / gridSize)][Math.floor(leftY / gridSize)];
        let rightWall = board.grid[Math.floor(rightX / gridSize)][Math.floor(rightY / gridSize)];

        if (leftWall && !rightWall) {
            return "left";
        }
        else if (!leftWall && rightWall) {
            return "right";
        }
        else {
            return "equal";
        }
    }

    turnRight() {
        this.direction += 0.1;
    }

    turnLeft() {
        this.direction -= 0.1;
    }

    slowDown() {
        if (this.speed > 0.0) {
            this.speed -= 0.5;
        }
    }

    speedUp() {
        if (this.speed < 2.0) {
            this.speed += 0.2;
        }
    }

    update() {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
        if (Math.random() < 0.1) {
            this.deltaDirection = (Math.random() - 0.5) * 0.1;
        }
        this.direction += this.deltaDirection;
        if (this.isWallAhead()) {
            this.slowDown();
            let side = this.isWallLeftRight();
            if (side === "left") {
                this.turnRight();
            }
            else if (side === "right") {
                this.turnLeft();
            }
            else {
                this.direction += this.deltaDirection * 4;
            }
        }
        else {
            this.speedUp();
        }

        // update the tail with new points
        if (Math.pow(this.x - this.tail.at(-1).x, 2) + Math.pow(this.y - this.tail.at(-1).y, 2) > 1.0) {
            this.tail.shift();
            this.tail.push({ x: this.x, y: this.y });
        }
    }

    draw() {

        // tail
        ctx.strokeStyle = "hotpink";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.tail[0].x, this.tail[0].y);
        for (var i = 1; i < this.tail.length; i++) {
            ctx.lineTo(this.tail[i].x, this.tail[i].y);
        }
        ctx.stroke();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction);

        // body
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.bodySize * -0.2, 0, this.bodySize * 0.7, 0, 2 * Math.PI);
        ctx.arc(this.bodySize * 0.2, 0, this.bodySize * 0.55, 0, 2 * Math.PI);
        ctx.arc(this.bodySize * 0.7, 0, this.bodySize * 0.3, 0, 2 * Math.PI);
        ctx.fill();

        // eyes
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.bodySize * 0.6, this.bodySize * -0.3, this.bodySize * 0.15, 0, 2 * Math.PI);
        ctx.arc(this.bodySize * 0.6, this.bodySize * 0.3, this.bodySize * 0.15, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "rgb(40, 20, 0)";
        ctx.beginPath();
        ctx.arc(this.bodySize * 1.0, 0, this.bodySize * 0.1, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

}


const updateCanvas = function () {
    mouse.update();
    board.draw();
    mouse.draw();
    window.requestAnimationFrame(updateCanvas);
}

const board = new Board();
const mouse = new Mouse(50, 50);
window.requestAnimationFrame(updateCanvas);