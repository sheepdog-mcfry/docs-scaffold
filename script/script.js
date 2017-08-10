/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__search__ = __webpack_require__(1);


document.addEventListener("DOMContentLoaded", function(event) {
    initBarba();
    Object(__WEBPACK_IMPORTED_MODULE_0__search__["b" /* initSearch */])();
});

function initBarba() {
    Barba.Pjax.start();
    Barba.Prefetch.init();
    Barba.Dispatcher.on("newPageReady", function(currentStatus, oldStatus, container) {
        delete window.pageReady;
        Object(__WEBPACK_IMPORTED_MODULE_0__search__["a" /* hideSearchResults */])();

        const js = container.querySelector("script");
        if (js === null) {
            return;
        }

        // eslint-disable-next-line no-eval
        eval(js.innerHTML);

        if (typeof pageReady === "function") {
            pageReady(container);
        }
    });

    if (typeof pageReady === "function") {
        pageReady(document);
    }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return initSearch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return hideSearchResults; });
let searchIndex = null;
let searchFiles = null;

function initSearch() {
    loadSearchIndex();
    initHandlers();
}

function initHandlers() {
    // search close button
    document.getElementById("docs-search__close").addEventListener("click", function(e) {
        e.preventDefault();
        hideSearchResults();
        clearSearchBox();
    });

    // search on input change
    document.getElementById("docs-search-box").addEventListener("input", function(e) {
        search(document.getElementById("docs-search-box").value);
    });

    // search on enter
    document.getElementById("docs-search-box").addEventListener("keydown", function(e) {
        const charCode = e.which || e.keyCode;
        const key = e.key;

        if (key === "Enter" || charCode === "13") {
            search(document.getElementById("docs-search-box").value);
        }
    });

    // hide search results on esc key
    document.addEventListener("keydown", function(e) {
        const charCode = e.which || e.keyCode;
        const key = e.key;

        if (key === "Escape" || charCode === "27") {
            hideSearchResults();
            clearSearchBox();
        }
    });

    // hide search results on click outside
    document.addEventListener("click", function(e) {
        if (e.path.includes(document.getElementById("docs-search"))) {
            return;
        }
        if (e.path.includes(document.getElementById("docs-search-box"))) {
            return;
        }
        hideSearchResults();
    });
}


function loadSearchIndex() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const index = JSON.parse(this.responseText);
            searchIndex = lunr.Index.load(index);
            searchFiles = index.files;
        }
    };
    xhttp.open("GET", document.getElementById("searchIndex").getAttribute("href"), true);
    xhttp.send();
}

function search(text) {
    if (searchIndex === null || text === "") {
        hideSearchResults();
        return;
    }

    const results = searchIndex.search(text);
    document.getElementById("docs-search__results").innerHTML = "";

    if (results.length < 1) {
        const result = document.createElement("li");
        result.innerHTML = "<h2>No matches found</h2>";
        document.getElementById("docs-search__results").appendChild(result);
    }

    let i = 1;
    for (const key in results) {
        i++;
        const result = document.createElement("li");
        result.className = "docs-search__result";

        const resultLink = document.createElement("a");
        resultLink.setAttribute("href", results[key].ref);
        resultLink.setAttribute("tabindex", i);
        resultLink.innerHTML = searchFiles[results[key].ref].title;
        result.appendChild(resultLink);

        const details = document.createElement("p");
        details.className = "docs-search__details";

        for (const match in results[key].matchData.metadata) {
            if (details.innerHTML.length < 1) {
                if (results[key].matchData.metadata[match].plaintext) {
                    details.innerHTML += getPreviewAtPos(results[key].matchData.metadata[match].plaintext.position[0][0], searchFiles[results[key].ref].plaintext);
                } else {
                    details.innerHTML += getPreviewAtPos(0, searchFiles[results[key].ref].plaintext);
                }
            }
        }

        result.appendChild(details);
        document.getElementById("docs-search__results").appendChild(result);
    }
    showSearchResults();
}

function showSearchResults() {
    document.getElementById("docs-search").style.display = "block";
    document.getElementById("docs-search__close").style.opacity = "1";
    document.getElementById("docs-search__close").style.pointerEvents = "auto";
}

function hideSearchResults() {
    document.getElementById("docs-search").style.display = "none";
    document.getElementById("docs-search__close").style.opacity = "0";
    document.getElementById("docs-search__close").style.pointerEvents = "none";
}

function clearSearchBox() {
    document.getElementById("docs-search-box").value = "";
}

function getPreviewAtPos(target, str) {
    let pos = 0;
    let sentence = "";
    let sentenceNum = 0;

    const sentences = str.split(/\r\n|\r|\n|[.|!|?]\s/gi);
    for (let i = 0; i < sentences.length; i++) {
        if (sentences[i] === "") {
            sentences.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < sentences.length; i++) {
        pos += sentences[i].length + 1;
        if (pos >= target) {
            sentence += sentences[i] + ".";
            sentenceNum = i;
            break;
        }
    }

    if (sentence.length < 120 && sentenceNum + 1 in sentences) {
        sentence += " " + sentences[sentenceNum + 1] + ".";
    }

    if (sentence.length < 120 && sentenceNum - 1 in sentences) {
        sentence = sentences[sentenceNum - 1] + ". " + sentence;
    }

    return sentence;
}





/***/ })
/******/ ]);