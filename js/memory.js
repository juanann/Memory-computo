;(function( window ) {

  'use strict';



  function extend( a, b ) {
    for( var key in b ) { 
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };


  function Memory( options ) {
    this.options = extend( {}, this.options );
    extend( this.options, options );
    this._init();
  }

  Memory.prototype.options = {
    wrapperID : "container",
    cards : [
      {
        id : 1,
        img: "img/default/comp-01.png"
      },
      {
        id : 2,
        img: "img/default/comp-02.png"
      },
      {
        id : 3,
        img: "img/default/comp-03.png"
      },
      {
        id : 4,
        img: "img/default/comp-04.png"
      },
      {
        id : 5,
        img: "img/default/comp-05.png"
      },
      {
        id : 6,
        img: "img/default/comp-06.png"
      },
      {
        id : 7,
        img: "img/default/comp-07.png"
      },
      {
        id : 8,
        img: "img/default/comp-08.png"
      },
      {
        id : 9,
        img: "img/default/comp-09.png"
      },
      {
        id : 10,
        img: "img/default/comp-10.png"
      },
      {
        id : 11,
        img: "img/default/comp-11.png"
      },
      {
        id : 12,
        img: "img/default/comp-12.png"
      },
      {
        id : 13,
        img: "img/default/comp-13.png"
      },
      {
        id : 14,
        img: "img/default/comp-14.png"
      },
      {
        id : 15,
        img: "img/default/comp-15.png"
      },
      {
        id : 16,
        img: "img/default/comp-16.png"
      }
    ],
    onGameStart : function() { return false; },
    onGameEnd : function() { return false; }
  }

  

  Memory.prototype._init = function() {
    this.game = document.createElement("div");
    this.game.id = "mg";
    this.game.className = "mg";
    document.getElementById(this.options.wrapperID).appendChild(this.game);

    this.gameMeta = document.createElement("div");
    this.gameMeta.className = "mg__meta clearfix";

    this.gameStartScreen = document.createElement("div");
    this.gameStartScreen.id = "mg__start-screen";
    this.gameStartScreen.className = "mg__start-screen";

    this.gameWrapper = document.createElement("div");
    this.gameWrapper.id = "mg__wrapper";
    this.gameWrapper.className = "mg__wrapper";
    this.gameContents = document.createElement("div");
    this.gameContents.id = "mg__contents";
    this.gameWrapper.appendChild(this.gameContents);

    this.gameMessages = document.createElement("div");
    this.gameMessages.id = "mg__onend";
    this.gameMessages.className = "mg__onend";

    this._setupGame();
  };



  Memory.prototype._setupGame = function() {
    var self = this;
    this.gameState = 1;
    this.cards = shuffle(this.options.cards);
    this.card1 = "";
    this.card2 = "";
    this.card1id = "";
    this.card2id = "";
    this.card1flipped = false;
    this.card2flipped = false;
    this.flippedTiles = 0;
    this.chosenLevel = "";
    this.numMoves = 0;

    this.gameMetaHTML = '<div class="mg__meta--left">\
      <span class="mg__meta--level">Nivel: \
      <span id="mg__meta--level">' + this.chosenLevel + '</span>\
      </span>\
      <span class="mg__meta--moves">Movimientos: \
      <span id="mg__meta--moves">' + this.numMoves + '</span>\
      </span>\
      </div>\
      <div class="mg__meta--right">\
      <button id="mg__button--restart" class="mg__button">Vuelve a comenzar</button>\
      </div>';
    this.gameMeta.innerHTML = this.gameMetaHTML;
    this.game.appendChild(this.gameMeta);

    this.gameStartScreenHTML = '<h2 class="mg__start-screen--heading">¡Sen! Bienvenida a tu guía de Cómputo</h2>\
      <p class="mg__start-screen--text">Debes encontrar las tarjetas que sean iguales. No debe ser TAN difícil, pero espero que te sea divertido ¯\_(ツ)_/¯</p>\
      <h3 class="mg__start-screen--sub-heading">Selecciona el nivel</h3>\
      <ul class="mg__start-screen--level-select">\
      <li><span data-level="1">Nivel 1 - Fáaaacil (4 x 2)</span></li>\
      <li><span data-level="2">Nivel 2 - No tan Fácil (6 x 3)</span></li>\
      <li><span data-level="3">Nivel 3 - Un poco dificil pero no tanto (8 x 4)</span></li>\
      </ul>';
    this.gameStartScreen.innerHTML = this.gameStartScreenHTML;
    this.game.appendChild(this.gameStartScreen);

    document.getElementById("mg__button--restart").addEventListener( "click", function(e) {
      self.resetGame();
    });

    this._startScreenEvents();
  }

 
  Memory.prototype._startScreenEvents = function() {
    var levelsNodes = this.gameStartScreen.querySelectorAll("ul.mg__start-screen--level-select span");
    for ( var i = 0, len = levelsNodes.length; i < len; i++ ) {
      var levelNode = levelsNodes[i];
      this._startScreenEventsHandler(levelNode);
    }
  };


  Memory.prototype._startScreenEventsHandler = function(levelNode) {
    var self = this;
    levelNode.addEventListener( "click", function(e) {
      if (self.gameState === 1) {
        self._setupGameWrapper(this);
      }
    });
  }



  Memory.prototype._setupGameWrapper = function(levelNode) {
    this.level = levelNode.getAttribute("data-level");
    this.gameStartScreen.parentNode.removeChild(this.gameStartScreen);
    this.gameContents.className = "mg__contents mg__level-"+this.level;
    this.game.appendChild(this.gameWrapper);

    this.chosenLevel = this.level;
    document.getElementById("mg__meta--level").innerHTML = this.chosenLevel;

    this._renderTiles();
  };



  Memory.prototype._renderTiles = function() {
    this.gridX = this.level * 2 + 2;
    this.gridY = this.gridX / 2;
    this.numTiles = this.gridX * this.gridY;
    this.halfNumTiles = this.numTiles/2;
    this.newCards = [];
    for ( var i = 0; i < this.halfNumTiles; i++ ) {
      this.newCards.push(this.cards[i], this.cards[i]);
    }
    this.newCards = shuffle(this.newCards);
    this.tilesHTML = '';
    for ( var i = 0; i < this.numTiles; i++  ) {
      var n = i + 1;
      this.tilesHTML += '<div class="mg__tile mg__tile-' + n + '">\
        <div class="mg__tile--inner" data-id="' + this.newCards[i]["id"] + '">\
        <span class="mg__tile--outside"></span>\
        <span class="mg__tile--inside"><img src="' + this.newCards[i]["img"] + '"></span>\
        </div>\
        </div>';
    }
    this.gameContents.innerHTML = this.tilesHTML;
    this.gameState = 2;
    this.options.onGameStart();
    this._gamePlay();
  }



  Memory.prototype._gamePlay = function() {
    var tiles = document.querySelectorAll(".mg__tile--inner");
    for (var i = 0, len = tiles.length; i < len; i++) {
      var tile = tiles[i];
      this._gamePlayEvents(tile);
    };
  };



  Memory.prototype._gamePlayEvents = function(tile) {
    var self = this;
    tile.addEventListener( "click", function(e) {
      if (!this.classList.contains("flipped")) {
        if (self.card1flipped === false && self.card2flipped === false) {
          this.classList.add("flipped");
          self.card1 = this;
          self.card1id = this.getAttribute("data-id");
          self.card1flipped = true;
        } else if( self.card1flipped === true && self.card2flipped === false ) {
          this.classList.add("flipped");
          self.card2 = this;
          self.card2id = this.getAttribute("data-id");
          self.card2flipped = true;
          if ( self.card1id == self.card2id ) {
            self._gameCardsMatch();
          } else {
            self._gameCardsMismatch();
          }
        }
      }
    });
  }



  Memory.prototype._gameCardsMatch = function() {
    var self = this;

    window.setTimeout( function(){
      self.card1.classList.add("correct");
      self.card2.classList.add("correct");
    }, 300 );

    window.setTimeout( function(){
      self.card1.classList.remove("correct");
      self.card2.classList.remove("correct");
      self._gameResetVars();
      self.flippedTiles = self.flippedTiles + 2;
      if (self.flippedTiles == self.numTiles) {
        self._winGame();
      }
    }, 1500 );

    this._gameCounterPlusOne();
  };



  Memory.prototype._gameCardsMismatch = function() {
    var self = this;

    window.setTimeout( function(){
      self.card1.classList.remove("flipped");
      self.card2.classList.remove("flipped");
      self._gameResetVars();
    }, 900 );

    this._gameCounterPlusOne();
  };


  Memory.prototype._gameResetVars = function() {
    this.card1 = "";
    this.card2 = "";
    this.card1id = "";
    this.card2id = "";
    this.card1flipped = false;
    this.card2flipped = false;
  }



  Memory.prototype._gameCounterPlusOne = function() {
    this.numMoves = this.numMoves + 1;
    this.moveCounterUpdate = document.getElementById("mg__meta--moves").innerHTML = this.numMoves;
  };



  Memory.prototype._clearGame = function() {
    if (this.gameMeta.parentNode !== null) this.game.removeChild(this.gameMeta);
    if (this.gameStartScreen.parentNode !== null) this.game.removeChild(this.gameStartScreen);
    if (this.gameWrapper.parentNode !== null) this.game.removeChild(this.gameWrapper);
    if (this.gameMessages.parentNode !== null) this.game.removeChild(this.gameMessages);
  }



  Memory.prototype._winGame = function() {
    var self = this;
    if (this.options.onGameEnd() === false) {
      this._clearGame();
      this.gameMessages.innerHTML = '<h2 class="mg__onend--heading">¡Felicidadeeees!</h2>\
        <p class="mg__onend--message">Lograste ganar en tan solo ' + this.numMoves + ' movimientos. (ﾉ◕ヮ◕)ﾉ</p>\
        <button id="mg__onend--restart" class="mg__button">¿Quieres volver a jugar? :)</button>';
      this.game.appendChild(this.gameMessages);
      document.getElementById("mg__onend--restart").addEventListener( "click", function(e) {
        self.resetGame();
      });
    } else {
      this.options.onGameEnd();
    }
  }


  Memory.prototype.resetGame = function() {
    this._clearGame();
    this._setupGame();
  };


  window.Memory = Memory;

})( window );