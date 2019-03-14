export default (function (document, window) {
  "use strict";

  /**
   *
   * Video Constructor
   *
   * @param {string} selector
   * @param {object} options
   * @returns {video object}
   */
   function Video(selector, options) {
    var defaults = {
      playBtnHTML:
        '<svg width="12" height="15"><path d="M0 0 L12 7.5 L0 15 Z" /></svg>',
      pauseBtnHTML:
        '<svg width="20" height="15"><path d="M0 0 L3.5 0 L3.5 15 L0 15  M8.5 0 L12 0 L12 15 L8.5 15  Z" /></svg>',
      fullscreenButtonHTML:
        '<svg width="19px" height="17px"><g data-id="full_screen_on" class="full_screen_on"><polygon data-id="bottom_left" points="6.78571429 14.4761905 2.71428571 14.4761905 2.71428571 10.8571429 0 10.8571429 0 16.8888889 6.78571429 16.8888889"></polygon><polygon data-id="top_left" points="2.71428571 2.41269841 6.78571429 2.41269841 6.78571429 0 0 0 0 6.03174603 2.71428571 6.03174603"></polygon><polygon data-id="bottom_right" points="19 10.8571429 16.2857143 10.8571429 16.2857143 14.4761905 12.2142857 14.4761905 12.2142857 16.8888889 19 16.8888889"></polygon><polygon data-id="top_right" points="16.2857143 2.41269841 16.2857143 6.03174603 19 6.03174603 19 0 12.2142857 0 12.2142857 2.41269841"></polygon></g><g data-id="full_screen_off" class="full_screen_off"><polygon data-id="bottom_left" points="0 13.2698413 4.07142857 13.2698413 4.07142857 16.8888889 6.78571429 16.8888889 6.78571429 10.8571429 0 10.8571429"></polygon><polygon data-id="top_left" points="4.07142857 3.61904762 0 3.61904762 0 6.03174603 6.78571429 6.03174603 6.78571429 0 4.07142857 0"></polygon><polygon data-id="bottom_right" points="12.2142857 16.8888889 14.9285714 16.8888889 14.9285714 13.2698413 19 13.2698413 19 10.8571429 12.2142857 10.8571429"></polygon><polygon data-id="top_right" points="14.9285714 3.61904762 14.9285714 0 12.2142857 0 12.2142857 6.03174603 19 6.03174603 19 3.61904762"></polygon></g></svg>',
      settingsButtonHTML:
        '<svg width="19px" height="19px"><g transform="translate(-1534.000000, -543.000000)"><path d="M1552.30478,551.116529 L1550.42267,550.802541 C1550.28588,550.24327 1550.08643,549.708662 1549.82667,549.210038 L1551.03154,547.716077 C1551.2878,547.40035 1551.27616,546.946067 1551.00599,546.641346 L1550.25744,545.798877 C1549.98611,545.494474 1549.53614,545.430094 1549.19292,545.64694 L1547.58335,546.658776 C1546.87541,546.16414 1546.07349,545.798877 1545.20842,545.586929 L1544.89353,543.694667 C1544.82746,543.293991 1544.48074,543 1544.07374,543 L1542.94569,543 C1542.53951,543 1542.19163,543.293991 1542.12701,543.694667 L1541.81041,545.587523 C1541.09519,545.762637 1540.42461,546.045305 1539.81264,546.417586 L1538.28192,545.325128 C1537.95201,545.08943 1537.49889,545.126285 1537.21099,545.413575 L1536.41405,546.21111 C1536.12677,546.499015 1536.08992,546.952153 1536.32622,547.282066 L1537.42119,548.815767 C1537.05242,549.423131 1536.77267,550.089913 1536.59758,550.798788 L1534.6946,551.11655 C1534.29456,551.182626 1534,551.529377 1534,551.936414 L1534,553.063607 C1534,553.470602 1534.29456,553.817395 1534.6946,553.883471 L1536.59758,554.201233 C1536.74137,554.784551 1536.95011,555.341744 1537.22755,555.85837 L1536.02817,557.343892 C1535.77278,557.659322 1535.78351,558.113902 1536.05368,558.418348 L1536.80166,559.260837 C1537.07301,559.565813 1537.52321,559.629026 1537.86647,559.412731 L1539.49924,558.387027 C1540.19011,558.859589 1540.9717,559.206912 1541.81041,559.412731 L1542.12701,561.305312 C1542.19165,561.706009 1542.53951,562 1542.94569,562 L1544.07374,562 C1544.48074,562 1544.82746,561.70603 1544.89353,561.305333 L1545.20895,559.412753 C1545.91524,559.239992 1546.57732,558.962244 1547.18384,558.596346 L1548.77835,559.735181 C1549.10766,559.971727 1549.56112,559.934617 1549.84872,559.646415 L1550.64598,558.849156 C1550.93292,558.56212 1550.97179,558.109237 1550.73349,557.77873 L1549.59827,556.187075 C1549.9681,555.577675 1550.24934,554.909705 1550.42333,554.197671 L1552.30542,553.883407 C1552.70663,553.817331 1553,553.47056 1553,553.063544 L1553,551.93635 C1552.99941,551.529377 1552.70604,551.182626 1552.30478,551.116529 Z M1543.52984,556.062515 C1541.5628,556.062515 1539.96744,554.46681 1539.96744,552.500011 C1539.96744,550.532915 1541.5628,548.937507 1543.52984,548.937507 C1545.49653,548.937507 1547.09219,550.532915 1547.09219,552.500011 C1547.09219,554.46681 1545.49653,556.062515 1543.52984,556.062515 Z"></path></g></svg>',
      volumeBtnHTML:
        '<svg width="15px" height="12px"><g data-id="volume_btn"><path d="M7.74850103,0.0291771429 C7.55756674,0.0291771429 7.39244353,0.1068 7.25313142,0.261874286 L3.58811088,2.87321143 L0.704445585,2.87321143 C0.513480493,2.87321143 0.34835729,2.95086857 0.209075975,3.10590857 C0.0695482546,3.26115429 0,3.44475429 0,3.65708571 L0,8.36166857 C0,8.57420571 0.0697330595,8.75804571 0.209045175,8.91308571 C0.348326489,9.06836571 0.513480493,9.14578286 0.704414784,9.14578286 L3.58811088,9.14578286 L7.25334702,11.75688 C7.39262834,11.91216 7.55775154,11.9895771 7.74871663,11.9895771 C7.93946612,11.9895771 8.10443532,11.91192 8.24393224,11.75688 C8.38318275,11.60184 8.45297741,11.418 8.45297741,11.2054629 L8.45297741,0.813291429 C8.45297741,0.60096 8.38318275,0.41712 8.24393224,0.261874286 C8.10421971,0.107005714 7.93928131,0.0291771429 7.74850103,0.0291771429 Z" data-id="volume-0" class="volume-0"></path><path d="M11.7006468,7.74308571 C12.0124435,7.20822857 12.1683265,6.63037714 12.1683265,6.00949714 C12.1683265,5.38882286 12.0124435,4.80884571 11.7006468,4.26980571 C11.3886653,3.73076571 10.9760575,3.35094857 10.4623614,3.13042286 C10.3888398,3.08972571 10.2972382,3.06915429 10.1871869,3.06915429 C9.99619097,3.06915429 9.83128337,3.14468571 9.69197125,3.29574857 C9.55247433,3.44705143 9.48292608,3.63274286 9.48292608,3.85326857 C9.48292608,4.02469714 9.52703285,4.16989714 9.6150924,4.28825143 C9.70309035,4.40681143 9.80941478,4.50877714 9.93415811,4.59459429 C10.058809,4.68041143 10.1835832,4.77442286 10.3083265,4.87638857 C10.4329774,4.97856 10.5394559,5.12355429 10.6274538,5.31137143 C10.7155133,5.49939429 10.7596201,5.73209143 10.7596201,6.00966857 C10.7596201,6.28752 10.7155133,6.52021714 10.6274538,6.708 C10.5394559,6.89598857 10.4329774,7.04098286 10.3083265,7.14298286 C10.1835524,7.24515429 10.0587782,7.33896 9.93415811,7.42477714 C9.80938398,7.51059429 9.70309035,7.61276571 9.6150924,7.73115429 C9.52703285,7.84971429 9.48292608,7.99450286 9.48292608,8.16613714 C9.48292608,8.38669714 9.55265914,8.57256 9.69197125,8.72365714 C9.83128337,8.87496 9.99637577,8.95025143 10.1871253,8.95025143 C10.2972074,8.95025143 10.3888398,8.92988571 10.4623614,8.88898286 C10.9760267,8.66002286 11.3886653,8.27814857 11.7006468,7.74308571 Z" data-id="volume-1" class="volume-1"></path><path d="M11.574117,0.238971429 C11.4787577,0.198274286 11.3831828,0.177702857 11.2880082,0.177702857 C11.0970739,0.177702857 10.9319199,0.25536 10.7926078,0.4104 C10.6531109,0.56568 10.5835626,0.749485714 10.5835626,0.961817143 C10.5835626,1.28033143 10.7266324,1.52142857 11.0128029,1.68466286 C11.4237474,1.92178286 11.7023409,2.10116571 11.8493532,2.22370286 C12.3922177,2.66475429 12.8159754,3.21809143 13.1205955,3.88385143 C13.4250616,4.54964571 13.5773101,5.25802286 13.5773101,6.00942857 C13.5773101,6.76104 13.4250616,7.46941714 13.1205955,8.13521143 C12.8159446,8.80100571 12.3922793,9.35430857 11.8493532,9.79536 C11.7024949,9.91789714 11.4237474,10.09752 11.0128029,10.3344343 C10.7266324,10.4979086 10.5835626,10.7387657 10.5835626,11.05728 C10.5835626,11.2698514 10.6533573,11.4536914 10.7926078,11.6087314 C10.9319199,11.7639771 11.1008008,11.8414286 11.2989425,11.8414286 C11.3869405,11.8414286 11.4785729,11.8210629 11.574117,11.78016 C12.6012628,11.2983771 13.4267248,10.5285257 14.0504415,9.47081143 C14.6740349,8.41302857 14.9860164,7.25941714 14.9860164,6.00966857 C14.9860164,4.75995429 14.6740349,3.60651429 14.0504415,2.54856 C13.4267556,1.49060571 12.6012628,0.72096 11.574117,0.238971429 Z" data-id="volume-2" class="volume-2" style=""></path></g></svg>',
      bigPlayBtnHTML:
        '<svg width="66px" height="66px" viewBox="0 0 66 66"><g><circle fill="#000000" opacity="0.699999988" cx="32.9565217" cy="32.9565217" r="32.5"></circle><path d="M48.5540215,32.7343703 C49.006178,33.0516732 49.0053429,33.5667088 48.5540215,33.8834255 L26.8027359,49.1474856 C26.3505794,49.4647885 25.9840341,49.2827942 25.9840341,48.7216656 L25.9840341,17.8961302 C25.9840341,17.3436535 26.3514145,17.1535935 26.8027359,17.4703103 L48.5540215,32.7343703 Z" fill="#FFFFFF"></path></g></svg>',

      autoPlay: false,
      keyboard: true,
      repeat: false,
      speedOptions: [
        {
          speed: 0.5,
          speedLabel: "0.5"
        },
        {
          speed: 0.75,
          speedLabel: "0.75"
        },
        {
          speed: 1,
          speedLabel: "Normal"
        },
        {
          speed: 1.25,
          speedLabel: "1.25"
        },
        {
          speed: 1.5,
          speedLabel: "1.5"
        },
        {
          speed: 1.75,
          speedLabel: "1.75"
        },
        {
          speed: 2,
          speedLabel: "2"
        }
      ],
      containerClass: "",
      onInit: function () { },
      beforeDestroy: function () { }
    };

    var elVideo = document.querySelector(selector);

    this.el = elVideo;

    this.options = extendDefaults(defaults, options);

    this.videoElements = {};

    this.init();
  }

  Video.prototype = {
    init: function () {
      this.stateControls = this.el.controls;
      this.el.controls = false;
      this._createVideoElements();
      this._registerEvents();
      this.setSpeedLabel();
      if (this.options.autoPlay) {
        this.el.autoplay = true;
      }
      if (this.options.repeat) {
        this.el.loop = true;
      }
      if (this.el.loop) {
        this.setRepeatMark();
      }

      if (!isFullscreenEnabled()) {
        this.videoElements.fullscreenButton.style.display = "none";
      }

      this.options.onInit.call(this);
    },
    destroy: function () {
      this.options.beforeDestroy.call(this);

      var videoEl = this.el.cloneNode(true);
      videoEl.controls = this.stateControls;
      var parentVideo = this.videoElements.wrapperVideo.parentNode;
      parentVideo.insertBefore(videoEl, this.videoElements.wrapperVideo);
      parentVideo.removeChild(this.videoElements.wrapperVideo);
    },

    _createVideoElements: function () {
      //create video wrapper
      var parent = this.el.parentNode;
      this.videoElements.wrapperVideo = document.createElement("div");
      parent.replaceChild(this.videoElements.wrapperVideo, this.el);
      this.videoElements.wrapperVideo.className = "kwg-video-player-container";
      if (this.options.containerClass != "") {
        this.videoElements.wrapperVideo.className +=
          " " + this.options.containerClass;
      }
      this.videoElements.wrapperVideo.appendChild(this.el);

      //document fragment video elements
      var dfVideoElements = document.createDocumentFragment();

      //create big play button
      this.videoElements.bigPlayBtn = document.createElement("div");
      this.videoElements.bigPlayBtn.className = "bigPlayBtn";
      this.videoElements.bigPlayBtn.innerHTML = this.options.bigPlayBtnHTML;
      dfVideoElements.appendChild(this.videoElements.bigPlayBtn);

      //create big play button
      this.videoElements.loader = document.createElement("div");
      this.videoElements.loader.className = "loader";
      dfVideoElements.appendChild(this.videoElements.loader);

      //wrapper controls
      this.videoElements.videoControls = document.createElement("div");
      this.videoElements.videoControls.className = "videoControls";
      dfVideoElements.appendChild(this.videoElements.videoControls);

      // progres bar conainer start
      this.videoElements.progressWrapBarContainer = document.createElement(
        "div"
      );
      this.videoElements.progressWrapBarContainer.className =
        "progressWrapBarContainer";
      this.videoElements.videoControls.appendChild(
        this.videoElements.progressWrapBarContainer
      );

      this.videoElements.progressBarContainer = document.createElement("div");
      this.videoElements.progressBarContainer.className =
        "progressBarContainer";
      this.videoElements.progressWrapBarContainer.appendChild(
        this.videoElements.progressBarContainer
      );

      this.videoElements.playProgress = document.createElement("div");
      this.videoElements.playProgress.className = "playProgress";
      this.videoElements.progressBarContainer.appendChild(
        this.videoElements.playProgress
      );

      this.videoElements.playProgressHandle = document.createElement("div");
      this.videoElements.playProgressHandle.className = "playProgressHandle";
      this.videoElements.playProgress.appendChild(
        this.videoElements.playProgressHandle
      );

      this.videoElements.hoverProgress = document.createElement("div");
      this.videoElements.hoverProgress.className = "hoverProgress";
      this.videoElements.progressBarContainer.appendChild(
        this.videoElements.hoverProgress
      );

      this.videoElements.bufferedProgress = document.createElement("div");
      this.videoElements.bufferedProgress.className = "bufferedProgress";
      this.videoElements.progressBarContainer.appendChild(
        this.videoElements.bufferedProgress
      );
      // progres bar conainer end

      //controls
      this.videoElements.controls = document.createElement("div");
      this.videoElements.controls.className = "controls";
      this.videoElements.videoControls.appendChild(this.videoElements.controls);

      this.videoElements.leftControls = document.createElement("div");
      this.videoElements.rightControls = document.createElement("div");
      this.videoElements.leftControls.className = "leftControls";
      this.videoElements.rightControls.className = "rightControls";
      this.videoElements.controls.appendChild(this.videoElements.leftControls);
      this.videoElements.controls.appendChild(this.videoElements.rightControls);
      //controls end

      // play pause btn
      this.videoElements.btnPlayPause = document.createElement("button");
      this.videoElements.btnPlayPause.innerHTML = this.options.playBtnHTML;
      this.videoElements.btnPlayPause.className = "btnPlayPause";
      this.videoElements.leftControls.appendChild(
        this.videoElements.btnPlayPause
      );

      // display volume panel
      this.videoElements.volumePanel = document.createElement("div");
      this.videoElements.volumePanel.className = "volumePanel";
      this.videoElements.volumePanel.innerHTML = this.options.volumeBtnHTML;
      this.videoElements.leftControls.appendChild(
        this.videoElements.volumePanel
      );

      // volume Slider
      this.videoElements.volumeSlider = document.createElement("div");
      this.videoElements.volumeSlider.className = "volumeSlider";
      this.videoElements.volumePanel.appendChild(
        this.videoElements.volumeSlider
      );

      // sound Volume
      this.videoElements.soundVolume = document.createElement("div");
      this.videoElements.soundVolume.className = "soundVolume";
      this.showVolume();
      this.videoElements.volumeSlider.appendChild(
        this.videoElements.soundVolume
      );

      // sound Volume handle
      this.videoElements.soundVolumeHandle = document.createElement("div");
      this.videoElements.soundVolumeHandle.className = "soundVolumeHandle";
      this.videoElements.soundVolume.appendChild(
        this.videoElements.soundVolumeHandle
      );

      // sound hover
      this.videoElements.soundHover = document.createElement("div");
      this.videoElements.soundHover.className = "soundHover";
      this.videoElements.volumeSlider.appendChild(
        this.videoElements.soundHover
      );

      // display time
      this.videoElements.timeDisplay = document.createElement("div");
      this.videoElements.timeDisplay.className = "timeDisplay";
      this.videoElements.leftControls.appendChild(
        this.videoElements.timeDisplay
      );

      // settings wrap
      this.videoElements.settingsWrap = document.createElement("div");
      this.videoElements.settingsWrap.className = "settingsWrap";
      this.videoElements.rightControls.appendChild(
        this.videoElements.settingsWrap
      );

      // settings button
      this.videoElements.settingsButton = document.createElement("div");
      this.videoElements.settingsButton.innerHTML = this.options.settingsButtonHTML;
      this.videoElements.settingsButton.className = "settingsButton";
      this.videoElements.settingsWrap.appendChild(
        this.videoElements.settingsButton
      );

      //sepeed menu
      this.videoElements.speedMenu = document.createElement("ul");
      this.videoElements.speedMenu.className = "speedMenu";
      this.videoElements.speedMenu.innerHTML = '<li class="back">back</li>';
      var speedOptionsLength = this.options.speedOptions.length;
      for (var i = 0; i < speedOptionsLength; i++) {
        this.videoElements.speedMenu.innerHTML +=
          '<li data-speed="' +
          this.options.speedOptions[i].speed +
          '">' +
          this.options.speedOptions[i].speedLabel +
          "</li>";
      }
      this.videoElements.settingsWrap.appendChild(this.videoElements.speedMenu);

      // settings menu
      this.videoElements.settingsMenu = document.createElement("ul");
      this.videoElements.settingsMenu.className = "settingsMenu";
      this.videoElements.settingsWrap.appendChild(
        this.videoElements.settingsMenu
      );

      //options settings menu
      this.videoElements.speedOption = document.createElement("li");
      this.videoElements.speedOption.className = "speedOption";
      this.videoElements.speedOption.innerHTML =
        '<span class="item-label">Play speed</span><span class="item-content"></span>';
      this.videoElements.settingsMenu.appendChild(
        this.videoElements.speedOption
      );

      // repeat option
      this.videoElements.repeatOption = document.createElement("li");
      this.videoElements.repeatOption.innerHTML =
        '<span class="item-label">Repeat</span><span class="item-content"></span>';
      this.videoElements.settingsMenu.appendChild(
        this.videoElements.repeatOption
      );

      // full screen
      this.videoElements.fullscreenButton = document.createElement("div");
      this.videoElements.fullscreenButton.innerHTML = this.options.fullscreenButtonHTML;
      this.videoElements.fullscreenButton.className = "fullscreenButton";
      this.videoElements.rightControls.appendChild(
        this.videoElements.fullscreenButton
      );

      this.videoElements.wrapperVideo.appendChild(dfVideoElements);
    },
    _registerEvents: function () {
      this.videoElements.fullscreenButton.addEventListener(
        "click",
        this.switchFullscreen.bind(this)
      );
      this.el.addEventListener("dblclick", this.switchFullscreen.bind(this));

      this.el.addEventListener("click", this.videoPlayPause.bind(this));
      this.videoElements.btnPlayPause.addEventListener(
        "click",
        this.videoPlayPause.bind(this)
      );

      document.addEventListener("keydown", this.setKeyboardEvents.bind(this));
      document.addEventListener("click", this.unsetActiveVideo.bind(this));
      this.videoElements.wrapperVideo.addEventListener(
        "click",
        this.setActiveVideo.bind(this)
      );
      /*this.el.addEventListener('click', function (e) {
                //e.preventDefault();
            });*/

      this.videoElements.wrapperVideo.addEventListener(
        "mousemove",
        this.toggleHoverVideo.bind(this)
      );

      this.videoElements.progressBarContainer.addEventListener(
        "mousemove",
        this.showHoverProgress.bind(this)
      );
      this.videoElements.progressBarContainer.addEventListener(
        "mouseleave",
        this.hideHoverProgress.bind(this)
      );
      this.videoElements.progressBarContainer.addEventListener(
        "click",
        this.changeCurrentTime.bind(this)
      );

      //ProgressHandle
      ["mousedown", "touchstart"].map(function (e) {
        this.videoElements.playProgressHandle.addEventListener(
          e,
          this.startDraggingPlayHandle.bind(this)
        );
      }, this);
      ["mousemove", "touchmove"].map(function (e) {
        this.videoElements.wrapperVideo.addEventListener(
          e,
          this.draggingPlayHandle.bind(this)
        );
      }, this);
      ["mouseup", "touchend", "touchcancel"].map(function (e) {
        this.videoElements.wrapperVideo.addEventListener(
          e,
          this.endDraggingPlayHandle.bind(this)
        );
      }, this);
      //ProgressHandle end

      //soundVolumeHandle
      ["mousedown", "touchstart"].map(function (e) {
        this.videoElements.soundVolumeHandle.addEventListener(
          e,
          this.startDraggingVolumeHandle.bind(this)
        );
      }, this);
      ["mousemove", "touchmove"].map(function (e) {
        this.videoElements.wrapperVideo.addEventListener(
          e,
          this.draggingVolumeHandle.bind(this)
        );
      }, this);
      ["mouseup", "touchend", "touchcancel"].map(function (e) {
        this.videoElements.wrapperVideo.addEventListener(
          e,
          this.endDraggingVolumeHandle.bind(this)
        );
      }, this);
      //soundVolumeHandle end

      this.videoElements.volumeSlider.addEventListener(
        "mousemove",
        this.showHoverVolume.bind(this)
      );
      this.videoElements.volumeSlider.addEventListener(
        "mouseleave",
        this.hideHoverVolume.bind(this)
      );
      this.videoElements.volumeSlider.addEventListener(
        "click",
        this.changeVolume.bind(this)
      );
      this.videoElements.volumePanel.children[0].addEventListener(
        "click",
        this.toggleMute.bind(this)
      );

      this.el.addEventListener("pause", this._pauseVideo.bind(this));
      this.el.addEventListener("play", this._playVideo.bind(this));
      this.el.addEventListener("ended", this.endedVideo.bind(this));
      this.el.addEventListener("waiting", this.showLoader.bind(this));
      this.el.addEventListener("playing", this.hideLoader.bind(this));
      this.el.addEventListener("timeupdate", this.hideLoader.bind(this));
      this.el.addEventListener("timeupdate", this.showProgress.bind(this));
      this.videoElements.settingsButton.addEventListener(
        "click",
        this.toggleSettingsMenu.bind(this)
      );
      document.addEventListener("click", this.closeSettingsMenu.bind(this));
      this.videoElements.videoControls.addEventListener(
        "click",
        this.closeSettingsMenu.bind(this)
      );

      this.videoElements.settingsWrap.addEventListener("click", function (
        event
      ) {
        event.stopPropagation();
      });
      this.videoElements.speedOption.addEventListener(
        "click",
        this.openSpeedMenu.bind(this)
      );
      this.videoElements.speedMenu.addEventListener(
        "click",
        this.changeSpeed.bind(this)
      );
      this.videoElements.repeatOption.addEventListener(
        "click",
        this.toggleRepeat.bind(this)
      );
    },
    startDraggingVolumeHandle: function () {
      addClass(this.videoElements.soundVolumeHandle, "draggingVolumeHandle");
    },
    draggingVolumeHandle: function (event) {
      if (
        hasClass(this.videoElements.soundVolumeHandle, "draggingVolumeHandle")
      ) {
        this.changeVolume(event);
      }
    },
    endDraggingVolumeHandle: function () {
      if (
        hasClass(this.videoElements.soundVolumeHandle, "draggingVolumeHandle")
      ) {
        removeClass(
          this.videoElements.soundVolumeHandle,
          "draggingVolumeHandle"
        );
      }
    },
    startDraggingPlayHandle: function () {
      addClass(this.videoElements.playProgressHandle, "draggingPlayHandle");
    },
    draggingPlayHandle: function (event) {
      if (
        hasClass(this.videoElements.playProgressHandle, "draggingPlayHandle")
      ) {
        this.changeCurrentTime(event);
      }
    },
    endDraggingPlayHandle: function () {
      if (
        hasClass(this.videoElements.playProgressHandle, "draggingPlayHandle")
      ) {
        removeClass(
          this.videoElements.playProgressHandle,
          "draggingPlayHandle"
        );
      }
    },
    setKeyboardEvents: function (event) {
      if (
        this.options.keyboard &&
        hasClass(this.videoElements.wrapperVideo, "active-p")
      ) {
        if (event.keyCode == 32 || event.which == 32) {
          this.videoPlayPause();
          event.preventDefault();
        } else if (event.keyCode == 39 || event.which == 39) {
          // right    //current time next
          var newTime = this.el.currentTime + 15;
          this.el.currentTime =
            newTime > this.el.duration ? this.el.duration : newTime;
          event.preventDefault();
        } else if (event.keyCode == 37 || event.which == 37) {
          // left    //current time prev
          var newTime = this.el.currentTime - 15;
          this.el.currentTime = newTime < 0 ? 0 : newTime;
          event.preventDefault();
        } else if (event.keyCode == 38 || event.which == 38) {
          // up       //volume up
          var newVolume = this.el.volume + 0.1;
          this.el.volume = newVolume > 1 ? 1 : newVolume;
          this.showVolume();
          if (this.el.muted) {
            this.el.muted = false;
            removeClass(this.videoElements.volumePanel, "mute");
          }
          event.preventDefault();
        } else if (event.keyCode == 40 || event.which == 40) {
          // down     //volume down
          var newVolume = this.el.volume - 0.1;
          this.el.volume = newVolume < 0 ? 0 : newVolume;
          this.showVolume();
          if (this.el.muted) {
            this.el.muted = false;
            removeClass(this.videoElements.volumePanel, "mute");
          }
          event.preventDefault();
        } else if (event.keyCode == 77 || event.which == 77) {
          // m //mute
          this.toggleMute.call(this);
          event.preventDefault();
        } else if (event.keyCode == 70 || event.which == 70) {
          // m //fullscreen
          this.switchFullscreen();
          event.preventDefault();
        }
      }
    },
    toggleMute: function () {
      if (this.el.muted) {
        this.el.muted = false;
        removeClass(this.videoElements.volumePanel, "mute");
      } else {
        this.el.muted = true;
        addClass(this.videoElements.volumePanel, "mute");
      }
      this.showVolume();
    },
    videoPlayPause: function () {
      if (this.el.paused) {
        this.el.play();
      } else {
        this.el.pause();
      }
      this.closeSettingsMenu();
      this.closeSpeedMenu();
    },
    _playVideo: function () {
      this.videoElements.btnPlayPause.innerHTML = this.options.pauseBtnHTML;
      addClass(this.videoElements.wrapperVideo, "play");
      this.showProgress();
    },
    _pauseVideo: function () {
      this.videoElements.btnPlayPause.innerHTML = this.options.playBtnHTML;
      removeClass(this.videoElements.wrapperVideo, "play");
      this.videoElements.loader.style.display = "none";
    },
    endedVideo: function () {
      this.videoElements.btnPlayPause.innerHTML = this.options.playBtnHTML;
      removeClass(this.videoElements.wrapperVideo, "play");
    },
    changeCurrentTime: function (event) {
      var pageX = event.pageX ? event.pageX : event.touches[0].pageX;
      var pageY = event.pageY ? event.pageY : event.touches[0].pageY;
      var pbOffset = getOffset(this.videoElements.progressBarContainer);
      var mousePos = { x: pageX - pbOffset.left, y: pageY - pbOffset.top };
      var progressBarContainerWidth = parseFloat(
        window
          .getComputedStyle(this.videoElements.progressBarContainer, null)
          .getPropertyValue("width")
      );
      this.el.currentTime =
        (mousePos.x / progressBarContainerWidth) * this.el.duration;
      this.showProgress();
    },
    showProgress: function () {
      var playProgressWidth =
        (this.el.currentTime / this.el.duration) * 100 + "%";
      this.videoElements.playProgress.style.width = playProgressWidth;
      this.videoElements.timeDisplay.innerHTML =
        seconds_2_hms(this.el.currentTime) +
        " / " +
        seconds_2_hms(this.el.duration);

      this.showBufferedProgress();
    },
    showBufferedProgress: function () {
      if (this.el.duration > 0) {
        for (var i = 0; i < this.el.buffered.length; i++) {
          if (
            this.el.buffered.start(this.el.buffered.length - 1 - i) <
            this.el.currentTime
          ) {
            this.videoElements.bufferedProgress.style.width =
              (this.el.buffered.end(this.el.buffered.length - 1 - i) /
                this.el.duration) *
              100 +
              "%";
            break;
          }
        }
      }
    },
    showHoverProgress: function (event) {
      var pageX = event.pageX ? event.pageX : event.touches[0].pageX;
      var pageY = event.pageY ? event.pageY : event.touches[0].pageY;
      var pbOffset = getOffset(this.videoElements.progressBarContainer);
      var mousePos = { x: pageX - pbOffset.left, y: pageY - pbOffset.top };
      var progressBarContainerWidth = parseFloat(
        window
          .getComputedStyle(this.videoElements.progressBarContainer, null)
          .getPropertyValue("width")
      );
      this.videoElements.hoverProgress.style.width =
        (mousePos.x / progressBarContainerWidth) * 100 + "%";
    },
    hideHoverProgress: function () {
      this.videoElements.hoverProgress.style.width = 0;
    },
    toggleHoverVideo: function () {
      if (this.hoverInterval) {
        clearInterval(this.hoverInterval);
      }
      addClass(this.videoElements.wrapperVideo, "hover");
      this.showProgress();
      this.hoverInterval = setTimeout(
        function () {
          removeClass(this.videoElements.wrapperVideo, "hover");
        }.bind(this),
        900
      );
    },
    setActiveVideo: function (event) {
      var activeVideos = document.querySelector(
        ".kwg-video-player-container.active-p"
      );
      if (activeVideos) {
        removeClass(activeVideos, "active-p");
      }

      addClass(this.videoElements.wrapperVideo, "active-p");
      event.stopPropagation();
    },
    unsetActiveVideo: function () {
      removeClass(this.videoElements.wrapperVideo, "active-p");
    },
    showVolume: function () {
      var cVol = this.el.volume * 100;
      this.videoElements.soundVolume.style.width = cVol + "%";
      var classVolumeLevel;

      if (cVol == 0) {
        classVolumeLevel = "level0";
      } else if (cVol <= 25) {
        classVolumeLevel = "level1";
      } else if (cVol <= 50) {
        classVolumeLevel = "level2";
      } else if (cVol <= 75) {
        classVolumeLevel = "level3";
      } else if (cVol <= 100) {
        classVolumeLevel = "level4";
      }

      removeClass(this.videoElements.volumePanel, "level0");
      removeClass(this.videoElements.volumePanel, "level1");
      removeClass(this.videoElements.volumePanel, "level2");
      removeClass(this.videoElements.volumePanel, "level3");
      removeClass(this.videoElements.volumePanel, "level4");
      addClass(this.videoElements.volumePanel, classVolumeLevel);
    },
    changeVolume: function (event) {
      var pageX = event.pageX ? event.pageX : event.touches[0].pageX;
      var pageY = event.pageY ? event.pageY : event.touches[0].pageY;
      var vsOffset = getOffset(this.videoElements.volumeSlider);
      var mousePos = { x: pageX - vsOffset.left, y: pageY - vsOffset.top };
      var volumeSliderWidth = parseFloat(
        window
          .getComputedStyle(this.videoElements.volumeSlider, null)
          .getPropertyValue("width")
      );
      var volume = mousePos.x / volumeSliderWidth;
      if (volume < 0) {
        volume = 0;
      } else if (volume > 1) {
        volume = 1;
      }
      this.el.volume = volume;
      this.showVolume();
      if (this.el.muted) {
        this.el.muted = false;
        removeClass(this.videoElements.volumePanel, "mute");
      }
    },
    showHoverVolume: function (event) {
      var pageX = event.pageX ? event.pageX : event.touches[0].pageX;
      var pageY = event.pageY ? event.pageY : event.touches[0].pageY;
      var vsOffset = getOffset(this.videoElements.volumeSlider);
      var mousePos = { x: pageX - vsOffset.left, y: pageY - vsOffset.top };
      var volumeSliderWidth = parseFloat(
        window
          .getComputedStyle(this.videoElements.volumeSlider, null)
          .getPropertyValue("width")
      );
      this.videoElements.soundHover.style.width =
        (mousePos.x / volumeSliderWidth) * 100 + "%";
    },
    hideHoverVolume: function () {
      this.videoElements.soundHover.style.width = 0;
    },
    toggleSettingsMenu: function () {
      if (hasClass(this.videoElements.settingsMenu, "open")) {
        removeClass(this.videoElements.settingsMenu, "open");
      } else {
        addClass(this.videoElements.settingsMenu, "open");
      }
      this.closeSpeedMenu();
    },
    closeSettingsMenu: function () {
      if (hasClass(this.videoElements.settingsMenu, "open")) {
        removeClass(this.videoElements.settingsMenu, "open");
      }
    },
    openSpeedMenu: function () {
      addClass(this.videoElements.speedMenu, "open");
    },
    closeSpeedMenu: function () {
      if (hasClass(this.videoElements.speedMenu, "open")) {
        removeClass(this.videoElements.speedMenu, "open");
      }
    },
    changeSpeed: function (event) {
      if (event.target.tagName != "LI") {
        return;
      }
      if (!hasClass(event.target, "back")) {
        var speedLis = this.videoElements.speedMenu.children;
        var speedLislength = speedLis.length;
        for (var i = 0; i < speedLislength; i++) {
          if (hasClass(speedLis[i], "active")) {
            removeClass(speedLis[i], "active");
            break;
          }
        }
        this.el.playbackRate = event.target.getAttribute("data-speed");
        addClass(event.target, "active");
        this.setSpeedLabel();
      }
      this.closeSpeedMenu();
    },
    setSpeedLabel: function () {
      var speedLis = this.videoElements.speedMenu.children;
      var speedLislength = speedLis.length;
      for (var i = 0; i < speedLislength; i++) {
        if (this.el.playbackRate == speedLis[i].getAttribute("data-speed")) {
          this.videoElements.speedOption.getElementsByClassName(
            "item-content"
          )[0].innerHTML = speedLis[i].innerHTML;
          addClass(speedLis[i], "active");
          break;
        }
      }
    },
    toggleRepeat: function () {
      this.el.loop = !this.el.loop;
      this.setRepeatMark();
      setTimeout(
        function () {
          this.closeSettingsMenu();
        }.bind(this),
        250
      );
    },
    setRepeatMark: function () {
      if (this.el.loop) {
        this.videoElements.repeatOption.getElementsByClassName(
          "item-content"
        )[0].innerHTML = "&checkmark;";
      } else {
        this.videoElements.repeatOption.getElementsByClassName(
          "item-content"
        )[0].innerHTML = "";
      }
    },
    switchFullscreen: function () {
      if (!isFullscreenEnabled()) {
        return false;
      }
      if (!hasClass(this.videoElements.wrapperVideo, "activated-fullscreen")) {
        addClass(document.body, "kwg-video-fullscreen");
        addClass(this.videoElements.wrapperVideo, "activated-fullscreen");
        addClass(this.videoElements.wrapperVideo, "fullscreen");
      }
      handleFullscreen();
    },
    showLoader: function () {
      this.videoElements.loader.style.display = "block";
    },
    hideLoader: function () {
      this.videoElements.loader.style.display = "none";
    }
  };

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  function seconds_2_hms(totalSeconds) {
    var hours, minutes, seconds, time;

    hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    minutes = Math.floor(totalSeconds / 60);
    seconds = Math.floor(totalSeconds % 60);
    if (seconds.toString().length == 1) {
      seconds = "0" + seconds + "";
    }
    if (isNaN(minutes)) {
      minutes = "";
    }
    if (isNaN(seconds)) {
      seconds = "";
    }
    time = (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;

    return time;
  }
  function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  function isFullScreen() {
    return !!(
      document.fullScreen ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.fullscreenElement
    );
  }
  function handleFullscreen(el) {
    var videoContainer = el || document.documentElement;
    if (isFullScreen()) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen)
        document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    } else {
      if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      else if (videoContainer.mozRequestFullScreen)
        videoContainer.mozRequestFullScreen();
      else if (videoContainer.webkitRequestFullScreen)
        videoContainer.webkitRequestFullScreen();
      else if (videoContainer.msRequestFullscreen)
        videoContainer.msRequestFullscreen();
    }
  }
  function removeFullscreenData() {
    if (!isFullScreen()) {
      var fullScreenEl = document.querySelector(
        ".fullscreen.kwg-video-player-container"
      );
      if (fullScreenEl !== null) {
        if (hasClass(fullScreenEl, "activated-fullscreen")) {
          removeClass(fullScreenEl, "activated-fullscreen");
          removeClass(document.body, "kwg-video-fullscreen");
          removeClass(fullScreenEl, "fullscreen");
        }
      }
    }
  }
  function isFullscreenEnabled() {
    return !!(
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled ||
      document.webkitSupportsFullscreen ||
      document.webkitFullscreenEnabled ||
      document.createElement("video").webkitRequestFullScreen
    );
  }
  function addClass(el, className) {
    var arrayClasses;
    className = className.trim();

    arrayClasses = el.className.split(" ");
    arrayClasses.push(className);
    arrayClasses = arrayClasses.filter(function (value, index) {
      return arrayClasses.indexOf(value) == index && value != "";
    });
    el.className = arrayClasses.join(" ");
  }
  function removeClass(el, className) {
    var arrayClasses;
    className = className.trim();

    arrayClasses = el.className.split(" ");
    arrayClasses = arrayClasses.filter(function (value, index) {
      return arrayClasses.indexOf(value) == index && value != "";
    });
    var index = arrayClasses.indexOf(className);
    if (index > -1) {
      arrayClasses.splice(index, 1);
    }

    el.className = arrayClasses.join(" ");
  }
  function hasClass(el, className) {
    var arrayClasses;
    className = className.trim();
    arrayClasses = el.className.split(" ");
    arrayClasses = arrayClasses.filter(function (value, index) {
      return arrayClasses.indexOf(value) == index && value != "";
    });
    if (arrayClasses.indexOf(className) > -1) {
      return true;
    }
    return false;
  }
  document.addEventListener("fullscreenchange", function () {
    removeFullscreenData();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    removeFullscreenData();
  });
  document.addEventListener("mozfullscreenchange", function () {
    removeFullscreenData();
  });
  document.addEventListener("msfullscreenchange", function () {
    removeFullscreenData();
  });
  document.addEventListener("MSFullscreenChange", function () {
    removeFullscreenData();
  });

  window.Video = Video;
})(document, window);
