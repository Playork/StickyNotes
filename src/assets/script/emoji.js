/* MIT License

Copyright (c) 2019 Playork

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.Emoji = f();
  }
})(function() {
  var define, module, exports;
  return (function() {
    function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a) return a(o, !0);
            if (i) return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw ((f.code = "MODULE_NOT_FOUND"), f);
          }
          var l = (n[o] = { exports: {} });
          t[o][0].call(
            l.exports,
            function(e) {
              var n = t[o][1][e];
              return s(n ? n : e);
            },
            l,
            l.exports,
            e,
            t,
            n,
            r
          );
        }
        return n[o].exports;
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++) s(r[o]);
      return s;
    }
    return e;
  })()(
    {
      1: [
        function(require, module, exports) {
          (function(global, factory) {
            if (typeof define === "function" && define.amd) {
              define(["module"], factory);
            } else if (typeof exports !== "undefined") {
              factory(module);
            } else {
              var mod = {
                exports: {}
              };
              factory(mod);
              global.Emoji = mod.exports;
            }
          })(this, function(module) {
            "use strict";

            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }

            var _createClass = (function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }

              return function(Constructor, protoProps, staticProps) {
                if (protoProps)
                  defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            })();

            var Emoji = (function() {
              function Emoji() {
                _classCallCheck(this, Emoji);

                this.initiate();
              }

              _createClass(Emoji, [
                {
                  key: "initiate",
                  value: function initiate() {
                    var _this = this;

                    var emojiInputs = document.querySelectorAll(
                      '[data-meteor-emoji="true"], [data-meteor-emoji-large="true"]'
                    );

                    emojiInputs.forEach(function(element) {
                      _this.generateElements(element);
                    });
                  }
                },
                {
                  key: "generateElements",
                  value: function generateElements(emojiInput) {
                    var clickLink = function clickLink(event) {
                      document.querySelector(
                        ".ql-snow .ql-editor p"
                      ).innerHTML += event.target.innerHTML;
                    };

                    var clickCategory = function clickCategory(event) {
                      var caretPos = emojiInput.selectionStart;

                      emojiPicker.style.display = "block";

                      var hideUls = emojiPicker.querySelectorAll("ul"),
                        i = 1,
                        l = hideUls.length;

                      for (i; i < l; i++) {
                        hideUls[i].style.display = "none";
                      }

                      var backgroundToggle = emojiPicker.querySelectorAll(
                        ".category a"
                      );

                      (i = 0), (l = backgroundToggle.length);

                      for (i; i < l; i++) {
                        backgroundToggle[i].style.background = "none";
                      }

                      emojiPicker.querySelector(
                        "." + event.target.id
                      ).style.display = "block";
                      emojiPicker.querySelector(
                        "#" + event.target.id
                      ).style.background = "#333333";
                    };

                    emojiInput.style.width = "100%";

                    var emojiContainer = document.createElement("div");
                    emojiContainer.style.position = "relative";

                    var parent = emojiInput.parentNode;
                    parent.replaceChild(emojiContainer, emojiInput);
                    emojiContainer.appendChild(emojiInput);

                    var emojiPicker = document.createElement("div");
                    emojiPicker.tabIndex = 0;

                    if (emojiInput.hasAttribute("data-meteor-emoji-large")) {
                      emojiPicker.style.zIndex = "999";
                      emojiPicker.style.display = "block";
                      emojiPicker.style.width = "100%";
                      emojiPicker.style.marginBottom = "15px";
                    } else {
                      emojiPicker.style.position = "absolute";
                      emojiPicker.style.right = "0px";
                      emojiPicker.style.top = "30px";
                      emojiPicker.style.display = "none";
                      emojiPicker.style.width = "350px";
                    }
                    emojiPicker.style.zIndex = "999";
                    emojiPicker.style.overflow = "hidden";
                    emojiPicker.style.background = "#202020";
                    emojiPicker.style.borderRadius = "5px";
                    emojiPicker.style.boxShadow =
                      "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
                    emojiPicker.style.borderRadius = "2px;";
                    emojiPicker.style.marginTop = "5px";
                    emojiPicker.style.outline = "none";

                    var emojiTrigger = document.createElement("a");
                    emojiTrigger.style.position = "absolute";
                    emojiTrigger.style.top = "10px";
                    emojiTrigger.style.right = "10px";
                    emojiTrigger.style.textDecoration = "none";
                    emojiTrigger.setAttribute("href", "javascript:void(0)");
                    emojiTrigger.setAttribute("id", "emoji");

                    emojiTrigger.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 14"><path d="M8.9 8.4q-0.3 0.9-1.1 1.5t-1.8 0.6-1.8-0.6-1.1-1.5q-0.1-0.2 0-0.4t0.3-0.2q0.2-0.1 0.4 0t0.2 0.3q0.2 0.6 0.7 1t1.2 0.4 1.2-0.4 0.7-1q0.1-0.2 0.3-0.3t0.4 0 0.3 0.2 0 0.4zM5 5q0 0.4-0.3 0.7t-0.7 0.3-0.7-0.3-0.3-0.7 0.3-0.7 0.7-0.3 0.7 0.3 0.3 0.7zM9 5q0 0.4-0.3 0.7t-0.7 0.3-0.7-0.3-0.3-0.7 0.3-0.7 0.7-0.3 0.7 0.3 0.3 0.7zM11 7q0-1-0.4-1.9t-1.1-1.6-1.6-1.1-1.9-0.4-1.9 0.4-1.6 1.1-1.1 1.6-0.4 1.9 0.4 1.9 1.1 1.6 1.6 1.1 1.9 0.4 1.9-0.4 1.6-1.1 1.1-1.6 0.4-1.9zM12 7q0 1.6-0.8 3t-2.2 2.2-3 0.8-3-0.8-2.2-2.2-0.8-3 0.8-3 2.2-2.2 3-0.8 3 0.8 2.2 2.2 0.8 3z"/></svg>';
                    emojiTrigger.onclick = function() {
                      if (emojiPicker.style.display === "none") {
                        emojiPicker.style.display = "block";
                      } else if (emojiPicker.style.display === "block") {
                        emojiPicker.style.display = "none";
                      }
                      emojiPicker.focus();
                    };

                    if (!emojiInput.hasAttribute("data-meteor-emoji-large")) {
                      emojiContainer.appendChild(emojiTrigger);
                    }

                    window.addEventListener("click", function(e) {
                      if (!emojiInput.hasAttribute("data-meteor-emoji-large")) {
                        if (emojiPicker.style.display === "block") {
                          if (
                            emojiPicker.contains(e.target) ||
                            emojiTrigger.contains(e.target)
                          ) {
                          } else {
                            emojiPicker.style.display = "none";
                          }
                        }
                      }
                    });

                    var facesCategory = document.createElement("ul");
                    facesCategory.style.padding = "10px 0px";
                    facesCategory.style.margin = "0";
                    facesCategory.style.listStyle = "none";
                    facesCategory.style.textAlign = "left";
                    facesCategory.style.marginLeft = "3%";
                    facesCategory.classList.add("faces");

                    var animalsCategory = document.createElement("ul");
                    animalsCategory.style.padding = "10px 0px";
                    animalsCategory.style.margin = "0";
                    animalsCategory.style.listStyle = "none";
                    animalsCategory.style.textAlign = "left";
                    animalsCategory.style.marginLeft = "3%";
                    animalsCategory.classList.add("animals");
                    animalsCategory.style.display = "none";

                    var foodCategory = document.createElement("ul");
                    foodCategory.style.padding = "10px 0px";
                    foodCategory.style.margin = "0";
                    foodCategory.style.listStyle = "none";
                    foodCategory.style.textAlign = "left";
                    foodCategory.style.marginLeft = "3%";
                    foodCategory.classList.add("food");
                    foodCategory.style.display = "none";

                    var sportCategory = document.createElement("ul");
                    sportCategory.style.padding = "10px 0px";
                    sportCategory.style.margin = "0";
                    sportCategory.style.listStyle = "none";
                    sportCategory.style.textAlign = "left";
                    sportCategory.style.marginLeft = "3%";
                    sportCategory.classList.add("sport");
                    sportCategory.style.display = "none";

                    var transportCategory = document.createElement("ul");
                    transportCategory.style.padding = "10px 0px";
                    transportCategory.style.margin = "0";
                    transportCategory.style.listStyle = "none";
                    transportCategory.style.textAlign = "left";
                    transportCategory.style.marginLeft = "3%";
                    transportCategory.classList.add("transport");
                    transportCategory.style.display = "none";

                    var objectsCategory = document.createElement("ul");
                    objectsCategory.style.padding = "10px 0px";
                    objectsCategory.style.margin = "0";
                    objectsCategory.style.listStyle = "none";
                    objectsCategory.style.textAlign = "left";
                    objectsCategory.style.marginLeft = "3%";
                    objectsCategory.classList.add("objects");
                    objectsCategory.style.display = "none";

                    var emojiCategory = document.createElement("ul");
                    emojiCategory.style.padding = "0px";
                    emojiCategory.style.margin = "0";
                    emojiCategory.style.display = "table";
                    emojiCategory.style.width = "100%";
                    emojiCategory.style.background = "#333333";
                    emojiCategory.style.listStyle = "none";
                    emojiCategory.classList.add("category");

                    var emojiCategories = new Array();
                    emojiCategories.push({
                      name: "faces",
                      svg:
                        '<svg id="faces" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="faces" d="M74.34,128.48a53.5,53.5,0,1,1,37.84-15.67,53.16,53.16,0,0,1-37.84,15.67Zm0-97.89a44.4,44.4,0,1,0,31.4,13,44.07,44.07,0,0,0-31.4-13Z"/><path id="faces" d="M74.35,108A33.07,33.07,0,0,1,41.29,75a2.28,2.28,0,0,1,2.27-2.28h0A2.27,2.27,0,0,1,45.83,75a28.52,28.52,0,0,0,57,0,2.27,2.27,0,0,1,4.54,0A33.09,33.09,0,0,1,74.35,108Z"/><path id="faces" d="M58.84,62a6.81,6.81,0,1,0,6.81,6.81A6.81,6.81,0,0,0,58.84,62Z"/><path id="faces" d="M89.87,62a6.81,6.81,0,1,0,6.81,6.81A6.82,6.82,0,0,0,89.87,62Z"/></svg>'
                    });
                    emojiCategories.push({
                      name: "animals",
                      svg:
                        '<svg id="animals" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="animals" d="M59.9,91.75h0c-22.46,0-41.82-19.34-44.09-44A52.1,52.1,0,0,1,16,36.8a4.51,4.51,0,0,1,2.63-3.62,39.79,39.79,0,0,1,12.74-3.37c23.92-2.15,45.35,17.83,47.74,43.86a52.77,52.77,0,0,1-.15,10.93,4.56,4.56,0,0,1-2.64,3.62,39.67,39.67,0,0,1-12.73,3.36c-1.23.11-2.45.17-3.66.17ZM24.76,40.49a41.29,41.29,0,0,0,.09,6.4C26.7,67,42.09,82.66,59.9,82.67h0c.94,0,1.88,0,2.83-.14a30.39,30.39,0,0,0,7.41-1.62,41.14,41.14,0,0,0-.11-6.4C68.09,53.38,51.11,37.08,32.17,38.86a30.78,30.78,0,0,0-7.41,1.63Z"/><path id="animals" d="M36.68,125.64a4.53,4.53,0,0,1-4.33-3.17,53.32,53.32,0,0,1-2.26-11A50.42,50.42,0,0,1,39.51,76.6c7.35-9.91,17.84-16,29.5-17,1.16-.11,2.33-.13,3.47-.13a4.54,4.54,0,0,1,4.33,3.16,51.59,51.59,0,0,1,2.27,11.08,50.39,50.39,0,0,1-9.42,34.8c-7.35,9.91-17.83,16-29.5,17a17.63,17.63,0,0,1-3.48.12ZM69.09,68.69A32.41,32.41,0,0,0,46.8,82a42.57,42.57,0,0,0-6.71,34.38,32.38,32.38,0,0,0,22.28-13.32A41.35,41.35,0,0,0,70,74.51a39.38,39.38,0,0,0-.94-5.82Z"/><path id="animals" d="M90.27,91.75c-1.22,0-2.43-.06-3.66-.17a39.67,39.67,0,0,1-12.73-3.36,4.57,4.57,0,0,1-2.64-3.61,53.38,53.38,0,0,1-.17-10.93c2.41-26,23.7-46.07,47.76-43.87a39.74,39.74,0,0,1,12.73,3.37,4.57,4.57,0,0,1,2.64,3.62,53.35,53.35,0,0,1,.16,10.92c-2.28,24.69-21.65,44-44.09,44ZM80,80.91a30.57,30.57,0,0,0,7.42,1.62c19.07,1.78,35.92-14.53,37.87-35.64a42.55,42.55,0,0,0,.1-6.4A30.86,30.86,0,0,0,118,38.86C99,37.07,82.06,53.38,80.12,74.51a43.91,43.91,0,0,0-.1,6.4Z"/><path id="animals" d="M113.49,125.64h0c-1.16,0-2.3,0-3.46-.12-23.9-2.21-41.36-25.47-38.94-51.85A53.52,53.52,0,0,1,73.34,62.6a4.55,4.55,0,0,1,4.33-3.16c1.16,0,2.34,0,3.51.13,11.64,1.07,22.11,7.12,29.48,17a50.51,50.51,0,0,1,9.42,34.81,53.51,53.51,0,0,1-2.26,11,4.54,4.54,0,0,1-4.33,3.19ZM81.08,68.69a42.53,42.53,0,0,0-1,5.82c-1.94,21.1,11.45,39.71,29.95,41.88A42.38,42.38,0,0,0,103.36,82,32.42,32.42,0,0,0,81.08,68.69Z"/><path id="animals" d="M75.08,45.45a7.83,7.83,0,1,0,7.83,7.83,7.83,7.83,0,0,0-7.83-7.83Z"/><path id="animals" d="M76.29,51.89a2.26,2.26,0,0,1-2.14-3A46,46,0,0,1,92.82,25.34a2.27,2.27,0,1,1,2.4,3.86A41.4,41.4,0,0,0,78.43,50.39a2.28,2.28,0,0,1-2.14,1.5Z"/><path id="animals" d="M73.87,51.89a2.28,2.28,0,0,1-2.14-1.5A41.35,41.35,0,0,0,54.94,29.2a2.27,2.27,0,0,1,2.39-3.86A46,46,0,0,1,76,48.85a2.28,2.28,0,0,1-1.37,2.91,2.31,2.31,0,0,1-.77.13Z"/></svg>'
                    });
                    emojiCategories.push({
                      name: "food",
                      svg:
                        '<svg id="food" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="food" d="M104,20.76h.15c15.83.52,24.08,21.48,24.07,32.56.26,12.42-10.72,23.55-24,24.21a3.53,3.53,0,0,1-.46,0c-13.25-.66-24.23-11.8-24-24.3,0-11,8.26-31.95,24.07-32.47Zm0,47.69c8.25-.54,15.3-7.51,15.14-15,0-8.12-6.22-23.1-15.14-23.57-8.9.46-15.14,15.45-15.14,23.48-.14,7.61,6.9,14.59,15.14,15.13Z"/><path id="food" d="M97.19,69.21h.14a4.53,4.53,0,0,1,4.4,4.68l-1.48,46.92a1.59,1.59,0,0,0,.5,1.06,4.6,4.6,0,0,0,3.25,1.19h0a4.57,4.57,0,0,0,3.26-1.2,1.53,1.53,0,0,0,.49-1l-1.48-46.95a4.54,4.54,0,1,1,9.08-.28l1.47,46.91a10.42,10.42,0,0,1-3,7.65,13.65,13.65,0,0,1-9.81,4h0a13.58,13.58,0,0,1-9.79-4,10.42,10.42,0,0,1-3-7.67l1.48-46.89a4.53,4.53,0,0,1,4.53-4.4Z"/><path id="food" d="M41.84,69.21H42a4.53,4.53,0,0,1,4.4,4.68L44.9,120.81a1.57,1.57,0,0,0,.5,1.06,4.6,4.6,0,0,0,3.25,1.19h0a4.51,4.51,0,0,0,3.24-1.19,1.48,1.48,0,0,0,.5-1L50.93,73.89a4.53,4.53,0,0,1,4.39-4.68A4.4,4.4,0,0,1,60,73.61l1.48,46.91a10.49,10.49,0,0,1-3,7.66,13.57,13.57,0,0,1-9.78,4h0a13.59,13.59,0,0,1-9.78-4,10.48,10.48,0,0,1-3-7.67l1.48-46.9a4.54,4.54,0,0,1,4.54-4.4Z"/><path id="food" d="M28.59,20.76a4.54,4.54,0,0,1,4.54,4.54V51a15.52,15.52,0,0,0,31,0V25.3a4.55,4.55,0,0,1,9.09,0V51a24.61,24.61,0,1,1-49.21,0V25.3a4.54,4.54,0,0,1,4.54-4.54Z"/><path id="food" d="M55.34,20.76a4.54,4.54,0,0,1,4.54,4.54v19a4.54,4.54,0,1,1-9.08,0v-19a4.54,4.54,0,0,1,4.54-4.54Z"/><path id="food" d="M42,20.76a4.54,4.54,0,0,1,4.54,4.54v19a4.54,4.54,0,1,1-9.08,0v-19A4.54,4.54,0,0,1,42,20.76Z"/></svg>'
                    });
                    emojiCategories.push({
                      name: "sport",
                      svg:
                        '<svg id="sport" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="sport" d="M75.35,130.24a53.49,53.49,0,1,1,53.48-53.49,53.55,53.55,0,0,1-53.48,53.49Zm0-97.89a44.41,44.41,0,1,0,44.4,44.4,44.1,44.1,0,0,0-44.4-44.4Z"/><path id="sport" d="M119.24,84.08A51.29,51.29,0,0,1,68,32.86a49.44,49.44,0,0,1,.26-5,2.26,2.26,0,0,1,2-2c1.66-.16,3.34-.25,5-.25a51.26,51.26,0,0,1,51.21,51.21c0,1.71-.09,3.38-.25,5a2.28,2.28,0,0,1-2,2c-1.65.16-3.33.25-5,.25ZM72.64,30.16c-.06.9-.08,1.79-.08,2.7a46.73,46.73,0,0,0,46.68,46.68q1.37,0,2.7-.09c.06-.89.08-1.79.08-2.7A46.72,46.72,0,0,0,75.35,30.08c-.91,0-1.82,0-2.71.08Z"/><path id="sport" d="M75.35,128A51.28,51.28,0,0,1,24.12,76.76c0-1.7.1-3.38.25-5a2.29,2.29,0,0,1,2-2c1.66-.16,3.33-.25,5.05-.25a51.27,51.27,0,0,1,51.21,51.22c0,1.69-.09,3.37-.25,5a2.27,2.27,0,0,1-2,2c-1.66.16-3.32.25-5,.25ZM28.75,74.05c-.05.9-.09,1.8-.09,2.71a46.74,46.74,0,0,0,46.69,46.67c.91,0,1.8,0,2.7-.08,0-.9.08-1.8.08-2.7A46.73,46.73,0,0,0,31.46,74c-.91,0-1.81,0-2.71.08Z"/><polygon id="sport" points="42.69 112.61 39.48 109.4 108 40.88 111.21 44.1 42.69 112.61 42.69 112.61"/></svg>'
                    });
                    emojiCategories.push({
                      name: "transport",
                      svg:
                        '<svg id="transport" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="transport" d="M120.7,116H31a4.55,4.55,0,0,1-4.54-4.55V54.28A31.82,31.82,0,0,1,58.25,22.49h35.2a31.83,31.83,0,0,1,31.8,31.79v57.15A4.55,4.55,0,0,1,120.7,116Zm-85.16-9.09h80.62V54.28A22.74,22.74,0,0,0,93.45,31.57H58.25A22.74,22.74,0,0,0,35.54,54.28v52.61Z"/><path id="transport" d="M49.35,129.23c-8.53,0-13.62-2.77-13.62-7.41V115.6a4.54,4.54,0,1,1,9.08,0v4.06a21.32,21.32,0,0,0,9.09,0V115.6a4.54,4.54,0,0,1,9.08,0v6.22c0,4.64-5.09,7.41-13.63,7.41Z"/><path id="transport" d="M102.34,129.23c-8.53,0-13.62-2.77-13.62-7.41V115.6a4.54,4.54,0,0,1,9.08,0v4.06a21.28,21.28,0,0,0,9.08,0V115.6a4.55,4.55,0,0,1,9.09,0v6.22c0,4.64-5.09,7.41-13.63,7.41Z"/><path id="transport" d="M97.81,44.83H53.9a4.55,4.55,0,1,1,0-9.09H97.81a4.55,4.55,0,0,1,0,9.09Z"/><path id="transport" d="M54.28,84.2A6.8,6.8,0,1,0,61.07,91a6.8,6.8,0,0,0-6.79-6.8Z"/><path id="transport" d="M97.43,84.2a6.8,6.8,0,1,0,6.79,6.8,6.8,6.8,0,0,0-6.79-6.8Z"/><path id="transport" d="M107.08,81H44.63a6.82,6.82,0,0,1-6.82-6.82V54.28a6.82,6.82,0,0,1,6.82-6.81h62.45a6.82,6.82,0,0,1,6.81,6.81V74.15A6.83,6.83,0,0,1,107.08,81ZM44.63,52a2.28,2.28,0,0,0-2.28,2.27V74.15a2.28,2.28,0,0,0,2.28,2.27h62.45a2.27,2.27,0,0,0,2.27-2.27V54.28A2.27,2.27,0,0,0,107.08,52Z"/></svg>'
                    });
                    emojiCategories.push({
                      name: "objects",
                      svg:
                        '<svg id="objects" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="objects" d="M107.78,129a4.55,4.55,0,0,1-2.67-.87l-30-21.79-30,21.79a4.53,4.53,0,0,1-5.34,0,4.58,4.58,0,0,1-1.65-5.08L49.59,87.82,19.6,66a4.54,4.54,0,0,1,2.67-8.22H59.34L70.8,22.55a4.55,4.55,0,0,1,8.64,0L90.89,57.81H128A4.54,4.54,0,0,1,130.63,66l-30,21.79,11.46,35.25a4.55,4.55,0,0,1-4.32,6ZM75.12,96.2a4.53,4.53,0,0,1,2.67.87l21.35,15.51L91,87.49a4.55,4.55,0,0,1,1.65-5.08L114,66.89H87.59a4.54,4.54,0,0,1-4.32-3.13l-8.15-25.1L67,63.76a4.53,4.53,0,0,1-4.32,3.13H36.25L57.61,82.41a4.54,4.54,0,0,1,1.65,5.08l-8.17,25.09L72.45,97.07a4.53,4.53,0,0,1,2.67-.87Z"/></svg>'
                    });

                    var faces = [
                      0x1f601,
                      0x1f602,
                      0x1f603,
                      0x1f604,
                      0x1f605,
                      0x1f606,
                      0x1f609,
                      0x1f60a,
                      0x1f60b,
                      0x1f60c,
                      0x1f60d,
                      0x1f60f,
                      0x1f612,
                      0x1f613,
                      0x1f614,
                      0x1f616,
                      0x1f618,
                      0x1f61a,
                      0x1f61c,
                      0x1f61d,
                      0x1f61e,
                      0x1f620,
                      0x1f621,
                      0x1f622,
                      0x1f623,
                      0x1f624,
                      0x1f625,
                      0x1f628,
                      0x1f629,
                      0x1f62a,
                      0x1f62b,
                      0x1f62d,
                      0x1f630,
                      0x1f631,
                      0x1f632,
                      0x1f633,
                      0x1f635,
                      0x1f637,
                      0x1f44d,
                      0x1f44c
                    ];

                    var animals = [
                      0x1f40c,
                      0x1f40d,
                      0x1f40e,
                      0x1f411,
                      0x1f412,
                      0x1f414,
                      0x1f417,
                      0x1f418,
                      0x1f419,
                      0x1f41a,
                      0x1f41b,
                      0x1f41c,
                      0x1f41d,
                      0x1f41e,
                      0x1f41f,
                      0x1f420,
                      0x1f421,
                      0x1f422,
                      0x1f423,
                      0x1f424,
                      0x1f425,
                      0x1f426,
                      0x1f427,
                      0x1f428,
                      0x1f429,
                      0x1f42b,
                      0x1f42c,
                      0x1f42d,
                      0x1f42e,
                      0x1f42f,
                      0x1f430,
                      0x1f431,
                      0x1f432,
                      0x1f433,
                      0x1f434,
                      0x1f435,
                      0x1f436,
                      0x1f437,
                      0x1f438,
                      0x1f439,
                      0x1f43a,
                      0x1f43b,
                      0x1f43c
                    ];

                    var food = [
                      0x1f345,
                      0x1f346,
                      0x1f347,
                      0x1f348,
                      0x1f349,
                      0x1f34a,
                      0x1f34c,
                      0x1f34d,
                      0x1f34e,
                      0x1f34f,
                      0x1f351,
                      0x1f352,
                      0x1f353,
                      0x1f354,
                      0x1f355,
                      0x1f356,
                      0x1f357,
                      0x1f358,
                      0x1f35c,
                      0x1f35d,
                      0x1f35e,
                      0x1f35f,
                      0x1f360,
                      0x1f361,
                      0x1f362,
                      0x1f363,
                      0x1f364,
                      0x1f366,
                      0x1f368,
                      0x1f369,
                      0x1f36a,
                      0x1f36b,
                      0x1f36c,
                      0x1f36d,
                      0x1f370,
                      0x1f372,
                      0x1f373,
                      0x1f374,
                      0x1f377,
                      0x1f378,
                      0x1f37b
                    ];

                    var sport = [
                      0x1f3b1,
                      0x1f3b3,
                      0x1f3be,
                      0x1f3bf,
                      0x1f3c0,
                      0x1f3c1,
                      0x1f3c2,
                      0x1f3c3,
                      0x1f3c4,
                      0x1f3c6,
                      0x1f3c8,
                      0x1f3ca,
                      0x1f6a3,
                      0x1f6b4,
                      0x1f6b5,
                      0x26bd,
                      0x26be,
                      0x26fa,
                      0x1f3a3,
                      0x1f3af,
                      0x26f3
                    ];

                    var transport = [
                      0x1f681,
                      0x1f682,
                      0x1f686,
                      0x1f688,
                      0x1f68a,
                      0x1f68d,
                      0x1f68e,
                      0x1f690,
                      0x1f694,
                      0x1f696,
                      0x1f698,
                      0x1f69b,
                      0x1f69c,
                      0x1f69d,
                      0x1f69e,
                      0x1f69f,
                      0x1f6a0,
                      0x1f6a1,
                      0x1f680,
                      0x1f683,
                      0x1f684,
                      0x1f685,
                      0x1f687,
                      0x1f689,
                      0x1f68c,
                      0x1f691,
                      0x1f692,
                      0x1f693,
                      0x1f695,
                      0x1f697,
                      0x1f699,
                      0x1f69a,
                      0x1f6a2,
                      0x1f6a4,
                      0x1f6b2
                    ];

                    var objects = [
                      0x1f392,
                      0x1f388,
                      0x1f389,
                      0x1f38f,
                      0x1f393,
                      0x1f3a1,
                      0x1f3a2,
                      0x1f3a4,
                      0x1f3a5,
                      0x1f3a7,
                      0x1f3a8,
                      0x1f3ab,
                      0x1f3ac,
                      0x1f3ae,
                      0x1f3af,
                      0x1f3b6,
                      0x1f3b7,
                      0x1f3b8,
                      0x1f3b9,
                      0x1f3ba,
                      0x1f3bb,
                      0x1f3bc,
                      0x1f3e0,
                      0x1f3e5,
                      0x1f3ea,
                      0x1f493,
                      0x1f494,
                      0x1f495,
                      0x1f496,
                      0x1f497,
                      0x1f498,
                      0x1f4bb,
                      0x1f4ba,
                      0x1f4c5,
                      0x1f4d5,
                      0x1f4f7
                    ];

                    emojiCategories.map(function(item) {
                      var emojiLink = document.createElement("a");
                      emojiLink.style.textDecoration = "none";
                      emojiLink.style.padding = "5px";
                      emojiLink.style.position = "initial";
                      emojiLink.style.fontSize = "24px";
                      emojiLink.setAttribute("href", "javascript:void(0)");
                      emojiLink.style.display = "table-cell";
                      emojiLink.style.textAlign = "center";
                      emojiLink.id = String(item["name"]);

                      if (String(item["name"]) == "faces") {
                        emojiLink.style.background = "#333333";
                      }
                      emojiLink.innerHTML = String(item["svg"]);

                      emojiLink.onmousedown = clickCategory;

                      emojiCategory.appendChild(emojiLink);
                    });

                    faces.map(function(item) {
                      var emojiLink = document.createElement("a");
                      emojiLink.style.textDecoration = "none";
                      emojiLink.style.margin = "5px";
                      emojiLink.style.position = "initial";
                      emojiLink.style.fontSize = "24px";
                      emojiLink.setAttribute("href", "javascript:void(0)");
                      emojiLink.innerHTML = String.fromCodePoint(item);
                      emojiLink.onmousedown = clickLink;

                      facesCategory.appendChild(emojiLink);
                    });

                    animals.map(function(item) {
                      var emojiLink = document.createElement("a");
                      emojiLink.style.textDecoration = "none";
                      emojiLink.style.margin = "5px";
                      emojiLink.style.position = "initial";
                      emojiLink.style.fontSize = "24px";
                      emojiLink.setAttribute("href", "javascript:void(0)");
                      emojiLink.innerHTML = String.fromCodePoint(item);
                      emojiLink.onmousedown = clickLink;

                      animalsCategory.appendChild(emojiLink);
                    });

                    food.map(function(item) {
                      var emojiLink = document.createElement("a");
                      emojiLink.style.textDecoration = "none";
                      emojiLink.style.margin = "5px";
                      emojiLink.style.position = "initial";
                      emojiLink.style.fontSize = "24px";
                      emojiLink.setAttribute("href", "javascript:void(0)");
                      emojiLink.innerHTML = String.fromCodePoint(item);
                      emojiLink.onmousedown = clickLink;

                      foodCategory.appendChild(emojiLink);
                    });

                    sport.map(function(item) {
                      var emojiLink = document.createElement("a");
                      emojiLink.style.textDecoration = "none";
                      emojiLink.style.margin = "5px";
                      emojiLink.style.position = "initial";
                      emojiLink.style.fontSize = "24px";
                      emojiLink.setAttribute("href", "javascript:void(0)");
                      emojiLink.innerHTML = String.fromCodePoint(item);
                      emojiLink.onmousedown = clickLink;

                      sportCategory.appendChild(emojiLink);
                    });

                    transport.map(function(item) {
                      var emojiLink = document.createElement("a");
                      emojiLink.style.textDecoration = "none";
                      emojiLink.style.margin = "5px";
                      emojiLink.style.position = "initial";
                      emojiLink.style.fontSize = "24px";
                      emojiLink.setAttribute("href", "javascript:void(0)");
                      emojiLink.innerHTML = String.fromCodePoint(item);
                      emojiLink.onmousedown = clickLink;

                      transportCategory.appendChild(emojiLink);
                    });

                    objects.map(function(item) {
                      var emojiLi = document.createElement("li");
                      emojiLi.style.display = "inline-block";
                      emojiLi.style.margin = "5px";

                      var emojiLink = document.createElement("a");
                      emojiLink.style.textDecoration = "none";
                      emojiLink.style.margin = "5px";
                      emojiLink.style.position = "initial";
                      emojiLink.style.fontSize = "24px";
                      emojiLink.setAttribute("href", "javascript:void(0)");
                      emojiLink.innerHTML = String.fromCodePoint(item);
                      emojiLink.onmousedown = clickLink;

                      objectsCategory.appendChild(emojiLink);
                    });

                    emojiPicker.appendChild(emojiCategory);
                    emojiPicker.appendChild(facesCategory);
                    emojiPicker.appendChild(animalsCategory);
                    emojiPicker.appendChild(foodCategory);
                    emojiPicker.appendChild(sportCategory);
                    emojiPicker.appendChild(transportCategory);
                    emojiPicker.appendChild(objectsCategory);
                    emojiContainer.appendChild(emojiPicker);
                  }
                }
              ]);

              return Emoji;
            })();

            module.exports = Emoji;
          });
        },
        {}
      ]
    },
    {},
    [1]
  )(1);
});
