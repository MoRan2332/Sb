let Tool = {
    randomColor: function () {
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']
        let str = '#';
        for (let i = 0; i < 6; i++) {
            str += arr[Math.floor(Math.random() * 16)];
        }
        return str;
    }
};
(function (w) {

    let list = [];

    function Food(obj) {
        obj = obj || {};
        this.width = obj.width || 20;
        this.height = obj.height || 20;
        this.x = obj.x || 0;
        this.y = obj.y || 0;
        this.color = obj.color || 'red';


    }
    Food.prototype.render = function (map) {
        remove(map);
        let fDiv = document.createElement('div');
        this.x = Math.floor(Math.random() * map.offsetWidth / this.width);
        this.y = Math.floor(Math.random() * map.offsetHeight / this.height);
        fDiv.style.width = this.width + 'px';
        fDiv.style.height = this.height + 'px';
        fDiv.style.top = this.y * this.height + 'px';
        fDiv.style.left = this.x * this.width + 'px';
        fDiv.style.backgroundColor = Tool.randomColor();
        fDiv.style.position = 'absolute'
        list.push(fDiv);
        map.appendChild(fDiv);
    };

    function remove(map) {
        for (let i = 0; i < list.length; i++) {
            map.removeChild(list[i]);
        }
        list = [];
    }
    w.Food = Food;
}(window));
//----------------------------------------------------------------------------------------------------------------------
;
(function (w) {
    let list = [];

    function Snack(obj) {
        obj = obj || {};
        this.width = obj.width || 20;
        this.height = obj.height || 20;
        this.x = obj.x || 0;
        this.y = obj.y || 0;
        this.body = [{
            x: 3,
            y: 2,
            color: 'red'
        }, {
            x: 2,
            y: 2,
            color: 'blue'
        }, {
            x: 1,
            y: 2,
            color: 'blue'
        }];
        this.color = obj.color || 'red';
        this.direction = obj.direction || 'right';
    }
    Snack.prototype.render = function (map) {
        remove(map);
        let that = this;
        this.body.forEach(function (item) {
            let sDiv = document.createElement('div');
            sDiv.style.width = that.width + 'px';
            sDiv.style.height = that.height + 'px';
            sDiv.style.top = item.y * that.height + 'px';
            sDiv.style.left = item.x * that.width + 'px';
            sDiv.style.backgroundColor = item.color;
            sDiv.style.position = 'absolute'
            list.push(sDiv);
            map.appendChild(sDiv);
        })
        // console.log(list);
    };
    Snack.prototype.move = function (Food, map) {

        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        switch (this.direction) {
            case 'up':
                this.body[0].y++;
                break;
            case 'down':
                this.body[0].y--;
                break;
            case 'left':
                this.body[0].x--;
                break;
            case 'right':
                this.body[0].x++;
                break;
        }
        //长身体
        if (Food.x == this.body[0].x && Food.y == this.body[0].y) {
            let obj = {
                x: this.body[this.body.length - 1].x,
                y: this.body[this.body.length - 1].y,
                color: Tool.randomColor()
            }
            this.body.push(obj)
            Food.render(map)
        }


    }

    function remove(map) {
        for (let i = 0; i < list.length; i++) {
            map.removeChild(list[i]);
        }
        list = [];

    }

    w.Snack = Snack;
}(window));
//----------------------------------------------------------------------------------------------------------------------
;
(function (w) {
    let that = null;

    function Game(map) {
        this.Food = new Food();
        this.Snack = new Snack();
        this.map = map;
        that = this;
    }
    Game.prototype.start = function (level) {

        this.Snack.render(this.map);
        this.Food.render(this.map);
        let timeId = setInterval(function () {
            this.Snack.move(this.Food, this.map);
            let headX = this.Snack.body[0].x * this.Snack.width;
            let headY = this.Snack.body[0].y * this.Snack.height;
            console.log(headX, headY);
            for (let i = 1; i < this.Snack.body.length; i++) {
                if (this.Snack.body[0].x == this.Snack.body[i].x && this.Snack.body[0].y == this.Snack.body[i].y) {
                    alert('game over ');
                    clearInterval(timeId);
                    window.location.reload();
                    return;
                }
            }
            if (headX < 0 || headX == this.map.offsetWidth || headY < 0 || headY == this.map.offsetHeight) {

                alert('game over ');
                clearInterval(timeId);
                window.location.reload();
                return;
            }
            this.Snack.render(this.map);
        }.bind(that), level);

        //改变移动方向
        (function () {
            document.onkeydown = function (e) {
                switch (e.keyCode) {
                    //up
                    case 40: {
                        if (this.Snack.direction != 'down')
                            this.Snack.direction = 'up';
                    }
                    break;
                    //down
                case 38: {
                    if (this.Snack.direction != 'up')
                        this.Snack.direction = 'down';
                }
                break;
                //left
                case 37: {
                    if (this.Snack.direction != 'right')
                        this.Snack.direction = 'left';
                }
                break;
                //right
                case 39: {
                    if (this.Snack.direction != 'left')
                        this.Snack.direction = 'right';
                }
                break;
                default:
                    break;
                }
                // console.log(e.keyCode);

            }.bind(that);
        })();

    }



    w.Game = Game;

})(window)
//----------------------------------------------------------------------------------------------------------------------
window.onload = function () {
    let map = document.querySelector('#map');
    let game = new Game(map);
    let level = null;
    for (let i = 0; i < document.querySelectorAll('.level').length; i++) {
        document.querySelectorAll('.level')[i].onclick = function () {
            if (i == 0) {
                level = 500;

            } else if (i == 1) {
                level = 100;
            } else if (i == 2) {
                level = 50;
            } else if (i == 3) {
                level = 10;
            }
            document.querySelector('.mask').style.display = 'none';
            game.start(level);
        }
    }
}