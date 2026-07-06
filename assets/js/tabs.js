/**
 * Configure the tabs behavior.
 */
const jekyllTabsConfiguration = {
    syncTabsWithSameLabels: false,
    activateTabFromUrl: false,
    addCopyToClipboardButton: false,
    copyToClipboardButtonHtml: '<button>Copy</button>',
};

const jekyllTabsModule = (function() {

    const removeActiveClasses = function (ulElement) {
        const liElements = ulElement.querySelectorAll('ul > li');

        Array.prototype.forEach.call(liElements, function(liElement) {
            liElement.classList.remove('active');
        });
    }

    const getChildPosition = function (element) {
        const parent = element.parentNode;

        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === element) {
                return i;
            }
        }

        throw new Error('No parent found');
    }

    const findElementsContaining = function(elementTag, text) {
        const elements = document.querySelectorAll(elementTag);
        const elementsThatContainText = [];

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            if (element.textContent.includes(text)) {
                elementsThatContainText.push(element);
            }
        }

        return elementsThatContainText;
    }

    const handleTabClicked = function(link) {
        const liTab = link.parentNode;
        const ulTab = liTab.parentNode;
        const liPositionInUl = getChildPosition(liTab);

        if (liTab.className.includes('active')) {
            return;
        }

        const tabContentId = ulTab.getAttribute('data-tab');
        const tabContentElement = document.getElementById(tabContentId);

        removeActiveClasses(ulTab);
        removeActiveClasses(tabContentElement);

        tabContentElement.querySelectorAll('ul.tab-content > li')[liPositionInUl].classList.add('active');
        liTab.classList.add('active');
    }

    const createElementFromHtml = function(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();

        return template.content.firstChild;
    }

    const copyToClipboard = function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;

            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";

            document.body.prepend(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
            } catch (error) {
                console.error(error);
            } finally {
                textArea.remove();
            }
        };
    }

    const activateTabFromUrl = function() {
        const tabsAnchor = window.location.hash.substring(1);

        if (!tabsAnchor) {
            return;
        }

        const targetedTabs = document.getElementById(tabsAnchor);

        if (!targetedTabs) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const tabIdToActivate = urlParams.get('active_tab');

        if (!tabIdToActivate) {
            return;
        }

        const tabLink = targetedTabs.querySelector('li#' + tabIdToActivate + ' > a');

        if (!tabLink) {
            return;
        }

        jekyllTabsModule.handleTabClicked(tabLink);
    }

    const updateUrlWithActiveTab = function(link) {
        const liTab = link.parentNode;
        const ulTab = liTab.parentNode;

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('active_tab', liTab.id);

        const updatedUrl = window.location.pathname + '?' + searchParams.toString() + '#' + ulTab.id;
        history.replaceState(null, '', updatedUrl);
    };

    return {
        findElementsContaining,
        handleTabClicked,
        createElementFromHtml,
        copyToClipboard,
        activateTabFromUrl,
        updateUrlWithActiveTab,
    };

})();

window.addEventListener('load', function () {
    const tabLinks = document.querySelectorAll('ul.tab > li > a');

    Array.prototype.forEach.call(tabLinks, function(link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            jekyllTabsModule.handleTabClicked(link);

            if (jekyllTabsConfiguration.activateTabFromUrl) {
                jekyllTabsModule.updateUrlWithActiveTab(link);
            }

            if (jekyllTabsConfiguration.syncTabsWithSameLabels) {
                const linksWithSameName = jekyllTabsModule.findElementsContaining('a', link.textContent);

                for(let i = 0; i < linksWithSameName.length; i++) {
                    if (linksWithSameName[i] !== link) {
                        jekyllTabsModule.handleTabClicked(linksWithSameName[i]);
                    }
                }
            }
        }, false);
    });

    if (jekyllTabsConfiguration.addCopyToClipboardButton) {
        const preElements = document.querySelectorAll('ul.tab-content > li pre');

        for(let i = 0; i < preElements.length; i++) {
            const preElement = preElements[i];
            const preParentNode = preElement.parentNode;
            const button = jekyllTabsModule.createElementFromHtml(jekyllTabsConfiguration.copyToClipboardButtonHtml);

            preParentNode.style.position = 'relative';
            button.style.position = 'absolute';
            button.style.top = '0px';
            button.style.right = '0px';

            preParentNode.appendChild(button);

            button.addEventListener('click', function () {
                jekyllTabsModule.copyToClipboard(preElement.innerText);
            });
        }
    }

    if (jekyllTabsConfiguration.activateTabFromUrl) {
        jekyllTabsModule.activateTabFromUrl();
    }
});
