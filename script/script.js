import { initSearch, hideSearchField, hideSearchResults } from "./search";
import { initSidebar, closeSidebar, updateNavClass } from "./sidebar";

document.addEventListener("DOMContentLoaded", function(event) {
    initBarba();
    initSearch();
    initSidebar();
});

function initBarba() {
    Barba.Pjax.start();
    Barba.Prefetch.init();
    Barba.Dispatcher.on("newPageReady", function(currentStatus, oldStatus, container) {
        updateNavClass("docs-nav-active-url");
        delete window.pageReady;
        hideSearchResults();
        hideSearchField();
        scrollToTop();
        closeSidebar();

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

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
