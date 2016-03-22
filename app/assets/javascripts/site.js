(function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
        // Page elements to be processed
        var audioControls = document.querySelectorAll(".audio-player-controls");
        var autoshowPopup = document.querySelectorAll(".popup[data-popup-autoshow]");
        var playButtons = document.querySelectorAll("[data-play]");
        var popupCloseButtons = document.querySelectorAll("[data-popup-close]");
        var playbackEndPopups = document.querySelectorAll("audio[data-end-popup]");
        // Helper function to check if selector matces element
        var matches = function (el, selector) {
            var fn = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector;
            return fn.call(el, selector);
        };
        // Popup logic
        Array.prototype.forEach.call(autoshowPopup, function (popup) {
            popup.classList.add('is-visible');
        });
        // Play buttons
        Array.prototype.forEach.call(playButtons, function (button) {
            var audio = document.querySelector("#" + button.getAttribute("data-play"));
            button.addEventListener("click", function () {
                if (audio.paused) {
                    audio.play();
                }
                else {
                    audio.pause();
                }
            });
        });
        // Show end of chapter popup if specified
        Array.prototype.forEach.call(playbackEndPopups, function (audio) {
            var popup = document.querySelector("#" + audio.getAttribute("data-end-popup"));
            if (popup) {
                audio.addEventListener("ended", function () {
                    popup.classList.add("is-visible");
                });
            }
        });
        // Popup close buttons
        Array.prototype.forEach.call(popupCloseButtons, function (button) {
            var popup = button.parentElement;
            // Find popup element
            while (!matches(popup, ".popup") && popup) {
                popup = popup.parentElement;
            }
            if (popup) {
                button.addEventListener("click", function () {
                    popup.classList.remove("is-visible");
                });
            }
        });
        // Autoplay audio if 'autoplay' command specified in URL
        if (window.location.hash) {
            var params = window.location.hash.substr(1).split("=");
            var idx = params.indexOf("autoplay");
            var audio = null;
            if (idx >= 0 && idx < params.length - 1) {
                audio = document.querySelector("#" + params[idx + 1]);
                if (audio) {
                    audio.play();
                }
            }
        }
        // Custom audio player logic
        Array.prototype.forEach.call(audioControls, function (controls) {
            var player = document.querySelector("#" + controls.getAttribute("data-for"));
            var btnRewind = controls.querySelector(".btn-rewind");
            var btnPlay = controls.querySelector(".btn-play");
            var btnForward = controls.querySelector(".btn-forward");
            var slider = controls.querySelector(".audio-slider");
            var btnKnob = controls.querySelector(".btn-knob");
            var timer = controls.querySelector(".audio-timer");
            // Enable the custom controls
            controls.classList.add("is-enabled");
            if (player.hasAttribute("data-next-url")) {
                // When Audio plays out take user to next audio page
                player.addEventListener("ended", function () {
                    window.location.href = player.getAttribute("data-next-url");
                });
            }
            // Synchronizes play button state to the audio control
            function updatePlayButton() {
                btnPlay.classList.toggle("is-active", !player.paused);
            }
            // Updates timer text
            function updateTime() {
                var seconds = Math.floor(player.currentTime % 60);
                var minutes = Math.floor(player.currentTime / 60);
                var percent = !isNaN(player.duration) ? player.currentTime / player.duration * 100 : -1;
                timer.textContent = (minutes < 10 ? "0" : "") + minutes + (seconds < 10 ? ":0" : ":") + seconds;
                if (percent !== -1) {
                    btnKnob.style.left = percent + "%";
                }
                else {
                    slider.style.display = "none";
                }
            }
            // Updates playback position
            function seek(delta) {
                player.currentTime = player.currentTime + delta;
            }
            // Handles slider click event
            function onSliderClick(event) {
                var pixelOffset = event.clientX - slider.getBoundingClientRect().left;
                var percentOffset = pixelOffset / slider.offsetWidth;
                player.currentTime = percentOffset * player.duration;
            }
            // Play/pause click handler
            btnPlay.addEventListener('click', function () {
                if (player.paused) {
                    player.play();
                }
                else {
                    player.pause();
                }
            });
            // Bind event handlers
            btnRewind.addEventListener("click", function () { seek(-30); });
            btnForward.addEventListener("click", function () { seek(30); });
            player.addEventListener("playing", updatePlayButton);
            player.addEventListener("pause", updatePlayButton);
            player.addEventListener("timeupdate", updateTime);
            slider.addEventListener("click", onSliderClick);
            updatePlayButton();
        });
    });
}());
