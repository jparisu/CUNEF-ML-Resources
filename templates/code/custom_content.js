// Get the current slide
function getCurrentSlide() {
    result = document.querySelector('section.slide.present');
    if (!result) {
        result = document.querySelector('section.present');
    }
    return result;
}

// Get the current chapter title
function getCurrentChapter() {
    result = document.querySelector('section.stack.present');
    if (!result) {
        result = document.querySelector('.present');
    }
    return result;
}

// Checks if we are currently in a title slide
function isTitleSlide(slide) {
    return slide.querySelector('h1') !== null;
}

// Get the current chapter title
function getCurrentChapterTitle(chap) {
    const h1 = chap.querySelector('h1');
    return h1 ? h1.textContent : '.';
}

// Function to get the document title
function getDocumentTitle() {
    return document.title;
}

// Function to get the document subtitle
function getDocumentSubtitle() {
    const subtitleElement = document.getElementsByClassName("subtitle")[0];
    return subtitleElement ? subtitleElement.textContent : "";
}

// Function to update the footer with the current chapter, title, and subtitle
function updateFooter(text) {
    const footer = document.querySelector('div.footer p');
    if (footer) {
        footer.innerHTML = text;
    }
}

// Main function to add custom footer
function addCustomFooterDynamic() {
    const slide = getCurrentSlide();
    const chap = getCurrentChapter();

    const title = getDocumentTitle();
    const subtitle = getDocumentSubtitle();
    const currentChapter = getCurrentChapterTitle(chap);

    if (isTitleSlide(slide)) {
        updateFooter(title + " - " + subtitle);
    } else {
        updateFooter(currentChapter);
    }
}

function addCustomFooter() {
    const title = getDocumentTitle();
    const subtitle = getDocumentSubtitle();

    // Check if the footer has already changed
    const footer = document.querySelector('div.footer p');

    if (footer && footer.textContent.includes(subtitle)) {
        return;
    } else if (footer) {
        updateFooter(footer.textContent + " - " + title + " - " + subtitle);
    } else {
        updateFooter(title + " - " + subtitle);
    }

}


////////////////////////////////////////////////////////////////////////////////

// Creates a div to the ToC in the body
function createTocDiv() {
    const tocDiv = document.createElement('div');
    tocDiv.className = 'dynamic-toc';
    tocDiv.id = 'dynamic-toc';

    const mainTocDiv = document.createElement('div');
    mainTocDiv.className = 'dynamic-toc main-toc';
    mainTocDiv.id = 'main-toc';
    tocDiv.appendChild(mainTocDiv);

    const subTocDiv = document.createElement('div');
    subTocDiv.className = 'dynamic-toc sub-toc';
    subTocDiv.id = 'sub-toc';
    tocDiv.appendChild(subTocDiv);

    document.querySelector('div.reveal.slide').appendChild(tocDiv);
}

// Get all level 1 headers (h1 elements) from the slides
function getChapterTitles() {
    let titles = [];
    document.querySelectorAll('.reveal .slides section.title-slide').forEach((slide) => {
        let h1 = slide.querySelector('h1');
        if (h1) {
            titles.push(h1.innerText);
        }
    });
    return titles;
}

// Update the ToC with the titles of the chapters
function populateMainToC () {
    const chapterTitles = getChapterTitles();
    let tocDiv = document.getElementById('main-toc');

    // Create and append each title to the ToC
    chapterTitles.forEach(title => {
        const titleElement = document.createElement('div');
        titleElement.className = 'toc-main-title toc-div';
        titleElement.innerText = title;
        tocDiv.appendChild(titleElement);
    });
}

function updateDynamicToC () {
    const current_chapter = getCurrentChapter();
    const current_chapter_title = getCurrentChapterTitle(current_chapter);

    document.querySelectorAll('.toc-div').forEach((titleElement) => {
        if (titleElement.textContent == current_chapter_title) {
            titleElement.classList.add('toc-highlight');
        } else {
            titleElement.classList.remove('toc-highlight');
        }
    });
}


// Function to toggle the visibility of the ToC
function toggleToC() {
    document.querySelectorAll('.dynamic-toc').forEach((toc) => {
        if (toc.style.display === 'none' || toc.style.display === '') {
            toc.style.display = 'flex';
        } else {
            toc.style.display = 'none';
        }
    });
}

////////////////////////////////////////////////////////////////////////////////

function forceInheritedTags() {
    document.querySelectorAll('.reveal section.stack').forEach((section) => {

        // Get first section, as it is the title
        const title = section.querySelector('section.title-slide');

        // If there is no title, skip
        if (!title) {
            return;
        }

        // Find every class of title that starts with inh_
        const inhClasses = title.className.split(' ').filter(c => c.startsWith('inh_'));

        // If there are inh_ values, add them to every section forward
        section.querySelectorAll('section').forEach((subSection) => {
            inhClasses.forEach(c => subSection.classList.add(c));
        });
    });
}

////////////////////////////////////////////////////////////////////////////////

// Reformat event when loading the page
window.addEventListener("load", (event) => {
    addCustomFooter();
    updateDynamicToC();
});

// Reformat event when changing slides
Reveal.on('slidechanged', function(event) {
    addCustomFooter();
    updateDynamicToC();
});

// Reformat event when loading the first time
document.addEventListener('DOMContentLoaded', (event) => {
    createTocDiv();
    populateMainToC();
    forceInheritedTags();
});

// Reformat event "t" key pressed
document.addEventListener('keydown', (event) => {
    if (event.key === 't' || event.key === 'T') {
        toggleToC();
    }
});
