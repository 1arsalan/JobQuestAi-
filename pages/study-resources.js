"use strict";

import "../firebase.js";

/* =========================================================
   JOBQUESTAI — STUDY RESOURCES

   JAVASCRIPT PART 1

   Includes:
   - Application configuration
   - Application state
   - DOM references
   - Sample resource data
   - Initialization
   - Event binding
   - Resource normalization
   - Main filtering pipeline

   Firebase integration will be added later without changing
   the page UI or filtering architecture.
========================================================= */


/* =========================================================
   1. APPLICATION CONFIGURATION
========================================================= */

const RESOURCE_CONFIG = Object.freeze({

    resourcesPerPage:
        9,

    searchDelay:
        250,

    previewTimeout:
        12000,

    supportedFileTypes: [
        "pdf"
    ],

    defaultView:
        "grid",

    defaultSort:
        "latest"

});


/* =========================================================
   2. APPLICATION STATE
========================================================= */

const resourceState = {

    allResources:
        [],

    filteredResources:
        [],

    currentPage:
        1,

    resourcesPerPage:
        RESOURCE_CONFIG.resourcesPerPage,

    selectedResourceType:
        "all",

    currentView:
        RESOURCE_CONFIG.defaultView,

    currentSort:
        RESOURCE_CONFIG.defaultSort,

    loading:
        false,

    initialized:
        false,

    searchTimer:
        null,
    
    previewTimer:
        null,

    selectedPreviewResource:
        null,

    activePreviewObjectUrl:
        "",

    bookmarks:
        new Set(),

    filters: {

        search:
            "",

        mainCategory:
            "",

        educationLevel:
            "",

        programExam:
            "",

        semester:
            "",

        subject:
            "",

        year:
            "",

        language:
            ""

    }

};


/* =========================================================
   3. DOM REFERENCES
========================================================= */

const dom = {

    /* Hero search */

    heroSearchForm:
        document.getElementById(
            "heroSearchForm"
        ),

    heroSearchInput:
        document.getElementById(
            "heroSearchInput"
        ),


    /* Statistics */

    totalResourcesCount:
        document.getElementById(
            "totalResourcesCount"
        ),

    totalSubjectsCount:
        document.getElementById(
            "totalSubjectsCount"
        ),

    totalCategoriesCount:
        document.getElementById(
            "totalCategoriesCount"
        ),


    /* Resource type tabs */

    resourceTypeTabs:
        document.getElementById(
            "resourceTypeTabs"
        ),


    /* Filters */

    resourceSearchInput:
        document.getElementById(
            "resourceSearchInput"
        ),

    mainCategoryFilter:
        document.getElementById(
            "mainCategoryFilter"
        ),

    educationLevelFilter:
        document.getElementById(
            "educationLevelFilter"
        ),

    programExamFilter:
        document.getElementById(
            "programExamFilter"
        ),

    semesterFilter:
        document.getElementById(
            "semesterFilter"
        ),

    subjectFilter:
        document.getElementById(
            "subjectFilter"
        ),

    yearFilter:
        document.getElementById(
            "yearFilter"
        ),

    languageFilter:
        document.getElementById(
            "languageFilter"
        ),

    applyFiltersBtn:
        document.getElementById(
            "applyFiltersBtn"
        ),

    clearFiltersBtn:
        document.getElementById(
            "clearFiltersBtn"
        ),

    emptyStateResetBtn:
        document.getElementById(
            "emptyStateResetBtn"
        ),


    /* Mobile filters */

    openFiltersBtn:
        document.getElementById(
            "openFiltersBtn"
        ),

    closeFiltersBtn:
        document.getElementById(
            "closeFiltersBtn"
        ),

    filtersSidebar:
        document.querySelector(
            ".filters-sidebar"
        ),

    filtersOverlay:
        document.getElementById(
            "filtersOverlay"
        ),


    /* Active filters */

    activeFilters:
        document.getElementById(
            "activeFilters"
        ),

    activeFilterTags:
        document.getElementById(
            "activeFilterTags"
        ),


    /* Results */

    resultsCount:
        document.getElementById(
            "resultsCount"
        ),

    sortResources:
        document.getElementById(
            "sortResources"
        ),

    gridViewBtn:
        document.getElementById(
            "gridViewBtn"
        ),

    listViewBtn:
        document.getElementById(
            "listViewBtn"
        ),

    resourcesGrid:
        document.getElementById(
            "resourcesGrid"
        ),

    resourcesLoading:
        document.getElementById(
            "resourcesLoading"
        ),

    resourcesEmptyState:
        document.getElementById(
            "resourcesEmptyState"
        ),

    resourcesErrorState:
        document.getElementById(
            "resourcesErrorState"
        ),

    resourcesErrorMessage:
        document.getElementById(
            "resourcesErrorMessage"
        ),

    retryResourcesBtn:
        document.getElementById(
            "retryResourcesBtn"
        ),


    /* Pagination */

    resourcesPagination:
        document.getElementById(
            "resourcesPagination"
        ),

    previousPageBtn:
        document.getElementById(
            "previousPageBtn"
        ),

    nextPageBtn:
        document.getElementById(
            "nextPageBtn"
        ),

    paginationNumbers:
        document.getElementById(
            "paginationNumbers"
        ),


    /* Featured categories */

    featuredCategoryCards:
        document.querySelectorAll(
            "[data-featured-category]"
        ),


    /* Preview modal */

    resourcePreviewModal:
        document.getElementById(
            "resourcePreviewModal"
        ),

    resourcePreviewTitle:
        document.getElementById(
            "resourcePreviewTitle"
        ),

    previewLoading:
        document.getElementById(
            "previewLoading"
        ),

    previewError:
        document.getElementById(
            "previewError"
        ),

    resourcePreviewFrame:
        document.getElementById(
            "resourcePreviewFrame"
        ),

    previewResourceType:
        document.getElementById(
            "previewResourceType"
        ),

    previewResourceSize:
        document.getElementById(
            "previewResourceSize"
        ),

    previewDownloadBtn:
        document.getElementById(
            "previewDownloadBtn"
        )

};


/* =========================================================
   4. BOOTSTRAP MODAL INSTANCE
========================================================= */

let resourcePreviewModalInstance =
    null;


/* =========================================================
   5. LIVE FIRESTORE DATA SOURCE

   Fake/sample resources have been removed.
   Real published resources are loaded from:
   study_resources
========================================================= */


/* =========================================================
   6. INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeStudyResources
);


async function initializeStudyResources() {

    try {

        validateRequiredElements();

        initializeBootstrapComponents();

        loadBookmarks();

        bindApplicationEvents();

        setLoadingState(
            true
        );

        /*
         * Later this call will load resources from Firebase.
         * For now, it uses local sample data.
         */

        await loadStudyResources();

        resourceState.initialized =
            true;

    } catch (error) {

        console.error(
            "STUDY RESOURCES INITIALIZATION ERROR:",
            error
        );

        showResourcesError(
            error.message ||
            "Study Resources could not be initialized."
        );

    }

}


/* =========================================================
   7. REQUIRED ELEMENT VALIDATION
========================================================= */

function validateRequiredElements() {

    const requiredElements = {

        resourcesGrid:
            dom.resourcesGrid,

        resourcesLoading:
            dom.resourcesLoading,

        resourcesEmptyState:
            dom.resourcesEmptyState,

        resultsCount:
            dom.resultsCount,

        resourceSearchInput:
            dom.resourceSearchInput,

        resourceTypeTabs:
            dom.resourceTypeTabs

    };

    const missingElements =
        Object.entries(
            requiredElements
        )
            .filter(
                function ([, element]) {

                    return !element;

                }
            )
            .map(
                function ([name]) {

                    return name;

                }
            );

    if (missingElements.length) {

        throw new Error(
            `Missing required page elements: ${missingElements.join(", ")}`
        );

    }

}


/* =========================================================
   8. BOOTSTRAP COMPONENTS
========================================================= */

function initializeBootstrapComponents() {

    if (
        typeof bootstrap ===
        "undefined"
    ) {

        console.warn(
            "Bootstrap JavaScript is not loaded."
        );

        return;

    }

    if (dom.resourcePreviewModal) {

        resourcePreviewModalInstance =
            new bootstrap.Modal(
                dom.resourcePreviewModal
            );

    }

}


/* =========================================================
   9. LOAD LIVE RESOURCES FROM FIRESTORE
========================================================= */

async function loadStudyResources() {

    setLoadingState(
        true
    );

    hideResourcesError();

    try {

        if (
            !window.db ||
            typeof window.collection !== "function" ||
            typeof window.getDocs !== "function"
        ) {

            throw new Error(
                "Firebase is not ready. Check ../firebase.js and the module script."
            );

        }

        const collectionReference =
            window.collection(
                window.db,
                "study_resources"
            );

        const snapshot =
            await window.getDocs(
                collectionReference
            );

        const liveResources = [];

        snapshot.forEach(
            function (documentSnapshot) {

                const resourceData =
                    documentSnapshot.data();

                const status =
                    normalizeSlug(
                        resourceData?.status
                    ) || "published";

                if (
                    status !== "published"
                ) {

                    return;

                }

                const normalizedResource =
                    normalizeResource({
                        id:
                            documentSnapshot.id,
                        ...resourceData
                    });

                if (
                    normalizedResource
                ) {

                    liveResources.push(
                        normalizedResource
                    );

                }

            }
        );

        resourceState.allResources =
            liveResources;

        updateResourceStatistics();

        applyResourceFilters({
            resetPage:
                true
        });

    } catch (error) {

        console.error(
            "LOAD STUDY RESOURCES ERROR:",
            error
        );

        resourceState.allResources =
            [];

        updateResourceStatistics();

        applyResourceFilters({
            resetPage:
                true
        });

        showResourcesError(
            error?.message ||
            "Published study resources could not be loaded from Firebase."
        );

    } finally {

        setLoadingState(
            false
        );

    }

}


/* =========================================================
   10. RESOURCE NORMALIZATION
========================================================= */

function normalizeResource(
    resource
) {

    if (
        !resource ||
        typeof resource !==
            "object"
    ) {

        return null;

    }

    const id =
        cleanValue(
            resource.id,
            120
        );

    const title =
        cleanValue(
            resource.title,
            220
        );

    if (!id || !title) {

        return null;

    }

    return {

        id,

        title,

        description:
            cleanValue(
                resource.description,
                900
            ),

        resourceType:
            normalizeSlug(
                resource.resourceType
            ) ||
            "notes",

        mainCategory:
            normalizeSlug(
                resource.mainCategory
            ),

        educationLevel:
            normalizeSlug(
                resource.educationLevel
            ),

        programExam:
            normalizeSlug(
                resource.programExam
            ),

        semester:
            cleanValue(
                resource.semester,
                20
            ),

        subject:
            normalizeSlug(
                resource.subject
            ),

        subjectLabel:
            cleanValue(
                resource.subjectLabel,
                100
            ) ||
            formatSlugLabel(
                resource.subject
            ),

        year:
            cleanValue(
                resource.year,
                10
            ),

        language:
            normalizeSlug(
                resource.language
            ) ||
            "english",

        pages:
            Math.max(
                0,
                Number.parseInt(
                    resource.pages,
                    10
                ) || 0
            ),

        fileSize:
            cleanValue(
                resource.fileSize,
                40
            ) ||
            "Unknown size",

        views:
            Math.max(
                0,
                Number.parseInt(
                    resource.views,
                    10
                ) || 0
            ),

        downloads:
            Math.max(
                0,
                Number.parseInt(
                    resource.downloads,
                    10
                ) || 0
            ),

        featured:
            Boolean(
                resource.featured
            ),

        isNew:
            Boolean(
                resource.isNew
            ),

        sourceType:
            normalizeResourceSourceType(
                resource.sourceType
            ),

        fileUrl:
            cleanUrl(
                resource.fileUrl
            ),

        externalUrl:
            cleanUrl(
                resource.externalUrl
            ),

        sourceName:
            cleanValue(
                resource.sourceName,
                120
            ) ||
            "JobQuestAI",

        fileName:
            cleanValue(
                resource.fileName,
                240
            ),

        fileExtension:
            cleanValue(
                resource.fileExtension,
                20
            ).toLowerCase(),

        mimeType:
            cleanValue(
                resource.mimeType,
                180
            ).toLowerCase(),

        fileCategory:
            cleanValue(
                resource.fileCategory,
                30
            ).toLowerCase() ||
            inferStudentResourceFileCategory(
                resource
            ),

        thumbnailUrl:
            cleanUrl(
                resource.thumbnailUrl
            ),

        createdAt:
            normalizeDate(
                resource.createdAt
            )

    };

}


/* =========================================================
   NORMALIZE RESOURCE SOURCE TYPE
========================================================= */

function normalizeResourceSourceType(
    sourceType
) {

    const normalized =
        normalizeSlug(
            sourceType
        );

    return normalized ===
        "external"
            ? "external"
            : "internal";

}


/* =========================================================
   RESOURCE FILE CATEGORY HELPERS
========================================================= */

function inferStudentResourceFileCategory(
    resource
) {

    if (
        normalizeResourceSourceType(
            resource?.sourceType
        ) === "external"
    ) {

        return "external";

    }

    const mimeType =
        cleanValue(
            resource?.mimeType,
            180
        ).toLowerCase();

    const extension =
        cleanValue(
            resource?.fileExtension,
            20
        ).toLowerCase();

    const fileUrl =
        cleanValue(
            resource?.fileUrl,
            2200
        ).toLowerCase();

    if (
        mimeType === "application/pdf" ||
        extension === ".pdf" ||
        fileUrl.includes(".pdf")
    ) {

        return "pdf";

    }

    if (
        mimeType.startsWith("image/") ||
        [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ].includes(
            extension
        )
    ) {

        return "image";

    }

    if (
        mimeType.includes("word") ||
        mimeType.includes("wordprocessingml") ||
        extension === ".doc" ||
        extension === ".docx"
    ) {

        return "word";

    }

    return "file";

}


function getStudentResourceFileCategory(
    resource
) {

    const storedCategory =
        cleanValue(
            resource?.fileCategory,
            30
        ).toLowerCase();

    if (
        [
            "pdf",
            "image",
            "word",
            "external"
        ].includes(
            storedCategory
        )
    ) {

        return storedCategory;

    }

    return inferStudentResourceFileCategory(
        resource
    );

}


/* =========================================================
   11. EVENT BINDING
========================================================= */

function bindApplicationEvents() {

    bindSearchEvents();

    bindFilterEvents();

    bindResourceTypeEvents();

    bindSortingEvents();

    bindViewEvents();

    bindPaginationEvents();

    bindMobileFilterEvents();

    bindFeaturedCategoryEvents();

    bindResultDelegationEvents();

    bindPreviewModalEvents();

}


/* =========================================================
   12. SEARCH EVENTS
========================================================= */

function bindSearchEvents() {

    dom.heroSearchForm
        ?.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const searchValue =
                    cleanValue(
                        dom.heroSearchInput
                            ?.value,
                        200
                    );

                if (dom.resourceSearchInput) {

                    dom.resourceSearchInput.value =
                        searchValue;

                }

                resourceState.filters.search =
                    searchValue.toLowerCase();

                applyResourceFilters({
                    resetPage:
                        true
                });

                scrollToResourceExplorer();

            }
        );


    dom.resourceSearchInput
        ?.addEventListener(
            "input",
            function (event) {

                window.clearTimeout(
                    resourceState.searchTimer
                );

                resourceState.searchTimer =
                    window.setTimeout(
                        function () {

                            resourceState.filters.search =
                                cleanValue(
                                    event.target.value,
                                    200
                                ).toLowerCase();

                            syncHeroSearch();

                            updateFilterFieldStates();

                            applyResourceFilters({
                                resetPage:
                                    true
                            });

                        },
                        RESOURCE_CONFIG.searchDelay
                    );

            }
        );

}


/* =========================================================
   13. FILTER EVENTS
========================================================= */

function bindFilterEvents() {

    const filterElements =
        getFilterElements();

    filterElements.forEach(
        function (element) {

            element?.addEventListener(
                "change",
                function () {

                    collectCurrentFilters();

                    updateFilterFieldStates();

                }
            );

        }
    );


    dom.applyFiltersBtn
        ?.addEventListener(
            "click",
            function () {

                collectCurrentFilters();

                applyResourceFilters({
                    resetPage:
                        true
                });

                closeMobileFilters();

            }
        );


    dom.clearFiltersBtn
        ?.addEventListener(
            "click",
            resetAllFilters
        );


    dom.emptyStateResetBtn
        ?.addEventListener(
            "click",
            resetAllFilters
        );


    dom.retryResourcesBtn
        ?.addEventListener(
            "click",
            loadStudyResources
        );

}


/* =========================================================
   14. RESOURCE TYPE EVENTS
========================================================= */

function bindResourceTypeEvents() {

    dom.resourceTypeTabs
        ?.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-resource-type]"
                    );

                if (!button) {
                    return;
                }

                const resourceType =
                    normalizeSlug(
                        button.dataset.resourceType
                    ) ||
                    "all";

                setSelectedResourceType(
                    resourceType
                );

                applyResourceFilters({
                    resetPage:
                        true
                });

                scrollToResourceExplorer();

            }
        );

}


/* =========================================================
   15. SORTING EVENTS
========================================================= */

function bindSortingEvents() {

    dom.sortResources
        ?.addEventListener(
            "change",
            function (event) {

                resourceState.currentSort =
                    cleanValue(
                        event.target.value,
                        30
                    ) ||
                    RESOURCE_CONFIG.defaultSort;

                applyResourceFilters({
                    resetPage:
                        true
                });

            }
        );

}


/* =========================================================
   16. VIEW EVENTS
========================================================= */

function bindViewEvents() {

    dom.gridViewBtn
        ?.addEventListener(
            "click",
            function () {

                setResourceView(
                    "grid"
                );

            }
        );


    dom.listViewBtn
        ?.addEventListener(
            "click",
            function () {

                setResourceView(
                    "list"
                );

            }
        );

}


/* =========================================================
   17. PAGINATION EVENTS
========================================================= */

function bindPaginationEvents() {

    dom.previousPageBtn
        ?.addEventListener(
            "click",
            function () {

                changePage(
                    resourceState.currentPage - 1
                );

            }
        );


    dom.nextPageBtn
        ?.addEventListener(
            "click",
            function () {

                changePage(
                    resourceState.currentPage + 1
                );

            }
        );


    dom.paginationNumbers
        ?.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-page]"
                    );

                if (!button) {
                    return;
                }

                changePage(
                    Number.parseInt(
                        button.dataset.page,
                        10
                    )
                );

            }
        );

}


/* =========================================================
   18. MOBILE FILTER EVENTS
========================================================= */

function bindMobileFilterEvents() {

    dom.openFiltersBtn
        ?.addEventListener(
            "click",
            openMobileFilters
        );


    dom.closeFiltersBtn
        ?.addEventListener(
            "click",
            closeMobileFilters
        );


    dom.filtersOverlay
        ?.addEventListener(
            "click",
            closeMobileFilters
        );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeMobileFilters();

            }

        }
    );

}


/* =========================================================
   19. FEATURED CATEGORY EVENTS
========================================================= */

function bindFeaturedCategoryEvents() {

    dom.featuredCategoryCards
        ?.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        const category =
                            normalizeSlug(
                                card.dataset
                                    .featuredCategory
                            );

                        resetFilterControls({
                            preserveCategory:
                                true
                        });

                        resourceState.filters.mainCategory =
                            category;

                        if (dom.mainCategoryFilter) {

                            dom.mainCategoryFilter.value =
                                category;

                        }

                        updateFilterFieldStates();

                        applyResourceFilters({
                            resetPage:
                                true
                        });

                        scrollToResourceExplorer();

                    }
                );

            }
        );

}


/* =========================================================
   20. RESULT EVENT DELEGATION PLACEHOLDER

   Preview, download and bookmark actions are completed
   in Part 2.
========================================================= */

function bindResultDelegationEvents() {

    dom.resourcesGrid
        ?.addEventListener(
            "click",
            function (event) {

                const actionElement =
                    event.target.closest(
                        "[data-resource-action]"
                    );

                if (!actionElement) {
                    return;
                }

                const resourceId =
                    cleanValue(
                        actionElement
                            .dataset
                            .resourceId,
                        120
                    );

                const action =
                    cleanValue(
                        actionElement
                            .dataset
                            .resourceAction,
                        30
                    );

                handleResourceAction(
                    action,
                    resourceId,
                    actionElement
                );

            }
        );

}


/* =========================================================
   21. PREVIEW MODAL EVENTS
========================================================= */

function bindPreviewModalEvents() {

    dom.resourcePreviewModal
        ?.addEventListener(
            "hidden.bs.modal",
            resetPreviewModal
        );


    dom.resourcePreviewFrame
        ?.addEventListener(
            "load",
            function () {

                if (
                    !resourceState
                        .selectedPreviewResource
                ) {

                    return;

                }
                clearResourcePreviewTimer();

                dom.previewLoading.hidden =
                    true;

                dom.previewError.hidden =
                    true;

                dom.resourcePreviewFrame.hidden =
                    false;

            }
        );
        dom.previewDownloadBtn
            ?.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const resource =
                        resourceState
                            .selectedPreviewResource;

                    if (!resource) {

                        return;

                    }

                    downloadResource(
                        resource,
                        dom.previewDownloadBtn
                    );

                }
            );
}


/* =========================================================
   22. COLLECT CURRENT FILTERS
========================================================= */

function collectCurrentFilters() {

    resourceState.filters = {

        search:
            cleanValue(
                dom.resourceSearchInput
                    ?.value,
                200
            ).toLowerCase(),

        mainCategory:
            normalizeSlug(
                dom.mainCategoryFilter
                    ?.value
            ),

        educationLevel:
            normalizeSlug(
                dom.educationLevelFilter
                    ?.value
            ),

        programExam:
            normalizeSlug(
                dom.programExamFilter
                    ?.value
            ),

        semester:
            cleanValue(
                dom.semesterFilter
                    ?.value,
                20
            ),

        subject:
            normalizeSlug(
                dom.subjectFilter
                    ?.value
            ),

        year:
            cleanValue(
                dom.yearFilter
                    ?.value,
                10
            ),

        language:
            normalizeSlug(
                dom.languageFilter
                    ?.value
            )

    };

}


/* =========================================================
   23. MAIN FILTERING PIPELINE
========================================================= */

function applyResourceFilters({

    resetPage = false

} = {}) {

    if (resetPage) {

        resourceState.currentPage =
            1;

    }

    collectCurrentFilters();

    let filtered =
        resourceState.allResources
            .filter(
                resourceMatchesSelectedType
            )
            .filter(
                resourceMatchesSearch
            )
            .filter(
                resourceMatchesFilters
            );

    filtered =
        sortResourceCollection(
            filtered,
            resourceState.currentSort
        );

    resourceState.filteredResources =
        filtered;

    renderActiveFilters();

    renderCurrentResourcePage();

    updateFilterFieldStates();

}


/* =========================================================
   24. RESOURCE TYPE FILTER
========================================================= */

function resourceMatchesSelectedType(
    resource
) {

    if (
        resourceState.selectedResourceType ===
        "all"
    ) {

        return true;

    }

    return (
        resource.resourceType ===
        resourceState.selectedResourceType
    );

}


/* =========================================================
   25. SEARCH MATCHING
========================================================= */

function resourceMatchesSearch(
    resource
) {

    const query =
        resourceState.filters.search;

    if (!query) {

        return true;

    }

    const searchableText =
        [
            resource.title,
            resource.description,
            resource.resourceType,
            resource.mainCategory,
            resource.educationLevel,
            resource.programExam,
            resource.subject,
            resource.subjectLabel,
            resource.year,
            resource.language
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

    return searchableText.includes(
        query
    );

}


/* =========================================================
   26. ADVANCED FILTER MATCHING
========================================================= */

function resourceMatchesFilters(
    resource
) {

    const filters =
        resourceState.filters;

    if (
        filters.mainCategory &&
        resource.mainCategory !==
            filters.mainCategory
    ) {

        return false;

    }

    if (
        filters.educationLevel &&
        resource.educationLevel !==
            filters.educationLevel
    ) {

        return false;

    }

    if (
        filters.programExam &&
        resource.programExam !==
            filters.programExam
    ) {

        return false;

    }

    if (
        filters.semester &&
        resource.semester !==
            filters.semester
    ) {

        return false;

    }

    if (
        filters.subject &&
        resource.subject !==
            filters.subject
    ) {

        return false;

    }

    if (
        filters.year &&
        resource.year !==
            filters.year
    ) {

        return false;

    }

    if (
        filters.language &&
        resource.language !==
            filters.language
    ) {

        return false;

    }

    return true;

}


/* =========================================================
   27. SORT RESOURCE COLLECTION
========================================================= */

function sortResourceCollection(
    resources,
    sortMode
) {

    const sorted =
        [...resources];

    switch (sortMode) {

        case "popular":

            sorted.sort(
                function (a, b) {

                    return (
                        b.views -
                        a.views
                    );

                }
            );

            break;


        case "downloads":

            sorted.sort(
                function (a, b) {

                    return (
                        b.downloads -
                        a.downloads
                    );

                }
            );

            break;


        case "title-asc":

            sorted.sort(
                function (a, b) {

                    return a.title.localeCompare(
                        b.title
                    );

                }
            );

            break;


        case "title-desc":

            sorted.sort(
                function (a, b) {

                    return b.title.localeCompare(
                        a.title
                    );

                }
            );

            break;


        case "year-desc":

            sorted.sort(
                function (a, b) {

                    return (
                        Number(b.year) -
                        Number(a.year)
                    );

                }
            );

            break;


        case "latest":
        default:

            sorted.sort(
                function (a, b) {

                    return (
                        new Date(
                            b.createdAt
                        ).getTime() -
                        new Date(
                            a.createdAt
                        ).getTime()
                    );

                }
            );

    }

    return sorted;

}


/* =========================================================
   28. HELPERS USED BY LATER PARTS
========================================================= */

function findResourceById(
    resourceId
) {

    return resourceState
        .allResources
        .find(
            function (resource) {

                return (
                    resource.id ===
                    resourceId
                );

            }
        ) || null;

}


function getFilterElements() {

    return [

        dom.mainCategoryFilter,
        dom.educationLevelFilter,
        dom.programExamFilter,
        dom.semesterFilter,
        dom.subjectFilter,
        dom.yearFilter,
        dom.languageFilter

    ].filter(Boolean);

}


/* =========================================================
   29. BASIC UTILITY FUNCTIONS
========================================================= */

function cleanValue(
    value,
    maximumLength = 500
) {

    return String(
        value ?? ""
    )
        .replace(/\0/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(
            0,
            maximumLength
        );

}


function normalizeSlug(
    value
) {

    return cleanValue(
        value,
        120
    )
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

}


function formatSlugLabel(
    value
) {

    return normalizeSlug(
        value
    )
        .split("-")
        .filter(Boolean)
        .map(
            function (word) {

                return (
                    word.charAt(0)
                        .toUpperCase() +
                    word.slice(1)
                );

            }
        )
        .join(" ");

}


function cleanUrl(
    value
) {

    const url =
        cleanValue(
            value,
            2000
        );

    if (!url) {

        return "";

    }

    try {

        const parsed =
            new URL(
                url,
                window.location.href
            );

        if (
            ![
                "http:",
                "https:"
            ].includes(
                parsed.protocol
            )
        ) {

            return "";

        }

        return parsed.href;

    } catch {

        return "";

    }

}


function normalizeDate(
    value
) {

    let resolvedValue =
        value;

    if (
        value &&
        typeof value.toDate === "function"
    ) {

        resolvedValue =
            value.toDate();

    } else if (
        value &&
        typeof value.seconds === "number"
    ) {

        resolvedValue =
            new Date(
                value.seconds * 1000
            );

    }

    const date =
        new Date(
            resolvedValue
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return new Date(0)
            .toISOString();

    }

    return date.toISOString();

}


function wait(
    milliseconds
) {

    return new Promise(
        function (resolve) {

            window.setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* =========================================================
   30. PLACEHOLDER FUNCTIONS

   These functions will be completed in Part 2.
========================================================= */

function setLoadingState(
    loading
) {

    resourceState.loading =
        Boolean(loading);

    dom.resourcesLoading.hidden =
        !loading;

    if (loading) {

        dom.resourcesGrid.hidden =
            true;

        dom.resourcesEmptyState.hidden =
            true;

        dom.resourcesPagination.hidden =
            true;

    }

}


function showResourcesError(
    message
) {

    setLoadingState(
        false
    );

    dom.resourcesGrid.hidden =
        true;

    dom.resourcesEmptyState.hidden =
        true;

    dom.resourcesPagination.hidden =
        true;

    dom.resourcesErrorState.hidden =
        false;

    if (dom.resourcesErrorMessage) {

        dom.resourcesErrorMessage.textContent =
            cleanValue(
                message,
                500
            );

    }

}


function hideResourcesError() {

    if (dom.resourcesErrorState) {

        dom.resourcesErrorState.hidden =
            true;

    }

}


function setSelectedResourceType(
    resourceType
) {

    resourceState.selectedResourceType =
        resourceType;

    dom.resourceTypeTabs
        ?.querySelectorAll(
            "[data-resource-type]"
        )
        .forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.resourceType ===
                        resourceType
                );

            }
        );

}


function setResourceView(
    view
) {

    resourceState.currentView =
        view === "list"
            ? "list"
            : "grid";

    dom.gridViewBtn
        ?.classList.toggle(
            "active",
            resourceState.currentView ===
                "grid"
        );

    dom.listViewBtn
        ?.classList.toggle(
            "active",
            resourceState.currentView ===
                "list"
        );

    dom.resourcesGrid
        ?.classList.toggle(
            "grid-view",
            resourceState.currentView ===
                "grid"
        );

    dom.resourcesGrid
        ?.classList.toggle(
            "list-view",
            resourceState.currentView ===
                "list"
        );

}


function changePage(
    page
) {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                resourceState
                    .filteredResources
                    .length /
                resourceState
                    .resourcesPerPage
            )
        );

    const safePage =
        Math.max(
            1,
            Math.min(
                totalPages,
                Number(page) || 1
            )
        );

    if (
        safePage ===
        resourceState.currentPage
    ) {

        return;

    }

    resourceState.currentPage =
        safePage;

    renderCurrentResourcePage();

    scrollToResourceExplorer();

}


function resetAllFilters() {

    resetFilterControls({
        preserveCategory:
            false
    });

    setSelectedResourceType(
        "all"
    );

    resourceState.currentSort =
        RESOURCE_CONFIG.defaultSort;

    if (dom.sortResources) {

        dom.sortResources.value =
            RESOURCE_CONFIG.defaultSort;

    }

    applyResourceFilters({
        resetPage:
            true
    });

}


function resetFilterControls({

    preserveCategory = false

} = {}) {

    if (dom.resourceSearchInput) {

        dom.resourceSearchInput.value =
            "";

    }

    if (dom.heroSearchInput) {

        dom.heroSearchInput.value =
            "";

    }

    getFilterElements()
        .forEach(
            function (element) {

                if (
                    preserveCategory &&
                    element ===
                        dom.mainCategoryFilter
                ) {

                    return;

                }

                element.value =
                    "";

            }
        );

    resourceState.filters = {

        search:
            "",

        mainCategory:
            preserveCategory
                ? resourceState
                    .filters
                    .mainCategory
                : "",

        educationLevel:
            "",

        programExam:
            "",

        semester:
            "",

        subject:
            "",

        year:
            "",

        language:
            ""

    };

    updateFilterFieldStates();

}


function openMobileFilters() {

    dom.filtersSidebar
        ?.classList.add(
            "active"
        );

    dom.filtersOverlay
        ?.classList.add(
            "active"
        );

    document.body
        .classList.add(
            "filters-open"
        );

}


function closeMobileFilters() {

    dom.filtersSidebar
        ?.classList.remove(
            "active"
        );

    dom.filtersOverlay
        ?.classList.remove(
            "active"
        );

    document.body
        .classList.remove(
            "filters-open"
        );

}


function syncHeroSearch() {

    if (dom.heroSearchInput) {

        dom.heroSearchInput.value =
            dom.resourceSearchInput
                ?.value || "";

    }

}


function scrollToResourceExplorer() {

    document
        .querySelector(
            ".resources-explorer-section"
        )
        ?.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

}


function handleResourceAction(
    action,
    resourceId,
    actionElement
) {

    const resource =
        findResourceById(
            resourceId
        );

    if (!resource) {

        console.error(
            "Resource not found:",
            resourceId
        );

        return;

    }

    switch (action) {

        case "preview":

            openResourcePreview(
                resource
            );

            break;


        case "download":

            downloadResource(
                resource,
                actionElement
            );

            break;


        case "bookmark":

            toggleResourceBookmark(
                resource,
                actionElement
            );

            break;


        default:

            console.warn(
                "Unknown resource action:",
                action
            );

    }

}

/* =========================================================
   RESOURCE PREVIEW
========================================================= */

async function openResourcePreview(
    resource
) {

    clearResourcePreviewTimer();

    revokeActivePreviewObjectUrl();

    const resourceUrl =
        getResourceAccessUrl(
            resource
        );

    if (!resourceUrl) {

        showSimpleNotification(
            "Preview is not available because this resource has no valid file URL.",
            "error"
        );

        return;

    }

    const fileCategory =
        getStudentResourceFileCategory(
            resource
        );

    /*
     * Word documents cannot be rendered reliably inside a
     * normal browser iframe. Open them in a new tab.
     */

    if (
        fileCategory === "word"
    ) {

        window.open(
            resourceUrl,
            "_blank"
        );

        return;

    }

    resourceState.selectedPreviewResource =
        resource;

    if (
        dom.resourcePreviewTitle
    ) {

        dom.resourcePreviewTitle.textContent =
            resource.title;

    }

    if (
        dom.previewResourceType
    ) {

        const typeLabel =
            getResourceTypeDetails(
                resource.resourceType
            ).label;

        const fileLabel = {

            pdf:
                "PDF",

            image:
                "Image",

            external:
                "External Resource",

            file:
                "File"

        }[fileCategory] || "Resource";

        dom.previewResourceType.textContent =
            `${typeLabel} • ${fileLabel}`;

    }

    if (
        dom.previewResourceSize
    ) {

        const metadata = [];

        if (
            resource.fileSize
        ) {

            metadata.push(
                resource.fileSize
            );

        }

        if (
            resource.pages &&
            fileCategory === "pdf"
        ) {

            metadata.push(
                `${resource.pages} pages`
            );

        }

        dom.previewResourceSize.textContent =
            metadata.join(" • ") ||
            "Resource information unavailable";

    }

    configurePreviewDownloadButton(
        resource,
        resourceUrl
    );

    if (
        dom.previewLoading
    ) {

        dom.previewLoading.hidden =
            false;

    }

    if (
        dom.previewError
    ) {

        dom.previewError.hidden =
            true;

    }

    if (
        dom.resourcePreviewFrame
    ) {

        dom.resourcePreviewFrame.hidden =
            true;

        dom.resourcePreviewFrame.src =
            "about:blank";

    }

    if (
        !resourcePreviewModalInstance
    ) {

        window.open(
            resourceUrl,
            "_blank"
        );

        return;

    }

    resourcePreviewModalInstance.show();

    try {

        /*
         * Firebase download URLs can send attachment headers.
         * Fetching the file as a Blob and previewing an object
         * URL makes PDF/image preview much more reliable.
         */

        const response =
            await fetch(
                resourceUrl,
                {
                    method:
                        "GET",

                    mode:
                        "cors",

                    cache:
                        "no-store"
                }
            );

        if (
            !response.ok
        ) {

            throw new Error(
                `Preview request failed with status ${response.status}.`
            );

        }

        const blob =
            await response.blob();

        const objectUrl =
            URL.createObjectURL(
                blob
            );

        resourceState.activePreviewObjectUrl =
            objectUrl;

        if (
            dom.resourcePreviewFrame
        ) {

            dom.resourcePreviewFrame.src =
                objectUrl;

        }

        resourceState.previewTimer =
            window.setTimeout(
                showPreviewErrorState,
                RESOURCE_CONFIG.previewTimeout
            );

    } catch (error) {

        console.error(
            "RESOURCE PREVIEW ERROR:",
            error
        );

        /*
         * Direct URL fallback. This still allows previews for
         * providers that block fetch but permit iframe access.
         */

        if (
            dom.resourcePreviewFrame
        ) {

            dom.resourcePreviewFrame.src =
                resourceUrl;

        }

        resourceState.previewTimer =
            window.setTimeout(
                showPreviewErrorState,
                RESOURCE_CONFIG.previewTimeout
            );

    }

}


function configurePreviewDownloadButton(
    resource,
    resourceUrl
) {

    if (
        !dom.previewDownloadBtn
    ) {

        return;

    }

    dom.previewDownloadBtn.href =
        resourceUrl;

    dom.previewDownloadBtn.dataset.resourceId =
        resource.id;

    dom.previewDownloadBtn.removeAttribute(
        "download"
    );

    dom.previewDownloadBtn.target =
        "_blank";

    dom.previewDownloadBtn.rel =
        "noopener noreferrer";

}


function getResourceAccessUrl(
    resource
) {

    if (!resource) {

        return "";

    }

    if (
        resource.sourceType ===
        "external"
    ) {

        return (
            resource.externalUrl ||
            resource.fileUrl ||
            ""
        );

    }

    return (
        resource.fileUrl ||
        resource.externalUrl ||
        ""
    );

}


/* =========================================================
   CHECK PDF URL
========================================================= */

function looksLikePdfUrl(
    url
) {

    const normalizedUrl =
        String(
            url || ""
        )
            .toLowerCase()
            .split("?")[0]
            .split("#")[0];

    return (
        normalizedUrl.endsWith(
            ".pdf"
        ) ||
        normalizedUrl.includes(
            "/pdf/"
        )
    );

}


/* =========================================================
   PREVIEW ERROR STATE
========================================================= */

function showPreviewErrorState() {

    clearResourcePreviewTimer();

    if (dom.previewLoading) {

        dom.previewLoading.hidden =
            true;

    }

    if (dom.resourcePreviewFrame) {

        dom.resourcePreviewFrame.hidden =
            true;

    }

    if (dom.previewError) {

        dom.previewError.hidden =
            false;

    }

}


/* =========================================================
   CLEAR PREVIEW TIMER
========================================================= */

function clearResourcePreviewTimer() {

    if (
        resourceState.previewTimer
    ) {

        window.clearTimeout(
            resourceState.previewTimer
        );

        resourceState.previewTimer =
            null;

    }

}


/* =========================================================
   RESOURCE ACTION LOADING
========================================================= */

function setResourceActionLoading(
    actionElement,
    isLoading
) {

    if (!actionElement) {

        return;

    }

    actionElement.classList.toggle(
        "is-loading",
        Boolean(isLoading)
    );

    actionElement.disabled =
        Boolean(isLoading);

}


/* =========================================================
   SIMPLE NOTIFICATION
========================================================= */

function showSimpleNotification(
    message,
    type = "success"
) {

    const existingNotification =
        document.querySelector(
            ".study-resource-notification"
        );

    existingNotification?.remove();

    const notification =
        document.createElement(
            "div"
        );

    notification.className =
        `study-resource-notification ${type}`;

    notification.setAttribute(
        "role",
        type === "error"
            ? "alert"
            : "status"
    );

    notification.innerHTML = `

        <i class="bi ${
            type === "error"
                ? "bi-exclamation-circle-fill"
                : "bi-check-circle-fill"
        }"></i>

        <span>
            ${escapeHtml(message)}
        </span>

    `;

    document.body.appendChild(
        notification
    );

    requestAnimationFrame(
        function () {

            notification.classList.add(
                "show"
            );

        }
    );

    window.setTimeout(
        function () {

            notification.classList.remove(
                "show"
            );

            window.setTimeout(
                function () {

                    notification.remove();

                },
                250
            );

        },
        2800
    );

}

/* =========================================================
   RESOURCE DOWNLOAD
========================================================= */

async function downloadResource(
    resource,
    actionElement
) {

    const resourceUrl =
        getResourceAccessUrl(
            resource
        );

    if (!resourceUrl) {

        showSimpleNotification(
            "This resource does not have a valid download URL.",
            "error"
        );

        return;

    }

    setResourceActionLoading(
        actionElement,
        true
    );

    try {

        /*
         * External links should open their official source.
         */

        if (
            resource.sourceType === "external"
        ) {

            window.open(
                resourceUrl,
                "_blank"
            );

            return;

        }

        const response =
            await fetch(
                resourceUrl,
                {
                    method:
                        "GET",

                    mode:
                        "cors",

                    cache:
                        "no-store"
                }
            );

        if (
            !response.ok
        ) {

            throw new Error(
                `Download request failed with status ${response.status}.`
            );

        }

        const blob =
            await response.blob();

        const objectUrl =
            URL.createObjectURL(
                blob
            );

        const downloadLink =
            document.createElement(
                "a"
            );

        downloadLink.href =
            objectUrl;

        downloadLink.download =
            createResourceFileName(
                resource
            );

        downloadLink.style.display =
            "none";

        document.body.appendChild(
            downloadLink
        );

        downloadLink.click();

        downloadLink.remove();

        window.setTimeout(
            function () {

                URL.revokeObjectURL(
                    objectUrl
                );

            },
            1500
        );

        resource.downloads +=
            1;

        showSimpleNotification(
            "Download started successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "RESOURCE DOWNLOAD ERROR:",
            error
        );

        /*
         * Browsers may block cross-origin Blob downloads for
         * some providers. Opening the real URL is the safest
         * fallback and still gives the user the file.
         */

        window.open(
            resourceUrl,
            "_blank"
        );

        showSimpleNotification(
            "The file was opened in a new tab. Use the browser download button if needed.",
            "success"
        );

    } finally {

        setResourceActionLoading(
            actionElement,
            false
        );

    }

}


/* =========================================================
   RESOURCE BOOKMARK
========================================================= */

function toggleResourceBookmark(
    resource,
    actionElement
) {

    const alreadyBookmarked =
        resourceState.bookmarks.has(
            resource.id
        );

    if (alreadyBookmarked) {

        resourceState.bookmarks.delete(
            resource.id
        );

    } else {

        resourceState.bookmarks.add(
            resource.id
        );

    }

    saveBookmarks();

    const isBookmarked =
        resourceState.bookmarks.has(
            resource.id
        );

    if (actionElement) {

        actionElement.classList.toggle(
            "active",
            isBookmarked
        );

        actionElement.setAttribute(
            "aria-pressed",
            String(isBookmarked)
        );

        actionElement.setAttribute(
            "aria-label",
            isBookmarked
                ? "Remove saved resource"
                : "Save resource"
        );

        actionElement.title =
            isBookmarked
                ? "Remove bookmark"
                : "Save resource";

        const icon =
            actionElement.querySelector(
                "i"
            );

        if (icon) {

            icon.className =
                isBookmarked
                    ? "bi bi-bookmark-fill"
                    : "bi bi-bookmark";

        }

    }

}

/* =========================================================
   SAVE BOOKMARKS
========================================================= */

function saveBookmarks() {

    try {

        localStorage.setItem(
            "jobquestai-resource-bookmarks",
            JSON.stringify(
                Array.from(
                    resourceState.bookmarks
                )
            )
        );

    } catch (error) {

        console.warn(
            "Bookmarks could not be saved:",
            error
        );

    }

}

/* =========================================================
   CREATE DOWNLOAD FILE NAME
========================================================= */

function createResourceFileName(
    resource
) {

    const safeTitle =
        String(
            resource.title ||
            "study-resource"
        )
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(
                0,
                80
            );

    const extension =
        cleanValue(
            resource.fileExtension,
            20
        ).toLowerCase() ||
        (
            getStudentResourceFileCategory(
                resource
            ) === "image"
                ? ".jpg"
                : ".pdf"
        );

    return `${safeTitle || "study-resource"}${
        extension.startsWith(".")
            ? extension
            : `.${extension}`
    }`;

}


function revokeActivePreviewObjectUrl() {

    if (
        !resourceState.activePreviewObjectUrl
    ) {

        return;

    }

    URL.revokeObjectURL(
        resourceState.activePreviewObjectUrl
    );

    resourceState.activePreviewObjectUrl =
        "";

}


function resetPreviewModal() {

    clearResourcePreviewTimer();

    revokeActivePreviewObjectUrl();

    resourceState.selectedPreviewResource =
        null;

    if (
        dom.resourcePreviewFrame
    ) {

        dom.resourcePreviewFrame.src =
            "about:blank";

        dom.resourcePreviewFrame.hidden =
            true;

    }

    if (
        dom.previewLoading
    ) {

        dom.previewLoading.hidden =
            false;

    }

    if (
        dom.previewError
    ) {

        dom.previewError.hidden =
            true;

    }

    if (
        dom.previewDownloadBtn
    ) {

        dom.previewDownloadBtn.href =
            "#";

        delete dom.previewDownloadBtn.dataset.resourceId;

    }

}


function loadBookmarks() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    "jobquestai-resource-bookmarks"
                ) ||
                "[]"
            );

        resourceState.bookmarks =
            new Set(
                Array.isArray(stored)
                    ? stored
                    : []
            );

    } catch {

        resourceState.bookmarks =
            new Set();

    }

}


/* =========================================================
   END OF STUDY RESOURCES JAVASCRIPT — PART 1

   PASTE PART 2 DIRECTLY BELOW THIS COMMENT.

   PART 2 WILL INCLUDE:
   - Resource card rendering
   - Current page rendering
   - Pagination rendering
   - Active filter tags
   - Statistics
   - Preview modal
   - Download handling
   - Bookmark handling
   - Formatting utilities
========================================================= */

/* =========================================================
   JOBQUESTAI — STUDY RESOURCES

   JAVASCRIPT PART 2A

   Includes:
   - Current page rendering
   - Resource card generation
   - Grid/list view rendering
   - Results count
   - Empty state
   - Resource type labels and icons
   - Resource metadata
   - Safe HTML output

   Pagination controls will be completed in Part 2B.
========================================================= */


/* =========================================================
   31. RENDER CURRENT RESOURCE PAGE
========================================================= */

function renderCurrentResourcePage() {

    hideResourcesError();

    const totalResources =
        resourceState.filteredResources.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalResources /
                resourceState.resourcesPerPage
            )
        );

    if (
        resourceState.currentPage >
        totalPages
    ) {

        resourceState.currentPage =
            totalPages;

    }

    const startIndex =
        (
            resourceState.currentPage -
            1
        ) *
        resourceState.resourcesPerPage;

    const endIndex =
        startIndex +
        resourceState.resourcesPerPage;

    const currentResources =
        resourceState.filteredResources
            .slice(
                startIndex,
                endIndex
            );

    updateResultsCount(
        totalResources,
        startIndex,
        currentResources.length
    );

    if (!totalResources) {

        showResourcesEmptyState();

        renderPaginationControls();

        return;

    }

    hideResourcesEmptyState();

    renderResourceCollection(
        currentResources
    );

    setResourceView(
        resourceState.currentView
    );

    renderPaginationControls();

}


/* =========================================================
   32. RENDER RESOURCE COLLECTION
========================================================= */

function renderResourceCollection(
    resources
) {

    if (!dom.resourcesGrid) {
        return;
    }

    dom.resourcesGrid.innerHTML =
        resources
            .map(
                createResourceCardMarkup
            )
            .join("");

    dom.resourcesGrid.hidden =
        false;

    dom.resourcesLoading.hidden =
        true;

    dom.resourcesEmptyState.hidden =
        true;

}


/* =========================================================
   33. CREATE RESOURCE CARD
========================================================= */

function createResourceCardMarkup(
    resource
) {

    const typeDetails =
        getResourceTypeDetails(
            resource.resourceType
        );

    const isBookmarked =
        resourceState.bookmarks.has(
            resource.id
        );

    const previewMarkup =
        createResourcePreviewMarkup(
            resource,
            typeDetails
        );

    const featuredBadge =
        resource.featured
            ? `
                <span class="resource-featured-badge">

                    <i class="bi bi-star-fill"></i>

                    Featured

                </span>
            `
            : resource.isNew
                ? `
                    <span class="resource-new-badge">

                        <i class="bi bi-lightning-charge-fill"></i>

                        New

                    </span>
                `
                : "";

    const categoryLabel =
        formatSlugLabel(
            resource.mainCategory
        ) ||
        "Study Resource";

    const programLabel =
        resource.programExam
            ? formatSlugLabel(
                resource.programExam
            )
            : "";

    const educationLabel =
        resource.educationLevel
            ? formatEducationLevelLabel(
                resource.educationLevel
            )
            : "";

    const languageLabel =
        formatLanguageLabel(
            resource.language
        );

    const semesterTag =
        resource.semester
            ? `
                <span class="resource-tag">

                    <i class="bi bi-calendar3"></i>

                    Semester ${escapeHtml(resource.semester)}

                </span>
            `
            : "";

    const programTag =
        programLabel
            ? `
                <span class="resource-tag">

                    <i class="bi bi-mortarboard"></i>

                    ${escapeHtml(programLabel)}

                </span>
            `
            : "";

    const educationTag =
        educationLabel
            ? `
                <span class="resource-tag">

                    <i class="bi bi-bar-chart-steps"></i>

                    ${escapeHtml(educationLabel)}

                </span>
            `
            : "";

    return `
        <article
            class="resource-card"
            data-resource-id="${escapeHtml(resource.id)}"
            data-resource-type="${escapeHtml(resource.resourceType)}"
        >

            <div
                class="resource-card-preview ${
                    resource.thumbnailUrl
                        ? "has-thumbnail"
                        : ""
                }"
            >

                ${previewMarkup}

                <span class="resource-type-badge">

                    <i class="bi ${typeDetails.icon}"></i>

                    ${escapeHtml(typeDetails.label)}

                </span>

                ${featuredBadge}

                <button
                    type="button"
                    class="resource-quick-action"
                    data-resource-action="preview"
                    data-resource-id="${escapeHtml(resource.id)}"
                    aria-label="Preview ${escapeHtml(resource.title)}"
                    title="Quick preview"
                >

                    <i class="bi bi-eye-fill"></i>

                </button>

            </div>


            <div class="resource-card-body">

                <div class="resource-card-category">

                    <span>

                        <i class="bi bi-folder2-open"></i>

                        ${escapeHtml(categoryLabel)}

                    </span>

                    ${
                        resource.year
                            ? `
                                <span class="resource-year-label">

                                    ${escapeHtml(resource.year)}

                                </span>
                            `
                            : ""
                    }

                </div>


                <h3 class="resource-card-title">

                    ${escapeHtml(resource.title)}

                </h3>


                <p class="resource-card-description">

                    ${
                        escapeHtml(
                            resource.description ||
                            "Study material available for preview and download."
                        )
                    }

                </p>


                ${
                    resource.subjectLabel
                        ? `
                            <div class="resource-subject">

                                <i class="bi bi-bookmark-fill"></i>

                                <span>

                                    ${escapeHtml(resource.subjectLabel)}

                                </span>

                            </div>
                        `
                        : ""
                }


                <div class="resource-tags">

                    ${programTag}

                    ${educationTag}

                    ${semesterTag}

                    <span class="resource-tag">

                        <i class="bi bi-translate"></i>

                        ${escapeHtml(languageLabel)}

                    </span>

                </div>


                <div class="resource-meta">

                    <div class="resource-meta-left">

                        <span class="resource-meta-item views">

                            <i class="bi bi-eye-fill"></i>

                            ${formatCompactNumber(resource.views)}

                            views

                        </span>

                        <span class="resource-meta-item downloads">

                            <i class="bi bi-download"></i>

                            ${formatCompactNumber(resource.downloads)}

                            downloads

                        </span>

                    </div>


                    <div class="resource-meta-right">

                        ${
                            resource.pages
                                ? `
                                    <span class="resource-meta-item pages">

                                        <i class="bi bi-file-earmark-text"></i>

                                        ${formatCompactNumber(resource.pages)}

                                        pages

                                    </span>
                                `
                                : ""
                        }

                        <span class="resource-meta-item size">

                            <i class="bi bi-hdd"></i>

                            ${escapeHtml(resource.fileSize)}

                        </span>

                    </div>

                </div>


                <div class="resource-file-info">

                    <div class="resource-file-info-left">

                        <span class="resource-file-info-text">

                            <strong>
                                ${
                                    resource.sourceType === "external"
                                        ? "Official External Resource"
                                        : "JobQuestAI PDF Resource"
                                }
                            </strong>

                            <span>
                                ${
                                    resource.sourceType === "external"
                                        ? escapeHtml(
                                            resource.sourceName ||
                                            "Official source"
                                        )
                                        : `
                                            ${escapeHtml(resource.fileSize)}
                                            ${
                                                resource.pages
                                                    ? ` • ${escapeHtml(resource.pages)} pages`
                                                    : ""
                                            }
                                        `
                                }
                            </span>

                        </span>
                    </div>


                    <span class="resource-file-status">

                        <i class="bi ${
                            resource.sourceType === "external"
                                ? "bi-link-45deg"
                                : "bi-check-circle-fill"
                        }"></i>

                        ${
                            resource.sourceType === "external"
                                ? "Official Link"
                                : "Available"
                        }

                    </span>

                </div>


                <div class="resource-card-divider"></div>


                <div class="resource-card-actions">

                    <button
                        type="button"
                        class="resource-action-btn resource-preview-btn"
                        data-resource-action="preview"
                        data-resource-id="${escapeHtml(resource.id)}"
                    >

                        <i class="bi bi-eye"></i>

                        <span>
                            Preview
                        </span>

                    </button>


                    <button
                        type="button"
                        class="resource-action-btn resource-download-btn"
                        data-resource-action="download"
                        data-resource-id="${escapeHtml(resource.id)}"
                        ${
                            getResourceAccessUrl(resource)
                                ? ""
                                : "disabled"
                        }
                    >

                        <i class="bi ${
                            resource.sourceType === "external"
                                ? "bi-box-arrow-up-right"
                                : "bi-download"
                        }"></i>

                        <span>
                            ${
                                resource.sourceType === "external"
                                    ? "Open Source"
                                    : "Download"
                            }
                        </span>

                    </button>


                    <button
                        type="button"
                        class="resource-action-btn resource-bookmark-btn ${
                            isBookmarked
                                ? "active"
                                : ""
                        }"
                        data-resource-action="bookmark"
                        data-resource-id="${escapeHtml(resource.id)}"
                        aria-label="${
                            isBookmarked
                                ? "Remove saved resource"
                                : "Save resource"
                        }"
                        aria-pressed="${
                            isBookmarked
                                ? "true"
                                : "false"
                        }"
                        title="${
                            isBookmarked
                                ? "Remove bookmark"
                                : "Save resource"
                        }"
                    >

                        <i class="bi ${
                            isBookmarked
                                ? "bi-bookmark-fill"
                                : "bi-bookmark"
                        }"></i>

                    </button>

                </div>


                <div class="resource-card-footnote">

                    <i class="bi bi-info-circle"></i>

                    <span>
                        Open the preview to review this resource
                        before downloading.
                    </span>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   34. CREATE RESOURCE PREVIEW MARKUP
========================================================= */

function createResourcePreviewMarkup(
    resource,
    typeDetails
) {

    if (resource.thumbnailUrl) {

        return `
            <img
                src="${escapeHtml(resource.thumbnailUrl)}"
                alt=""
                class="resource-thumbnail"
                loading="lazy"
                decoding="async"
            >
        `;

    }

    return `
        <span
            class="resource-file-icon"
            aria-hidden="true"
        >

            <i class="bi ${typeDetails.previewIcon}"></i>

        </span>
    `;

}


/* =========================================================
   35. RESOURCE TYPE DETAILS
========================================================= */

function getResourceTypeDetails(
    resourceType
) {

    const types = {

        notes: {

            label:
                "Notes",

            icon:
                "bi-journal-text",

            previewIcon:
                "bi-journal-text"

        },

        "past-paper": {

            label:
                "Past Paper",

            icon:
                "bi-file-earmark-text",

            previewIcon:
                "bi-file-earmark-text-fill"

        },

        book: {

            label:
                "Book",

            icon:
                "bi-book",

            previewIcon:
                "bi-book-fill"

        },

        mcqs: {

            label:
                "MCQs",

            icon:
                "bi-ui-checks-grid",

            previewIcon:
                "bi-ui-checks-grid"

        },

        syllabus: {

            label:
                "Syllabus",

            icon:
                "bi-list-check",

            previewIcon:
                "bi-list-check"

        },

        "guess-paper": {

            label:
                "Guess Paper",

            icon:
                "bi-lightbulb",

            previewIcon:
                "bi-lightbulb-fill"

        },

        "solved-paper": {

            label:
                "Solved Paper",

            icon:
                "bi-check2-square",

            previewIcon:
                "bi-file-earmark-check-fill"

        },

        assignment: {

            label:
                "Assignment",

            icon:
                "bi-clipboard-check",

            previewIcon:
                "bi-clipboard-check-fill"

        }

    };

    return types[resourceType] || {

        label:
            formatSlugLabel(
                resourceType
            ) ||
            "Resource",

        icon:
            "bi-file-earmark-text",

        previewIcon:
            "bi-file-earmark-pdf-fill"

    };

}


/* =========================================================
   36. UPDATE RESULTS COUNT
========================================================= */

function updateResultsCount(
    totalResources,
    startIndex,
    currentCount
) {

    if (!dom.resultsCount) {
        return;
    }

    if (!totalResources) {

        dom.resultsCount.textContent =
            "0 resources";

        return;

    }

    const firstResult =
        startIndex + 1;

    const lastResult =
        startIndex +
        currentCount;

    dom.resultsCount.textContent =
        `${firstResult}–${lastResult} of ${totalResources} resources`;

}


/* =========================================================
   37. SHOW EMPTY STATE
========================================================= */

function showResourcesEmptyState() {

    if (dom.resourcesGrid) {

        dom.resourcesGrid.innerHTML =
            "";

        dom.resourcesGrid.hidden =
            true;

    }

    if (dom.resourcesLoading) {

        dom.resourcesLoading.hidden =
            true;

    }

    if (dom.resourcesErrorState) {

        dom.resourcesErrorState.hidden =
            true;

    }

    if (dom.resourcesEmptyState) {

        dom.resourcesEmptyState.hidden =
            false;

    }

}


/* =========================================================
   38. HIDE EMPTY STATE
========================================================= */

function hideResourcesEmptyState() {

    if (dom.resourcesEmptyState) {

        dom.resourcesEmptyState.hidden =
            true;

    }

}


/* =========================================================
   39. TEMPORARY PAGINATION RENDERING

   Complete numbered pagination will replace this function
   in Part 2B.
========================================================= */


/* =========================================================
   40. EDUCATION LEVEL LABEL
========================================================= */

function formatEducationLevelLabel(
    educationLevel
) {

    const labels = {

        "class-9":
            "Class 9",

        "class-10":
            "Class 10",

        "class-11":
            "Class 11",

        "class-12":
            "Class 12",

        intermediate:
            "Intermediate",

        undergraduate:
            "Undergraduate",

        graduate:
            "Graduate",

        competitive:
            "Competitive Exam",

        "job-preparation":
            "Job Preparation"

    };

    return (
        labels[educationLevel] ||
        formatSlugLabel(
            educationLevel
        )
    );

}


/* =========================================================
   41. LANGUAGE LABEL
========================================================= */

function formatLanguageLabel(
    language
) {

    const labels = {

        english:
            "English",

        urdu:
            "Urdu",

        "english-urdu":
            "English + Urdu"

    };

    return (
        labels[language] ||
        formatSlugLabel(
            language
        ) ||
        "English"
    );

}


/* =========================================================
   42. COMPACT NUMBER
========================================================= */

function formatCompactNumber(
    value
) {

    const number =
        Math.max(
            0,
            Number(value) || 0
        );

    try {

        return new Intl.NumberFormat(
            "en",
            {
                notation:
                    "compact",

                maximumFractionDigits:
                    1
            }
        ).format(number);

    } catch {

        return String(number);

    }

}


/* =========================================================
   43. SAFE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   44. IMAGE FALLBACK

   If a thumbnail cannot load, its card will switch to the
   default file-icon preview.
========================================================= */

dom.resourcesGrid
    ?.addEventListener(
        "error",
        function (event) {

            const image =
                event.target.closest(
                    ".resource-thumbnail"
                );

            if (!image) {
                return;
            }

            const card =
                image.closest(
                    ".resource-card"
                );

            const resourceId =
                card?.dataset
                    ?.resourceId;

            const resource =
                findResourceById(
                    resourceId
                );

            if (
                !card ||
                !resource
            ) {

                return;

            }

            const preview =
                card.querySelector(
                    ".resource-card-preview"
                );

            const typeDetails =
                getResourceTypeDetails(
                    resource.resourceType
                );

            preview
                ?.classList.remove(
                    "has-thumbnail"
                );

            image.remove();

            preview?.insertAdjacentHTML(
                "afterbegin",
                `
                    <span
                        class="resource-file-icon"
                        aria-hidden="true"
                    >

                        <i class="bi ${typeDetails.previewIcon}"></i>

                    </span>
                `
            );

        },
        true
    );


/* =========================================================
   END OF STUDY RESOURCES JAVASCRIPT — PART 2A

   PASTE PART 2B DIRECTLY BELOW THIS COMMENT.

   PART 2B WILL INCLUDE:
   - Numbered pagination
   - Active filter tags
   - Remove individual filters
   - Resource statistics
   - Filter visual states
   - Filter label formatting
========================================================= */

/* =========================================================
   JOBQUESTAI — STUDY RESOURCES

   JAVASCRIPT PART 2B

   Includes:
   - Numbered pagination
   - Pagination ellipsis
   - Active filter tags
   - Individual filter removal
   - Resource statistics
   - Filter visual states
   - Human-readable filter labels
========================================================= */


/* =========================================================
   45. COMPLETE PAGINATION RENDERING
========================================================= */

function renderPaginationControls() {

    const totalResources =
        resourceState.filteredResources.length;

    const totalPages =
        Math.ceil(
            totalResources /
            resourceState.resourcesPerPage
        );

    if (!dom.resourcesPagination) {
        return;
    }

    if (
        totalResources === 0 ||
        totalPages <= 1
    ) {

        dom.resourcesPagination.hidden =
            true;

        if (dom.paginationNumbers) {
            dom.paginationNumbers.innerHTML = "";
        }

        return;
    }

    dom.resourcesPagination.hidden =
        false;

    if (dom.previousPageBtn) {

        dom.previousPageBtn.disabled =
            resourceState.currentPage <= 1;

    }

    if (dom.nextPageBtn) {

        dom.nextPageBtn.disabled =
            resourceState.currentPage >=
            totalPages;

    }

    if (!dom.paginationNumbers) {
        return;
    }

    const visiblePages =
        createVisiblePageList(
            resourceState.currentPage,
            totalPages
        );

    dom.paginationNumbers.innerHTML =
        visiblePages
            .map(
                function (pageItem) {

                    if (pageItem === "...") {

                        return `
                            <span
                                class="pagination-ellipsis"
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        `;

                    }

                    const isCurrentPage =
                        pageItem ===
                        resourceState.currentPage;

                    return `
                        <button
                            type="button"
                            class="pagination-number ${
                                isCurrentPage
                                    ? "active"
                                    : ""
                            }"
                            data-page="${pageItem}"
                            ${
                                isCurrentPage
                                    ? 'aria-current="page"'
                                    : ""
                            }
                            aria-label="Go to page ${pageItem}"
                        >
                            ${pageItem}
                        </button>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   46. CREATE VISIBLE PAGE LIST
========================================================= */

function createVisiblePageList(
    currentPage,
    totalPages
) {

    if (totalPages <= 7) {

        return Array.from(
            {
                length:
                    totalPages
            },
            function (
                unused,
                index
            ) {

                return index + 1;

            }
        );

    }

    if (currentPage <= 4) {

        return [
            1,
            2,
            3,
            4,
            5,
            "...",
            totalPages
        ];

    }

    if (
        currentPage >=
        totalPages - 3
    ) {

        return [
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
        ];

    }

    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
    ];

}


/* =========================================================
   47. RENDER ACTIVE FILTERS
========================================================= */

function renderActiveFilters() {

    if (
        !dom.activeFilters ||
        !dom.activeFilterTags
    ) {

        return;

    }

    const activeFilterItems =
        getActiveFilterItems();

    if (!activeFilterItems.length) {

        dom.activeFilters.hidden =
            true;

        dom.activeFilterTags.innerHTML =
            "";

        return;

    }

    dom.activeFilters.hidden =
        false;

    dom.activeFilterTags.innerHTML =
        activeFilterItems
            .map(
                function (filter) {

                    return `
                        <span class="active-filter-tag">

                            <span>
                                ${escapeHtml(filter.label)}
                            </span>

                            <button
                                type="button"
                                data-remove-filter="${escapeHtml(filter.key)}"
                                aria-label="Remove ${escapeHtml(filter.label)} filter"
                                title="Remove filter"
                            >

                                <i class="bi bi-x-lg"></i>

                            </button>

                        </span>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   48. ACTIVE FILTER ITEMS
========================================================= */

function getActiveFilterItems() {

    const items = [];

    if (
        resourceState.selectedResourceType &&
        resourceState.selectedResourceType !==
            "all"
    ) {

        items.push({

            key:
                "resourceType",

            label:
                getResourceTypeDetails(
                    resourceState.selectedResourceType
                ).label

        });

    }

    if (resourceState.filters.search) {

        items.push({

            key:
                "search",

            label:
                `Search: ${resourceState.filters.search}`

        });

    }

    if (resourceState.filters.mainCategory) {

        items.push({

            key:
                "mainCategory",

            label:
                formatFilterValueLabel(
                    "mainCategory",
                    resourceState.filters.mainCategory
                )

        });

    }

    if (resourceState.filters.educationLevel) {

        items.push({

            key:
                "educationLevel",

            label:
                formatEducationLevelLabel(
                    resourceState.filters.educationLevel
                )

        });

    }

    if (resourceState.filters.programExam) {

        items.push({

            key:
                "programExam",

            label:
                formatFilterValueLabel(
                    "programExam",
                    resourceState.filters.programExam
                )

        });

    }

    if (resourceState.filters.semester) {

        items.push({

            key:
                "semester",

            label:
                `Semester ${resourceState.filters.semester}`

        });

    }

    if (resourceState.filters.subject) {

        items.push({

            key:
                "subject",

            label:
                formatFilterValueLabel(
                    "subject",
                    resourceState.filters.subject
                )

        });

    }

    if (resourceState.filters.year) {

        items.push({

            key:
                "year",

            label:
                resourceState.filters.year

        });

    }

    if (resourceState.filters.language) {

        items.push({

            key:
                "language",

            label:
                formatLanguageLabel(
                    resourceState.filters.language
                )

        });

    }

    return items;

}


/* =========================================================
   49. ACTIVE FILTER REMOVE EVENT
========================================================= */

dom.activeFilterTags
    ?.addEventListener(
        "click",
        function (event) {

            const removeButton =
                event.target.closest(
                    "[data-remove-filter]"
                );

            if (!removeButton) {
                return;
            }

            const filterKey =
                cleanValue(
                    removeButton.dataset.removeFilter,
                    50
                );

            removeSingleFilter(
                filterKey
            );

        }
    );


/* =========================================================
   50. REMOVE SINGLE FILTER
========================================================= */

function removeSingleFilter(
    filterKey
) {

    switch (filterKey) {

        case "resourceType":

            setSelectedResourceType(
                "all"
            );

            break;


        case "search":

            resourceState.filters.search =
                "";

            if (dom.resourceSearchInput) {

                dom.resourceSearchInput.value =
                    "";

            }

            if (dom.heroSearchInput) {

                dom.heroSearchInput.value =
                    "";

            }

            break;


        case "mainCategory":

            resourceState.filters.mainCategory =
                "";

            if (dom.mainCategoryFilter) {

                dom.mainCategoryFilter.value =
                    "";

            }

            break;


        case "educationLevel":

            resourceState.filters.educationLevel =
                "";

            if (dom.educationLevelFilter) {

                dom.educationLevelFilter.value =
                    "";

            }

            break;


        case "programExam":

            resourceState.filters.programExam =
                "";

            if (dom.programExamFilter) {

                dom.programExamFilter.value =
                    "";

            }

            break;


        case "semester":

            resourceState.filters.semester =
                "";

            if (dom.semesterFilter) {

                dom.semesterFilter.value =
                    "";

            }

            break;


        case "subject":

            resourceState.filters.subject =
                "";

            if (dom.subjectFilter) {

                dom.subjectFilter.value =
                    "";

            }

            break;


        case "year":

            resourceState.filters.year =
                "";

            if (dom.yearFilter) {

                dom.yearFilter.value =
                    "";

            }

            break;


        case "language":

            resourceState.filters.language =
                "";

            if (dom.languageFilter) {

                dom.languageFilter.value =
                    "";

            }

            break;


        default:

            return;

    }

    updateFilterFieldStates();

    applyResourceFilters({
        resetPage:
            true
    });

}


/* =========================================================
   51. UPDATE RESOURCE STATISTICS
========================================================= */

function updateResourceStatistics() {

    const resources =
        resourceState.allResources;

    const totalResources =
        resources.length;

    const uniqueSubjects =
        new Set(
            resources
                .map(
                    function (resource) {

                        return (
                            resource.subject ||
                            resource.subjectLabel
                        );

                    }
                )
                .filter(Boolean)
        );

    const uniqueCategories =
        new Set(
            resources
                .map(
                    function (resource) {

                        return resource.mainCategory;

                    }
                )
                .filter(Boolean)
        );

    animateStatisticValue(
        dom.totalResourcesCount,
        totalResources
    );

    animateStatisticValue(
        dom.totalSubjectsCount,
        uniqueSubjects.size
    );

    animateStatisticValue(
        dom.totalCategoriesCount,
        uniqueCategories.size
    );

}


/* =========================================================
   52. ANIMATE STATISTIC VALUE
========================================================= */

function animateStatisticValue(
    element,
    finalValue
) {

    if (!element) {
        return;
    }

    const safeValue =
        Math.max(
            0,
            Number(finalValue) || 0
        );

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        element.textContent =
            formatCompactNumber(
                safeValue
            );

        return;

    }

    const duration =
        550;

    const startTime =
        performance.now();

    function updateCounter(
        currentTime
    ) {

        const progress =
            Math.min(
                1,
                (
                    currentTime -
                    startTime
                ) /
                duration
            );

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const currentValue =
            Math.round(
                safeValue *
                easedProgress
            );

        element.textContent =
            formatCompactNumber(
                currentValue
            );

        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        }

    }

    requestAnimationFrame(
        updateCounter
    );

}


/* =========================================================
   53. UPDATE FILTER FIELD STATES
========================================================= */

function updateFilterFieldStates() {

    const fieldMappings = [

        {
            element:
                dom.resourceSearchInput,

            value:
                dom.resourceSearchInput
                    ?.value
        },

        {
            element:
                dom.mainCategoryFilter,

            value:
                dom.mainCategoryFilter
                    ?.value
        },

        {
            element:
                dom.educationLevelFilter,

            value:
                dom.educationLevelFilter
                    ?.value
        },

        {
            element:
                dom.programExamFilter,

            value:
                dom.programExamFilter
                    ?.value
        },

        {
            element:
                dom.semesterFilter,

            value:
                dom.semesterFilter
                    ?.value
        },

        {
            element:
                dom.subjectFilter,

            value:
                dom.subjectFilter
                    ?.value
        },

        {
            element:
                dom.yearFilter,

            value:
                dom.yearFilter
                    ?.value
        },

        {
            element:
                dom.languageFilter,

            value:
                dom.languageFilter
                    ?.value
        }

    ];

    fieldMappings.forEach(
        function ({
            element,
            value
        }) {

            const filterGroup =
                element?.closest(
                    ".filter-group"
                );

            if (!filterGroup) {
                return;
            }

            filterGroup.classList.toggle(
                "has-value",
                Boolean(
                    cleanValue(
                        value,
                        200
                    )
                )
            );

        }
    );

}


/* =========================================================
   54. FORMAT FILTER VALUE LABEL
========================================================= */

function formatFilterValueLabel(
    filterType,
    value
) {

    const labelMaps = {

        mainCategory: {

            school:
                "School",

            college:
                "College",

            university:
                "University",

            "entry-test":
                "Entry Tests",

            "competitive-exam":
                "Competitive Exams",

            "government-job":
                "Government Jobs",

            forces:
                "Armed Forces",

            professional:
                "Professional Learning"

        },

        programExam: {

            "fsc-pre-medical":
                "FSc Pre-Medical",

            "fsc-pre-engineering":
                "FSc Pre-Engineering",

            ics:
                "ICS",

            icom:
                "ICom",

            fa:
                "FA",

            bscs:
                "BS Computer Science",

            bsse:
                "BS Software Engineering",

            bsit:
                "BS Information Technology",

            bsai:
                "BS Artificial Intelligence",

            bba:
                "BBA",

            psychology:
                "BS Psychology",

            english:
                "BS English",

            mdcat:
                "MDCAT",

            ecat:
                "ECAT",

            lat:
                "LAT",

            nts:
                "NTS",

            gat:
                "GAT",

            hat:
                "HAT",

            css:
                "CSS",

            pms:
                "PMS",

            fpsc:
                "FPSC",

            ppsc:
                "PPSC",

            spsc:
                "SPSC",

            kppsc:
                "KPPSC",

            bpsc:
                "BPSC",

            police:
                "Police",

            fia:
                "FIA",

            fbr:
                "FBR",

            asf:
                "ASF",

            "rescue-1122":
                "Rescue 1122",

            railways:
                "Pakistan Railways",

            army:
                "Pakistan Army",

            navy:
                "Pakistan Navy",

            "air-force":
                "Pakistan Air Force"

        },

        subject: {

            english:
                "English",

            urdu:
                "Urdu",

            mathematics:
                "Mathematics",

            physics:
                "Physics",

            chemistry:
                "Chemistry",

            biology:
                "Biology",

            "computer-science":
                "Computer Science",

            programming:
                "Programming",

            database:
                "Database",

            "software-engineering":
                "Software Engineering",

            "general-knowledge":
                "General Knowledge",

            "pakistan-studies":
                "Pakistan Studies",

            islamiyat:
                "Islamiyat",

            "current-affairs":
                "Current Affairs",

            "everyday-science":
                "Everyday Science"

        }

    };

    return (
        labelMaps[filterType]
            ?.[value] ||
        formatSlugLabel(
            value
        )
    );

}


/* =========================================================
   55. UPDATE STATS AFTER RESOURCE ACTION
========================================================= */

function refreshResourceAfterAction(
    resourceId
) {

    const card =
        dom.resourcesGrid
            ?.querySelector(
                `[data-resource-id="${CSS.escape(resourceId)}"]`
            );

    const resource =
        findResourceById(
            resourceId
        );

    if (
        !card ||
        !resource
    ) {

        return;

    }

    const viewsElement =
        card.querySelector(
            ".resource-meta-item.views"
        );

    const downloadsElement =
        card.querySelector(
            ".resource-meta-item.downloads"
        );

    if (viewsElement) {

        viewsElement.innerHTML = `

            <i class="bi bi-eye-fill"></i>

            ${formatCompactNumber(resource.views)}

            views

        `;

    }

    if (downloadsElement) {

        downloadsElement.innerHTML = `

            <i class="bi bi-download"></i>

            ${formatCompactNumber(resource.downloads)}

            downloads

        `;

    }

}


/* =========================================================
   END OF STUDY RESOURCES JAVASCRIPT — PART 2B

   NEXT PART WILL INCLUDE:
   - Complete preview reliability
   - Preview timeout/error handling
   - Download tracking
   - Bookmark persistence improvements
   - Internal and external resource support
========================================================= */