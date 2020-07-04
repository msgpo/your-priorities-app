import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.ypAppSwipeBehavior
 */
export const ypAppSwipeBehavior = {

  properties: {
    touchXDown: Number,
    touchYDown: Number,
    touchXUp: Number,
    touchYUp: Number
  },

  attached: function () {
    document.addEventListener('touchstart', this._handleTouchStart.bind(this), {passive: true});
    document.addEventListener('touchmove', this._handleTouchMove.bind(this), {passive: true});
    document.addEventListener('touchend', this._handleTouchEnd.bind(this), {passive: true});
  },

  detached: function () {
    document.addEventListener('touchstart', this._handleTouchStart.bind(this));
    document.addEventListener('touchmove', this._handleTouchMove.bind(this));
    document.addEventListener('touchend', this._handleTouchEnd.bind(this));
  },

  _handleTouchStart: function (event) {
    if (this.page==='post' && this.goForwardToPostId) {
      var touches = event.touches || event.originalEvent.touches;
      const firstTouch = touches[0];

      if (firstTouch.clientX>32 && firstTouch.clientX<window.innerWidth-32) {
        this.touchXDown = firstTouch.clientX;
        this.touchYDown = firstTouch.clientY;
        this.touchXUp = null;
        this.touchYUp = null;
      }
    }
  },

  _handleTouchMove: function (event) {
    if (this.page==='post' && this.touchXDown && this.goForwardToPostId) {
      var touches = event.touches || event.originalEvent.touches;
      this.touchXUp = touches[0].clientX;
      this.touchYUp = touches[0].clientY;
    }
  },

  _handleTouchEnd: function (event) {
    if (this.page==='post' && this.touchXUp && this.goForwardToPostId) {
      var xDiff = this.touchXDown-this.touchXUp;
      var yDiff = this.touchYDown-this.touchYUp;
      //console.debug("xDiff: "+xDiff+" yDiff: "+yDiff);

      if ((Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(yDiff)<120)) {
        var factor = 3;

        if (window.innerWidth>500)
          factor = 4;

        if (window.innerWidth>1023)
          factor = 5;

        if (window.innerWidth>1400)
          factor = 6;

        var minScrollFactorPx = Math.round(window.innerWidth/factor);

        console.log("Recommendation swipe minScrollFactorPx: "+minScrollFactorPx);


        if (!this.userDrawerOpenedDelayed && !this.navDrawOpenedDelayed) {
          if ( xDiff > 0 && xDiff > minScrollFactorPx ) {
            window.scrollTo(0, 0);
            window.appGlobals.activity('swipe', 'postForward');
            this.$$("#goPostForward").dispatchEvent(new Event('tap'));

          } else if (xDiff < 0 && xDiff < (-Math.abs(minScrollFactorPx))) {
            if (this.showBackToPost===true) {
              window.scrollTo(0, 0);
              this._goToPreviousPost();
              window.appGlobals.activity('swipe', 'postBackward');
            }
          }
        } else {
          console.log("Recommendation swipe not active with open drawers")
        }

        this.touchXDown = null;
        this.touchXUp = null;
        this.touchYDown = null;
        this.touchYUp = null;
      }
    }
  }
};
