"use strict";

/* =========================================================
   JOBQUESTAI ADMIN — STUDY RESOURCES

   RESOURCES.JS — MODULE 1 OF 4

   Includes:
   - Firebase connection import
   - Application configuration
   - Application state
   - DOM references
   - DOM readiness
   - Admin navigation
   - Event binding foundation
   - Internal/external source switching
   - File selection UI
   - Form panel controls
   - Search/filter event foundation
   - General helper utilities

   IMPORTANT:
   The complete application starts in Module 4.
========================================================= */


import "../firebase.js";


/* =========================================================
   1. APPLICATION CONFIGURATION
========================================================= */

const RESOURCE_ADMIN_CONFIG = Object.freeze({

    collectionName:
        "study_resources",

    resourcesPerPage:
        10,

    searchDelay:
        250,

    maximumFileSize:
        30 * 1024 * 1024,

    acceptedFileMimeTypes: [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "image/jpeg",

        "image/png",

        "image/webp"

    ],

    acceptedFileExtensions: [

        ".pdf",

        ".doc",

        ".docx",

        ".jpg",

        ".jpeg",

        ".png",

        ".webp"

    ],

    defaultSourceType:
        "internal",

    defaultStatus:
        "published",

    defaultLanguage:
        "english",

    notificationDuration:
        3200,

    storageFolder:
        "study-resources",

    currentYear:
        new Date().getFullYear()

});


/* =========================================================
   2. APPLICATION STATE
========================================================= */

const resourceAdminState = {

    initialized:
        false,

    loading:
        false,

    saving:
        false,

    deleting:
        false,

    uploading:
        false,

    allResources:
        [],

    filteredResources:
        [],

    currentPage:
        1,

    resourcesPerPage:
        RESOURCE_ADMIN_CONFIG.resourcesPerPage,

    searchQuery:
        "",

    typeFilter:
        "",

    statusFilter:
        "",

    currentSourceType:
        RESOURCE_ADMIN_CONFIG.defaultSourceType,

    selectedResourceFile:
        null,

    editingResourceId:
        "",

    pendingDeleteResourceId:
        "",

    pendingDeleteStoragePath:
        "",

    searchTimer:
        null,

    uploadTask:
        null,

    activeObjectUrl:
        "",

    formMode:
        "create",
    uploadedFileUrl:
        "",
    uploadedFilePath:
        "",

};


/* =========================================================
   3. DOM REFERENCES
========================================================= */

const resourceAdminDom = {

    /* Layout */

    sidebar:
        document.querySelector(
            ".sidebar"
        ),

    menuBtn:
        document.getElementById(
            "menuBtn"
        ),

    closeSidebarBtn:
        document.getElementById(
            "closeSidebar"
        ),

    logoutBtn:
        document.getElementById(
            "logoutBtn"
        ),


    /* Statistics */

    totalResourcesCount:
        document.getElementById(
            "totalResourcesCount"
        ),

    internalResourcesCount:
        document.getElementById(
            "internalResourcesCount"
        ),

    externalResourcesCount:
        document.getElementById(
            "externalResourcesCount"
        ),

    publishedResourcesCount:
        document.getElementById(
            "publishedResourcesCount"
        ),


    /* Toolbar */

    resourceSearchInput:
        document.getElementById(
            "resourceSearchInput"
        ),

    resourceTypeFilter:
        document.getElementById(
            "resourceTypeFilter"
        ),

    resourceStatusFilter:
        document.getElementById(
            "resourceStatusFilter"
        ),

    openResourceFormBtn:
        document.getElementById(
            "openResourceFormBtn"
        ),

    emptyAddResourceBtn:
        document.getElementById(
            "emptyAddResourceBtn"
        ),


    /* Form panel */

    resourceFormPanel:
        document.getElementById(
            "resourceFormPanel"
        ),

    resourceForm:
        document.getElementById(
            "resourceForm"
        ),

    resourceFormTitle:
        document.getElementById(
            "resourceFormTitle"
        ),

    resourceDocumentId:
        document.getElementById(
            "resourceDocumentId"
        ),

    closeResourceFormBtn:
        document.getElementById(
            "closeResourceFormBtn"
        ),

    cancelResourceFormBtn:
        document.getElementById(
            "cancelResourceFormBtn"
        ),

    saveResourceBtn:
        document.getElementById(
            "saveResourceBtn"
        ),

    saveResourceBtnText:
        document.querySelector(
            "#saveResourceBtn span"
        ),


    /* Source type */

    sourceTypeInputs:
        document.querySelectorAll(
            'input[name="sourceType"]'
        ),

    internalResourceFields:
        document.getElementById(
            "internalResourceFields"
        ),

    externalResourceFields:
        document.getElementById(
            "externalResourceFields"
        ),


    /* Main fields */

    resourceTitle:
        document.getElementById(
            "resourceTitle"
        ),

    resourceDescription:
        document.getElementById(
            "resourceDescription"
        ),

    resourceType:
        document.getElementById(
            "resourceType"
        ),

    mainCategory:
        document.getElementById(
            "mainCategory"
        ),

    educationLevel:
        document.getElementById(
            "educationLevel"
        ),

    programExam:
        document.getElementById(
            "programExam"
        ),

    resourceSemester:
        document.getElementById(
            "resourceSemester"
        ),

    resourceSubject:
        document.getElementById(
            "resourceSubject"
        ),

    resourceSubjectLabel:
        document.getElementById(
            "resourceSubjectLabel"
        ),

    resourceYear:
        document.getElementById(
            "resourceYear"
        ),

    resourceLanguage:
        document.getElementById(
            "resourceLanguage"
        ),


    /* Internal resource fields */

    resourceFileInput:
        document.getElementById(
            "resourcePdfFile"
        ),

    selectedFileName:
        document.getElementById(
            "selectedPdfFileName"
        ),

    fileUploadBox:
        document.querySelector(
            ".file-upload-box"
        ),

    resourceFileUrl:
        document.getElementById(
            "resourceFileUrl"
        ),

    resourceFileSize:
        document.getElementById(
            "resourceFileSize"
        ),

    resourcePages:
        document.getElementById(
            "resourcePages"
        ),


    /* External resource fields */

    resourceExternalUrl:
        document.getElementById(
            "resourceExternalUrl"
        ),

    resourceSourceName:
        document.getElementById(
            "resourceSourceName"
        ),


    /* Publishing fields */

    resourceStatus:
        document.getElementById(
            "resourceStatus"
        ),

    resourceThumbnailUrl:
        document.getElementById(
            "resourceThumbnailUrl"
        ),

    resourceFeatured:
        document.getElementById(
            "resourceFeatured"
        ),

    resourceIsNew:
        document.getElementById(
            "resourceIsNew"
        ),


    /* Upload progress */

    resourceUploadProgress:
        document.getElementById(
            "resourceUploadProgress"
        ),

    resourceUploadPercent:
        document.getElementById(
            "resourceUploadPercent"
        ),

    resourceUploadProgressBar:
        document.getElementById(
            "resourceUploadProgressBar"
        ),


    /* Table */

    resourcesTableBody:
        document.getElementById(
            "resourcesTableBody"
        ),

    resourceTableSummary:
        document.getElementById(
            "resourceTableSummary"
        ),

    resourcesEmptyState:
        document.getElementById(
            "resourcesEmptyState"
        ),


    /* Delete modal */

    deleteResourceModal:
        document.getElementById(
            "deleteResourceModal"
        ),

    cancelDeleteResourceBtn:
        document.getElementById(
            "cancelDeleteResourceBtn"
        ),

    confirmDeleteResourceBtn:
        document.getElementById(
            "confirmDeleteResourceBtn"
        ),

    deleteModalBackdrop:
        document.querySelector(
            "[data-close-delete-modal]"
        )

};


/* =========================================================
   4. REQUIRED ELEMENT VALIDATION
========================================================= */

function validateResourceAdminElements() {

    const requiredElements = {

        resourceForm:
            resourceAdminDom.resourceForm,

        resourceFormPanel:
            resourceAdminDom.resourceFormPanel,

        resourcesTableBody:
            resourceAdminDom.resourcesTableBody,

        resourceSearchInput:
            resourceAdminDom.resourceSearchInput,

        resourceTypeFilter:
            resourceAdminDom.resourceTypeFilter,

        resourceStatusFilter:
            resourceAdminDom.resourceStatusFilter,

        resourceTitle:
            resourceAdminDom.resourceTitle,

        resourceDescription:
            resourceAdminDom.resourceDescription,

        resourceType:
            resourceAdminDom.resourceType,

        mainCategory:
            resourceAdminDom.mainCategory,

        resourceSubject:
            resourceAdminDom.resourceSubject,

        resourceSubjectLabel:
            resourceAdminDom.resourceSubjectLabel,

        saveResourceBtn:
            resourceAdminDom.saveResourceBtn

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
            `Missing resources page elements: ${missingElements.join(", ")}`
        );

    }

}


/* =========================================================
   5. DOM READY BOOTSTRAP

   startResourceAdminApplication() is defined in Module 4.
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            typeof startResourceAdminApplication ===
            "function"
        ) {

            startResourceAdminApplication();

            return;

        }

        console.info(
            "Resources Admin modules are not complete yet. " +
            "Paste Modules 2, 3 and 4 before testing the page."
        );

    }
);


/* =========================================================
   6. COMMON EVENT BINDING
========================================================= */

function bindResourceAdminEvents() {

    bindAdminNavigationEvents();

    bindResourceFormPanelEvents();

    bindSourceTypeEvents();

    bindResourceFileEvents();

    bindResourceSearchAndFilterEvents();

    bindResourceTableEvents();

    bindDeleteModalEvents();

    bindKeyboardEvents();

}


/* =========================================================
   7. ADMIN NAVIGATION EVENTS
========================================================= */

function bindAdminNavigationEvents() {

    resourceAdminDom.menuBtn
        ?.addEventListener(
            "click",
            function () {

                resourceAdminDom.sidebar
                    ?.classList.add(
                        "show"
                    );

            }
        );


    resourceAdminDom.closeSidebarBtn
        ?.addEventListener(
            "click",
            closeAdminSidebar
        );


    document.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth >
                900
            ) {

                return;

            }

            const clickedInsideSidebar =
                event.target.closest(
                    ".sidebar"
                );

            const clickedMenuButton =
                event.target.closest(
                    "#menuBtn"
                );

            if (
                !clickedInsideSidebar &&
                !clickedMenuButton
            ) {

                closeAdminSidebar();

            }

        }
    );


    resourceAdminDom.logoutBtn
        ?.addEventListener(
            "click",
            handleAdminLogout
        );

}


/* =========================================================
   8. ADMIN LOGOUT
========================================================= */

async function handleAdminLogout() {

    const shouldLogout =
        window.confirm(
            "Are you sure you want to logout?"
        );

    if (!shouldLogout) {

        return;

    }

    try {

        if (
            window.auth &&
            typeof window.signOut ===
                "function"
        ) {

            await window.signOut(
                window.auth
            );

        }

    } catch (error) {

        console.warn(
            "Firebase logout warning:",
            error
        );

    } finally {

        localStorage.removeItem(
            "user"
        );

        sessionStorage.removeItem(
            "user"
        );

        window.location.href =
            "../index.html";

    }

}


/* =========================================================
   9. CLOSE ADMIN SIDEBAR
========================================================= */

function closeAdminSidebar() {

    resourceAdminDom.sidebar
        ?.classList.remove(
            "show"
        );

}


/* =========================================================
   10. FORM PANEL EVENTS
========================================================= */

function bindResourceFormPanelEvents() {

    resourceAdminDom.openResourceFormBtn
        ?.addEventListener(
            "click",
            openCreateResourceForm
        );


    resourceAdminDom.emptyAddResourceBtn
        ?.addEventListener(
            "click",
            openCreateResourceForm
        );


    resourceAdminDom.closeResourceFormBtn
        ?.addEventListener(
            "click",
            closeResourceFormPanel
        );


    resourceAdminDom.cancelResourceFormBtn
        ?.addEventListener(
            "click",
            closeResourceFormPanel
        );


    resourceAdminDom.resourceForm
        ?.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (
                    typeof handleResourceFormSubmit ===
                    "function"
                ) {

                    handleResourceFormSubmit(
                        event
                    );

                }

            }
        );

}


/* =========================================================
   11. OPEN CREATE FORM
========================================================= */

function openCreateResourceForm() {

    resetResourceForm();

    resourceAdminState.formMode =
        "create";

    resourceAdminState.editingResourceId =
        "";

    if (
        resourceAdminDom.resourceFormTitle
    ) {

        resourceAdminDom.resourceFormTitle.textContent =
            "Add New Resource";

    }

    if (
        resourceAdminDom.saveResourceBtnText
    ) {

        resourceAdminDom.saveResourceBtnText.textContent =
            "Publish Resource";

    }

    resourceAdminDom.resourceFormPanel.hidden =
        false;

    setResourceSourceType(
        RESOURCE_ADMIN_CONFIG.defaultSourceType
    );

    window.requestAnimationFrame(
        function () {

            resourceAdminDom.resourceFormPanel
                ?.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            resourceAdminDom.resourceTitle
                ?.focus();

        }
    );

}


/* =========================================================
   12. CLOSE FORM PANEL
========================================================= */

/* Early closeResourceFormPanel removed; enhanced version is defined in Module 3B. */


/* =========================================================
   13. SOURCE TYPE EVENTS
========================================================= */

function bindSourceTypeEvents() {

    resourceAdminDom.sourceTypeInputs
        ?.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        if (!input.checked) {

                            return;

                        }

                        setResourceSourceType(
                            input.value
                        );

                    }
                );

            }
        );

}


/* =========================================================
   14. SET RESOURCE SOURCE TYPE
========================================================= */

function setResourceSourceType(
    sourceType
) {

    const normalizedSourceType =
        sourceType ===
        "external"
            ? "external"
            : "internal";

    resourceAdminState.currentSourceType =
        normalizedSourceType;

    resourceAdminDom.sourceTypeInputs
        ?.forEach(
            function (input) {

                input.checked =
                    input.value ===
                    normalizedSourceType;

            }
        );

    if (
        resourceAdminDom.internalResourceFields
    ) {

        resourceAdminDom.internalResourceFields.hidden =
            normalizedSourceType !==
            "internal";

    }

    if (
        resourceAdminDom.externalResourceFields
    ) {

        resourceAdminDom.externalResourceFields.hidden =
            normalizedSourceType !==
            "external";

    }

    updateSourceSpecificRequirements();

}


/* =========================================================
   15. SOURCE-SPECIFIC REQUIREMENTS
========================================================= */

function updateSourceSpecificRequirements() {

    const isInternal =
        resourceAdminState.currentSourceType ===
        "internal";

    if (
        resourceAdminDom.resourceExternalUrl
    ) {

        resourceAdminDom.resourceExternalUrl.required =
            !isInternal;

    }

    if (
        resourceAdminDom.resourceSourceName
    ) {

        resourceAdminDom.resourceSourceName.required =
            !isInternal;

    }

    clearFieldError(
        resourceAdminDom.resourceFileUrl
    );

    clearFieldError(
        resourceAdminDom.resourceExternalUrl
    );

    clearFieldError(
        resourceAdminDom.resourceSourceName
    );

}


/* =========================================================
   16. RESOURCE FILE EVENTS
========================================================= */

function bindResourceFileEvents() {

    resourceAdminDom.resourceFileInput
        ?.addEventListener(
            "change",
            function (event) {

                const selectedFile =
                    event.target.files?.[0] ||
                    null;

                handleSelectedResourceFile(
                    selectedFile
                );

            }
        );


    const uploadBox =
        resourceAdminDom.fileUploadBox;

    if (!uploadBox) {

        return;

    }

    [
        "dragenter",
        "dragover"
    ].forEach(
        function (eventName) {

            uploadBox.addEventListener(
                eventName,
                function (event) {

                    event.preventDefault();

                    uploadBox.classList.add(
                        "drag-active"
                    );

                }
            );

        }
    );


    [
        "dragleave",
        "drop"
    ].forEach(
        function (eventName) {

            uploadBox.addEventListener(
                eventName,
                function (event) {

                    event.preventDefault();

                    uploadBox.classList.remove(
                        "drag-active"
                    );

                }
            );

        }
    );


    uploadBox.addEventListener(
        "drop",
        function (event) {

            const droppedFile =
                event.dataTransfer
                    ?.files?.[0] ||
                null;

            if (!droppedFile) {

                return;

            }

            handleSelectedResourceFile(
                droppedFile
            );

        }
    );

}


/* =========================================================
   17. HANDLE SELECTED RESOURCE FILE
========================================================= */

function handleSelectedResourceFile(
    file
) {

    if (!file) {

        clearSelectedResourceFile();

        return;

    }

    const validationResult =
        validateSelectedResourceFile(
            file
        );

    if (!validationResult.valid) {

        clearSelectedResourceFile();

        showAdminNotification(
            validationResult.message,
            "error"
        );

        return;

    }

    resourceAdminState.selectedResourceFile =
        file;

    if (
        resourceAdminDom.selectedFileName
    ) {

        resourceAdminDom.selectedFileName.textContent =
            `${file.name} • ${formatFileSize(file.size)}`;

    }

    resourceAdminDom.fileUploadBox
        ?.classList.add(
            "has-file"
        );

    if (
        resourceAdminDom.resourceFileSize
    ) {

        resourceAdminDom.resourceFileSize.value =
            formatFileSize(
                file.size
            );

    }

}


/* =========================================================
   18. VALIDATE SELECTED RESOURCE FILE
========================================================= */

function validateSelectedResourceFile(
    file
) {

    if (!file) {

        return {
            valid: false,
            message: "Please select a resource file."
        };

    }

    const fileName =
        String(
            file.name || ""
        ).toLowerCase();

    const extension =
        getResourceFileExtension(
            fileName
        );

    const extensionValid =
        RESOURCE_ADMIN_CONFIG
            .acceptedFileExtensions
            .includes(
                extension
            );

    const mimeType =
        cleanAdminValue(
            file.type,
            180
        ).toLowerCase();

    const mimeTypeValid =
        !mimeType ||
        RESOURCE_ADMIN_CONFIG
            .acceptedFileMimeTypes
            .includes(
                mimeType
            );

    if (
        !extensionValid ||
        !mimeTypeValid
    ) {

        return {
            valid: false,
            message:
                "Supported files are PDF, DOC, DOCX, JPG, JPEG, PNG and WEBP."
        };

    }

    if (
        file.size <= 0
    ) {

        return {
            valid: false,
            message: "The selected file is empty."
        };

    }

    if (
        file.size >
        RESOURCE_ADMIN_CONFIG.maximumFileSize
    ) {

        return {
            valid: false,
            message: "File size must not exceed 30 MB."
        };

    }

    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   19. CLEAR SELECTED RESOURCE FILE
========================================================= */

function clearSelectedResourceFile() {

    resourceAdminState.selectedResourceFile =
        null;

    resourceAdminState.uploadedFileUrl =
        "";

    resourceAdminState.uploadedFilePath =
        "";

    if (
        resourceAdminDom.resourceFileInput
    ) {

        resourceAdminDom.resourceFileInput.value =
            "";

    }

    if (
        resourceAdminDom.selectedFileName
    ) {

        resourceAdminDom.selectedFileName.textContent =
            "No file selected";

    }

    resourceAdminDom.fileUploadBox
        ?.classList.remove(
            "has-file"
        );

}


/* =========================================================
   19A. GET RESOURCE FILE EXTENSION
========================================================= */

function getResourceFileExtension(
    fileName
) {

    const normalizedName =
        cleanAdminValue(
            fileName,
            500
        ).toLowerCase();

    const lastDotIndex =
        normalizedName.lastIndexOf(
            "."
        );

    if (
        lastDotIndex < 0
    ) {

        return "";

    }

    return normalizedName.slice(
        lastDotIndex
    );

}


/* =========================================================
   19B. GET RESOURCE FILE CATEGORY
========================================================= */

function getResourceFileCategory(
    file
) {

    const extension =
        getResourceFileExtension(
            file?.name || ""
        );

    if (
        extension === ".pdf"
    ) {

        return "pdf";

    }

    if (
        extension === ".doc" ||
        extension === ".docx"
    ) {

        return "word";

    }

    if (
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

    return "file";

}


/* =========================================================
   19C. GET RESOURCE FILE MIME TYPE
========================================================= */

function getResourceFileMimeType(
    file
) {

    const browserMimeType =
        cleanAdminValue(
            file?.type,
            180
        ).toLowerCase();

    if (browserMimeType) {

        return browserMimeType;

    }

    const extension =
        getResourceFileExtension(
            file?.name || ""
        );

    const mimeTypes = {

        ".pdf":
            "application/pdf",

        ".doc":
            "application/msword",

        ".docx":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        ".jpg":
            "image/jpeg",

        ".jpeg":
            "image/jpeg",

        ".png":
            "image/png",

        ".webp":
            "image/webp"

    };

    return (
        mimeTypes[extension] ||
        "application/octet-stream"
    );

}


/* =========================================================
   19D. INFER CATEGORY FOR OLD FIRESTORE RECORDS
========================================================= */

function inferResourceFileCategory(
    resource
) {

    if (
        normalizeAdminSlug(
            resource?.sourceType
        ) === "external"
    ) {

        return "external";

    }

    const mimeType =
        cleanAdminValue(
            resource?.mimeType,
            180
        ).toLowerCase();

    const extension =
        cleanAdminValue(
            resource?.fileExtension,
            20
        ).toLowerCase();

    const fileUrl =
        cleanAdminValue(
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
        mimeType.includes("word") ||
        mimeType.includes("wordprocessingml") ||
        extension === ".doc" ||
        extension === ".docx"
    ) {

        return "word";

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

    return "file";

}


/* =========================================================
   20. SEARCH AND FILTER EVENTS
========================================================= */

function bindResourceSearchAndFilterEvents() {

    resourceAdminDom.resourceSearchInput
        ?.addEventListener(
            "input",
            function (event) {

                window.clearTimeout(
                    resourceAdminState.searchTimer
                );

                resourceAdminState.searchTimer =
                    window.setTimeout(
                        function () {

                            resourceAdminState.searchQuery =
                                cleanAdminValue(
                                    event.target.value,
                                    200
                                ).toLowerCase();

                            resourceAdminState.currentPage =
                                1;

                            if (
                                typeof applyAdminResourceFilters ===
                                "function"
                            ) {

                                applyAdminResourceFilters();

                            }

                        },
                        RESOURCE_ADMIN_CONFIG.searchDelay
                    );

            }
        );


    resourceAdminDom.resourceTypeFilter
        ?.addEventListener(
            "change",
            function (event) {

                resourceAdminState.typeFilter =
                    normalizeAdminSlug(
                        event.target.value
                    );

                resourceAdminState.currentPage =
                    1;

                if (
                    typeof applyAdminResourceFilters ===
                    "function"
                ) {

                    applyAdminResourceFilters();

                }

            }
        );


    resourceAdminDom.resourceStatusFilter
        ?.addEventListener(
            "change",
            function (event) {

                resourceAdminState.statusFilter =
                    normalizeAdminSlug(
                        event.target.value
                    );

                resourceAdminState.currentPage =
                    1;

                if (
                    typeof applyAdminResourceFilters ===
                    "function"
                ) {

                    applyAdminResourceFilters();

                }

            }
        );

}


/* =========================================================
   21. TABLE EVENT DELEGATION
========================================================= */

function bindResourceTableEvents() {

    resourceAdminDom.resourcesTableBody
        ?.addEventListener(
            "click",
            function (event) {

                const actionButton =
                    event.target.closest(
                        "[data-resource-admin-action]"
                    );

                if (!actionButton) {

                    return;

                }

                const action =
                    cleanAdminValue(
                        actionButton.dataset
                            .resourceAdminAction,
                        40
                    );

                const resourceId =
                    cleanAdminValue(
                        actionButton.dataset
                            .resourceId,
                        140
                    );

                if (
                    typeof handleAdminResourceAction ===
                    "function"
                ) {

                    handleAdminResourceAction(
                        action,
                        resourceId,
                        actionButton
                    );

                }

            }
        );

}


/* =========================================================
   22. DELETE MODAL EVENTS
========================================================= */

function bindDeleteModalEvents() {

    resourceAdminDom.cancelDeleteResourceBtn
        ?.addEventListener(
            "click",
            closeDeleteResourceModal
        );


    resourceAdminDom.deleteModalBackdrop
        ?.addEventListener(
            "click",
            closeDeleteResourceModal
        );


    resourceAdminDom.confirmDeleteResourceBtn
        ?.addEventListener(
            "click",
            function () {

                if (
                    typeof confirmResourceDeletion ===
                    "function"
                ) {

                    confirmResourceDeletion();

                }

            }
        );

}


/* =========================================================
   23. KEYBOARD EVENTS
========================================================= */

function bindKeyboardEvents() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }

            if (
                !resourceAdminDom
                    .deleteResourceModal
                    ?.hidden
            ) {

                closeDeleteResourceModal();

                return;

            }

            if (
                resourceAdminDom
                    .resourceFormPanel &&
                !resourceAdminDom
                    .resourceFormPanel
                    .hidden
            ) {

                closeResourceFormPanel();

            }

        }
    );

}


/* =========================================================
   24. RESET RESOURCE FORM
========================================================= */

function resetResourceForm() {

    resourceAdminDom.resourceForm
        ?.reset();

    resourceAdminState.currentSourceType =
        RESOURCE_ADMIN_CONFIG.defaultSourceType;

    resourceAdminState.selectedResourceFile =
        null;

    resourceAdminState.editingResourceId =
        "";

    resourceAdminState.formMode =
        "create";

    if (
        resourceAdminDom.resourceDocumentId
    ) {

        resourceAdminDom.resourceDocumentId.value =
            "";

    }

    if (
        resourceAdminDom.resourceStatus
    ) {

        resourceAdminDom.resourceStatus.value =
            RESOURCE_ADMIN_CONFIG.defaultStatus;

    }

    if (
        resourceAdminDom.resourceLanguage
    ) {

        resourceAdminDom.resourceLanguage.value =
            RESOURCE_ADMIN_CONFIG.defaultLanguage;

    }

    if (
        resourceAdminDom.resourceYear
    ) {

        resourceAdminDom.resourceYear.value =
            String(
                RESOURCE_ADMIN_CONFIG.currentYear
            );

    }

    if (
        resourceAdminDom.resourceIsNew
    ) {

        resourceAdminDom.resourceIsNew.checked =
            true;

    }

    if (
        resourceAdminDom.resourceFeatured
    ) {

        resourceAdminDom.resourceFeatured.checked =
            false;

    }

    clearSelectedResourceFile();

    resetUploadProgress();

    clearAllFormErrors();

    setResourceSourceType(
        RESOURCE_ADMIN_CONFIG.defaultSourceType
    );

    setResourceFormBusy(
        false
    );

}


/* =========================================================
   25. FORM BUSY STATE
========================================================= */

function setResourceFormBusy(
    busy
) {

    const isBusy =
        Boolean(busy);

    resourceAdminState.saving =
        isBusy;

    resourceAdminDom.resourceForm
        ?.classList.toggle(
            "is-busy",
            isBusy
        );

    resourceAdminDom.saveResourceBtn
        ?.classList.toggle(
            "is-loading",
            isBusy
        );

    if (
        resourceAdminDom.saveResourceBtn
    ) {

        resourceAdminDom.saveResourceBtn.disabled =
            isBusy;

    }

    if (
        resourceAdminDom.cancelResourceFormBtn
    ) {

        resourceAdminDom.cancelResourceFormBtn.disabled =
            isBusy;

    }

    if (
        resourceAdminDom.closeResourceFormBtn
    ) {

        resourceAdminDom.closeResourceFormBtn.disabled =
            isBusy;

    }

}


/* =========================================================
   26. UPLOAD PROGRESS
========================================================= */

function updateUploadProgress(
    percentage
) {

    const safePercentage =
        Math.max(
            0,
            Math.min(
                100,
                Number(percentage) || 0
            )
        );

    if (
        resourceAdminDom.resourceUploadProgress
    ) {

        resourceAdminDom.resourceUploadProgress.hidden =
            false;

        resourceAdminDom.resourceUploadProgress
            .classList.remove(
                "is-error"
            );

    }

    if (
        resourceAdminDom.resourceUploadPercent
    ) {

        resourceAdminDom.resourceUploadPercent.textContent =
            `${Math.round(safePercentage)}%`;

    }

    if (
        resourceAdminDom.resourceUploadProgressBar
    ) {

        resourceAdminDom.resourceUploadProgressBar.style.width =
            `${safePercentage}%`;

    }

}


/* =========================================================
   27. RESET UPLOAD PROGRESS
========================================================= */

function resetUploadProgress() {

    if (
        resourceAdminDom.resourceUploadProgress
    ) {

        resourceAdminDom.resourceUploadProgress.hidden =
            true;

        resourceAdminDom.resourceUploadProgress
            .classList.remove(
                "is-error"
            );

    }

    if (
        resourceAdminDom.resourceUploadPercent
    ) {

        resourceAdminDom.resourceUploadPercent.textContent =
            "0%";

    }

    if (
        resourceAdminDom.resourceUploadProgressBar
    ) {

        resourceAdminDom.resourceUploadProgressBar.style.width =
            "0%";

    }

}


/* =========================================================
   28. FORM ERROR HELPERS
========================================================= */

function setFieldError(
    field,
    message
) {

    if (!field) {

        return;

    }

    const formGroup =
        field.closest(
            ".form-group"
        );

    if (!formGroup) {

        return;

    }

    formGroup.classList.add(
        "has-error"
    );

    formGroup.classList.remove(
        "has-success"
    );

    const errorElement =
        formGroup.querySelector(
            ".field-error"
        );

    if (errorElement) {

        errorElement.textContent =
            cleanAdminValue(
                message,
                240
            );

    }

}


/* =========================================================
   29. CLEAR FIELD ERROR
========================================================= */

function clearFieldError(
    field
) {

    if (!field) {

        return;

    }

    const formGroup =
        field.closest(
            ".form-group"
        );

    if (!formGroup) {

        return;

    }

    formGroup.classList.remove(
        "has-error"
    );

    const errorElement =
        formGroup.querySelector(
            ".field-error"
        );

    if (errorElement) {

        errorElement.textContent =
            "";

    }

}


/* =========================================================
   30. CLEAR ALL FORM ERRORS
========================================================= */

function clearAllFormErrors() {

    resourceAdminDom.resourceForm
        ?.querySelectorAll(
            ".form-group"
        )
        .forEach(
            function (formGroup) {

                formGroup.classList.remove(
                    "has-error",
                    "has-success"
                );

                const errorElement =
                    formGroup.querySelector(
                        ".field-error"
                    );

                if (errorElement) {

                    errorElement.textContent =
                        "";

                }

            }
        );

}


/* =========================================================
   31. DELETE MODAL BASE CONTROLS
========================================================= */

function openDeleteResourceModal(
    resourceId,
    storagePath = ""
) {

    resourceAdminState.pendingDeleteResourceId =
        cleanAdminValue(
            resourceId,
            140
        );

    resourceAdminState.pendingDeleteStoragePath =
        cleanAdminValue(
            storagePath,
            600
        );

    if (
        !resourceAdminState
            .pendingDeleteResourceId
    ) {

        return;

    }

    resourceAdminDom.deleteResourceModal.hidden =
        false;

    document.body.classList.add(
        "admin-modal-open"
    );

    window.setTimeout(
        function () {

            resourceAdminDom
                .confirmDeleteResourceBtn
                ?.focus();

        },
        50
    );

}


/* =========================================================
   32. CLOSE DELETE MODAL
========================================================= */

function closeDeleteResourceModal() {

    if (
        resourceAdminState.deleting
    ) {

        return;

    }

    resourceAdminState.pendingDeleteResourceId =
        "";

    resourceAdminState.pendingDeleteStoragePath =
        "";

    if (
        resourceAdminDom.deleteResourceModal
    ) {

        resourceAdminDom.deleteResourceModal.hidden =
            true;

    }

    document.body.classList.remove(
        "admin-modal-open"
    );

}


/* =========================================================
   33. BASIC VALUE CLEANER
========================================================= */

function cleanAdminValue(
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


/* =========================================================
   34. SLUG NORMALIZER
========================================================= */

function normalizeAdminSlug(
    value
) {

    return cleanAdminValue(
        value,
        140
    )
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

}


/* =========================================================
   35. SAFE HTML
========================================================= */

function escapeAdminHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   36. FORMAT FILE SIZE
========================================================= */

function formatFileSize(
    sizeInBytes
) {

    const bytes =
        Math.max(
            0,
            Number(sizeInBytes) || 0
        );

    if (bytes === 0) {

        return "0 Bytes";

    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const unitIndex =
        Math.min(
            units.length - 1,
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            )
        );

    const size =
        bytes /
        Math.pow(
            1024,
            unitIndex
        );

    return `${size.toFixed(
        unitIndex === 0
            ? 0
            : 1
    )} ${units[unitIndex]}`;

}


/* =========================================================
   37. SAFE URL
========================================================= */

function cleanAdminUrl(
    value
) {

    const rawUrl =
        cleanAdminValue(
            value,
            2200
        );

    if (!rawUrl) {

        return "";

    }

    try {

        const url =
            new URL(
                rawUrl,
                window.location.href
            );

        if (
            ![
                "http:",
                "https:"
            ].includes(
                url.protocol
            )
        ) {

            return "";

        }

        return url.href;

    } catch {

        return "";

    }

}


/* =========================================================
   38. FORMAT SLUG LABEL
========================================================= */

function formatAdminSlugLabel(
    value
) {

    return normalizeAdminSlug(
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


/* =========================================================
   39. FIND RESOURCE
========================================================= */

function findAdminResourceById(
    resourceId
) {

    return (
        resourceAdminState
            .allResources
            .find(
                function (resource) {

                    return (
                        resource.id ===
                        resourceId
                    );

                }
            ) ||
        null
    );

}


/* =========================================================
   40. SIMPLE ADMIN NOTIFICATION

   CSS for this notification will be appended in Module 4.
========================================================= */

function showAdminNotification(
    message,
    type = "success"
) {

    const existingNotification =
        document.querySelector(
            ".admin-resource-notification"
        );

    existingNotification?.remove();

    const notification =
        document.createElement(
            "div"
        );

    notification.className =
        `admin-resource-notification ${type}`;

    notification.setAttribute(
        "role",
        type === "error"
            ? "alert"
            : "status"
    );

    notification.innerHTML = `

        <i class="fa-solid ${
            type === "error"
                ? "fa-circle-exclamation"
                : type === "warning"
                    ? "fa-triangle-exclamation"
                    : "fa-circle-check"
        }"></i>

        <span>
            ${escapeAdminHtml(message)}
        </span>

    `;

    document.body.appendChild(
        notification
    );

    window.requestAnimationFrame(
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
                240
            );

        },
        RESOURCE_ADMIN_CONFIG.notificationDuration
    );

}


/* =========================================================
   END OF RESOURCES.JS — MODULE 1 OF 4

   MODULE 2 WILL INCLUDE:
   - Complete form validation
   - Resource data collection
   - Firestore create
   - Firestore update
   - Internal resource handling
   - External resource handling
   - Save workflow
========================================================= */



/* =========================================================
   RESOURCES.JS — RECOVERED MODULE 2A
   Validation, data collection and normalization
========================================================= */

async function handleResourceFormSubmit(event) {
    event?.preventDefault();
    if (resourceAdminState.saving || resourceAdminState.uploading) return;

    clearAllFormErrors();
    const result = validateResourceForm();
    if (!result.valid) {
        showAdminNotification(result.message || "Please correct the highlighted fields.", "error");
        result.firstInvalidField?.focus();
        result.firstInvalidField?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const data = collectResourceFormData();
    await saveResourceRecord(data);
}

function validateResourceForm() {
    const errors = [];
    const title = cleanAdminValue(resourceAdminDom.resourceTitle?.value, 220);
    const description = cleanAdminValue(resourceAdminDom.resourceDescription?.value, 900);
    const type = normalizeAdminSlug(resourceAdminDom.resourceType?.value);
    const category = normalizeAdminSlug(resourceAdminDom.mainCategory?.value);
    const subject = normalizeAdminSlug(resourceAdminDom.resourceSubject?.value);
    const subjectLabel = cleanAdminValue(resourceAdminDom.resourceSubjectLabel?.value, 120);

    if (title.length < 5) registerValidationError(errors, resourceAdminDom.resourceTitle, "Resource title must contain at least 5 characters.");
    if (description.length < 20) registerValidationError(errors, resourceAdminDom.resourceDescription, "Description must contain at least 20 characters.");
    if (!type) registerValidationError(errors, resourceAdminDom.resourceType, "Please select a resource type.");
    if (!category) registerValidationError(errors, resourceAdminDom.mainCategory, "Please select a main category.");
    if (!subject || !isValidSlugValue(subject)) registerValidationError(errors, resourceAdminDom.resourceSubject, "Enter a valid subject key, for example physics or general-knowledge.");
    if (!subjectLabel) registerValidationError(errors, resourceAdminDom.resourceSubjectLabel, "Subject display name is required.");

    validateResourceYear(errors);
    validateResourcePages(errors);
    validateOptionalUrlField(resourceAdminDom.resourceThumbnailUrl, errors, "Enter a valid thumbnail URL.");

    if (resourceAdminState.currentSourceType === "internal") validateInternalResourceFields(errors);
    else validateExternalResourceFields(errors);

    markValidCompletedFields();
    return { valid: errors.length === 0, errors, firstInvalidField: errors[0]?.field || null, message: errors[0]?.message || "" };
}

function registerValidationError(errors, field, message) {
    if (!field) return;
    const safeMessage = cleanAdminValue(message, 240);
    errors.push({ field, message: safeMessage });
    setFieldError(field, safeMessage);
}

function validateInternalResourceFields(errors) {
    const selectedFile = resourceAdminState.selectedResourceFile;
    const enteredUrl = cleanAdminUrl(resourceAdminDom.resourceFileUrl?.value);
    const existing = findAdminResourceById(resourceAdminState.editingResourceId);
    const existingUrl = cleanAdminUrl(existing?.fileUrl);
    if (!selectedFile && !enteredUrl && !existingUrl) {
        registerValidationError(errors, resourceAdminDom.resourceFileUrl, "Select a resource file or provide an existing public file URL.");
    }
    if (selectedFile) {
        const check = validateSelectedResourceFile(selectedFile);
        if (!check.valid) registerValidationError(errors, resourceAdminDom.resourceFileUrl, check.message);
    }
    const raw = cleanAdminValue(resourceAdminDom.resourceFileUrl?.value, 2200);
    if (raw && !enteredUrl) registerValidationError(errors, resourceAdminDom.resourceFileUrl, "Enter a valid public file URL beginning with http:// or https://.");
}

function validateExternalResourceFields(errors) {
    const rawUrl = cleanAdminValue(resourceAdminDom.resourceExternalUrl?.value, 2200);
    const url = cleanAdminUrl(rawUrl);
    const sourceName = cleanAdminValue(resourceAdminDom.resourceSourceName?.value, 120);
    if (!url) registerValidationError(errors, resourceAdminDom.resourceExternalUrl, "Enter a valid official resource URL.");
    if (sourceName.length < 3) registerValidationError(errors, resourceAdminDom.resourceSourceName, "Official source name is required.");
    validateExternalSourceTrust(errors);
}

function validateResourceYear(errors) {
    const raw = cleanAdminValue(resourceAdminDom.resourceYear?.value, 10);
    if (!raw) return;
    const year = Number.parseInt(raw, 10);
    if (!Number.isInteger(year) || year < 1990 || year > 2100) registerValidationError(errors, resourceAdminDom.resourceYear, "Year must be between 1990 and 2100.");
}

function validateResourcePages(errors) {
    const raw = cleanAdminValue(resourceAdminDom.resourcePages?.value, 20);
    if (!raw) return;
    const pages = Number.parseInt(raw, 10);
    if (!Number.isInteger(pages) || pages < 0 || pages > 20000) registerValidationError(errors, resourceAdminDom.resourcePages, "Pages must be between 0 and 20,000.");
}

function validateOptionalUrlField(field, errors, message) {
    const raw = cleanAdminValue(field?.value, 2200);
    if (raw && !cleanAdminUrl(raw)) registerValidationError(errors, field, message);
}

function markValidCompletedFields() {
    [resourceAdminDom.resourceTitle, resourceAdminDom.resourceDescription, resourceAdminDom.resourceType, resourceAdminDom.mainCategory, resourceAdminDom.resourceSubject, resourceAdminDom.resourceSubjectLabel].forEach((field) => {
        const group = field?.closest(".form-group");
        if (group && !group.classList.contains("has-error") && cleanAdminValue(field.value, 900)) group.classList.add("has-success");
    });
}

function isValidSlugValue(value) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanAdminValue(value, 140));
}

function collectResourceFormData() {

    const editing =
        findAdminResourceById(
            resourceAdminState.editingResourceId
        );

    const selectedFile =
        resourceAdminState.selectedResourceFile;

    const sourceType =
        resourceAdminState.currentSourceType === "external"
            ? "external"
            : "internal";

    const title =
        cleanAdminValue(
            resourceAdminDom.resourceTitle?.value,
            220
        );

    const subjectLabel =
        cleanAdminValue(
            resourceAdminDom.resourceSubjectLabel?.value,
            120
        );

    const data = {

        title,

        titleLowercase:
            title.toLowerCase(),

        description:
            cleanAdminValue(
                resourceAdminDom.resourceDescription?.value,
                900
            ),

        resourceType:
            normalizeAdminSlug(
                resourceAdminDom.resourceType?.value
            ) || "notes",

        mainCategory:
            normalizeAdminSlug(
                resourceAdminDom.mainCategory?.value
            ),

        educationLevel:
            normalizeAdminSlug(
                resourceAdminDom.educationLevel?.value
            ),

        programExam:
            normalizeAdminSlug(
                resourceAdminDom.programExam?.value
            ),

        semester:
            cleanAdminValue(
                resourceAdminDom.resourceSemester?.value,
                20
            ),

        subject:
            normalizeAdminSlug(
                resourceAdminDom.resourceSubject?.value
            ),

        subjectLabel,

        subjectLowercase:
            subjectLabel.toLowerCase(),

        year:
            cleanAdminValue(
                resourceAdminDom.resourceYear?.value,
                10
            ),

        language:
            normalizeAdminSlug(
                resourceAdminDom.resourceLanguage?.value
            ) ||
            RESOURCE_ADMIN_CONFIG.defaultLanguage,

        sourceType,

        thumbnailUrl:
            cleanAdminUrl(
                resourceAdminDom.resourceThumbnailUrl?.value
            ),

        pages:
            parseSafeInteger(
                resourceAdminDom.resourcePages?.value,
                0,
                20000
            ),

        fileSize:
            cleanAdminValue(
                resourceAdminDom.resourceFileSize?.value,
                50
            ),

        featured:
            Boolean(
                resourceAdminDom.resourceFeatured?.checked
            ),

        isNew:
            Boolean(
                resourceAdminDom.resourceIsNew?.checked
            ),

        status:
            normalizeAdminSlug(
                resourceAdminDom.resourceStatus?.value
            ) === "draft"
                ? "draft"
                : "published",

        views:
            resourceAdminState.formMode === "edit"
                ? parseSafeInteger(
                    editing?.views,
                    0
                )
                : 0,

        downloads:
            resourceAdminState.formMode === "edit"
                ? parseSafeInteger(
                    editing?.downloads,
                    0
                )
                : 0,

        updatedAt:
            window.serverTimestamp(),

        updatedBy:
            getCurrentAdminIdentifier()

    };

    data.searchableKeywords =
        createResourceSearchKeywords(
            data
        );

    if (
        resourceAdminState.formMode === "create"
    ) {

        data.createdAt =
            window.serverTimestamp();

        data.createdBy =
            getCurrentAdminIdentifier();

    }

    if (
        sourceType === "external"
    ) {

        return {

            ...data,

            fileUrl:
                "",

            externalUrl:
                cleanAdminUrl(
                    resourceAdminDom.resourceExternalUrl?.value
                ),

            sourceName:
                cleanAdminValue(
                    resourceAdminDom.resourceSourceName?.value,
                    120
                ),

            storagePath:
                "",

            fileName:
                "",

            fileExtension:
                "",

            mimeType:
                "",

            fileCategory:
                "external",

            fileSize:
                "External resource",

            fileSizeBytes:
                0

        };

    }

    return {

        ...data,

        fileUrl:
            cleanAdminUrl(
                resourceAdminDom.resourceFileUrl?.value
            ) ||
            cleanAdminUrl(
                editing?.fileUrl
            ),

        externalUrl:
            "",

        sourceName:
            "JobQuestAI",

        storagePath:
            cleanAdminValue(
                editing?.storagePath,
                700
            ),

        fileName:
            selectedFile
                ? cleanAdminValue(
                    selectedFile.name,
                    240
                )
                : cleanAdminValue(
                    editing?.fileName,
                    240
                ),

        fileExtension:
            selectedFile
                ? getResourceFileExtension(
                    selectedFile.name
                )
                : cleanAdminValue(
                    editing?.fileExtension,
                    20
                ).toLowerCase(),

        mimeType:
            selectedFile
                ? getResourceFileMimeType(
                    selectedFile
                )
                : cleanAdminValue(
                    editing?.mimeType,
                    180
                ).toLowerCase(),

        fileCategory:
            selectedFile
                ? getResourceFileCategory(
                    selectedFile
                )
                : cleanAdminValue(
                    editing?.fileCategory,
                    30
                ).toLowerCase() ||
                inferResourceFileCategory(
                    editing
                ),

        fileSizeBytes:
            selectedFile?.size ||
            parseSafeInteger(
                editing?.fileSizeBytes,
                0
            )

    };

}

function createResourceSearchKeywords(resource) {
    const set = new Set();
    [resource.title, resource.resourceType, resource.mainCategory, resource.educationLevel, resource.programExam, resource.subject, resource.subjectLabel, resource.year, resource.language].forEach((value) => {
        const clean = cleanAdminValue(value, 220).toLowerCase();
        if (!clean) return;
        set.add(clean);
        clean.split(/[\s-]+/).filter((word) => word.length >= 2).forEach((word) => set.add(word));
    });
    return Array.from(set).slice(0, 80);
}

function parseSafeInteger(value, fallback = 0, maximum = Number.MAX_SAFE_INTEGER) {
    const number = Number.parseInt(value, 10);
    return Number.isFinite(number) && number >= 0 ? Math.min(number, maximum) : fallback;
}

function getCurrentAdminIdentifier() {
    try {
        const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
        return cleanAdminValue(user.email || user.userEmail || window.auth?.currentUser?.email || "admin", 180);
    } catch {
        return cleanAdminValue(window.auth?.currentUser?.email || "admin", 180);
    }
}

function normalizeAdminResourceDocument(
    documentId,
    resource
) {

    if (
        !resource ||
        typeof resource !== "object"
    ) {

        return null;

    }

    const id =
        cleanAdminValue(
            documentId ||
            resource.id,
            140
        );

    const title =
        cleanAdminValue(
            resource.title,
            220
        );

    if (
        !id ||
        !title
    ) {

        return null;

    }

    return {

        id,

        title,

        titleLowercase:
            cleanAdminValue(
                resource.titleLowercase,
                220
            ) ||
            title.toLowerCase(),

        description:
            cleanAdminValue(
                resource.description,
                900
            ),

        resourceType:
            normalizeAdminSlug(
                resource.resourceType
            ) ||
            "notes",

        mainCategory:
            normalizeAdminSlug(
                resource.mainCategory
            ),

        educationLevel:
            normalizeAdminSlug(
                resource.educationLevel
            ),

        programExam:
            normalizeAdminSlug(
                resource.programExam
            ),

        semester:
            cleanAdminValue(
                resource.semester,
                20
            ),

        subject:
            normalizeAdminSlug(
                resource.subject
            ),

        subjectLabel:
            cleanAdminValue(
                resource.subjectLabel,
                120
            ) ||
            formatAdminSlugLabel(
                resource.subject
            ),

        year:
            cleanAdminValue(
                resource.year,
                10
            ),

        language:
            normalizeAdminSlug(
                resource.language
            ) ||
            RESOURCE_ADMIN_CONFIG.defaultLanguage,

        sourceType:
            normalizeAdminSlug(
                resource.sourceType
            ) === "external"
                ? "external"
                : "internal",

        fileUrl:
            cleanAdminUrl(
                resource.fileUrl
            ),

        externalUrl:
            cleanAdminUrl(
                resource.externalUrl
            ),

        sourceName:
            cleanAdminValue(
                resource.sourceName,
                120
            ) ||
            "JobQuestAI",

        storagePath:
            cleanAdminValue(
                resource.storagePath,
                700
            ),

        fileName:
            cleanAdminValue(
                resource.fileName,
                240
            ),

        fileExtension:
            cleanAdminValue(
                resource.fileExtension,
                20
            ).toLowerCase(),

        mimeType:
            cleanAdminValue(
                resource.mimeType,
                180
            ).toLowerCase(),

        fileCategory:
            cleanAdminValue(
                resource.fileCategory,
                30
            ).toLowerCase() ||
            inferResourceFileCategory(
                resource
            ),

        fileSize:
            cleanAdminValue(
                resource.fileSize,
                50
            ) ||
            (
                normalizeAdminSlug(
                    resource.sourceType
                ) === "external"
                    ? "External resource"
                    : "Unknown size"
            ),

        fileSizeBytes:
            parseSafeInteger(
                resource.fileSizeBytes,
                0
            ),

        pages:
            parseSafeInteger(
                resource.pages,
                0,
                20000
            ),

        thumbnailUrl:
            cleanAdminUrl(
                resource.thumbnailUrl
            ),

        featured:
            Boolean(
                resource.featured
            ),

        isNew:
            Boolean(
                resource.isNew
            ),

        status:
            normalizeAdminSlug(
                resource.status
            ) === "draft"
                ? "draft"
                : "published",

        views:
            parseSafeInteger(
                resource.views,
                0
            ),

        downloads:
            parseSafeInteger(
                resource.downloads,
                0
            ),

        searchableKeywords:
            Array.isArray(
                resource.searchableKeywords
            )
                ? resource.searchableKeywords
                    .map(
                        function (keyword) {

                            return cleanAdminValue(
                                keyword,
                                120
                            ).toLowerCase();

                        }
                    )
                    .filter(Boolean)
                : [],

        createdAt:
            resource.createdAt ||
            null,

        updatedAt:
            resource.updatedAt ||
            null,

        createdBy:
            cleanAdminValue(
                resource.createdBy,
                180
            ),

        updatedBy:
            cleanAdminValue(
                resource.updatedBy,
                180
            )

    };

}

function setAdminFieldValue(element, value) {
    if (element) element.value = value == null ? "" : String(value);
}

function getAdminResourceAccessUrl(resource) {
    if (!resource) return "";
    return resource.sourceType === "external" ? (cleanAdminUrl(resource.externalUrl) || cleanAdminUrl(resource.fileUrl)) : (cleanAdminUrl(resource.fileUrl) || cleanAdminUrl(resource.externalUrl));
}

/* =========================================================
   JOBQUESTAI ADMIN — STUDY RESOURCES

   RESOURCES.JS — MODULE 2B OF 4

   APPEND THIS CODE BELOW MODULE 2A

   Includes:
   - Firestore availability validation
   - Resource create workflow
   - Resource update workflow
   - Save button states
   - Internal and external save handling
   - Existing resource preservation
   - Post-save refresh
   - Firestore error normalization

   Firebase Storage upload will be completed in Module 4.
========================================================= */


/* =========================================================
   58. SAVE RESOURCE RECORD
========================================================= */

async function saveResourceRecord(
    resourceData
) {

    if (
        resourceAdminState.saving ||
        resourceAdminState.uploading
    ) {

        return;

    }

    const firebaseReady =
        validateFirestoreAvailability();

    if (!firebaseReady.valid) {

        showAdminNotification(
            firebaseReady.message,
            "error"
        );

        return;

    }

    setResourceFormBusy(
        true
    );

    try {

        let finalResourceData = {
            ...resourceData
        };

        /*
         * Module 4 will replace this preparation step with
         * Firebase Storage upload when a new PDF is selected.
         */

        finalResourceData =
            await prepareResourceFileData(
                finalResourceData
            );

        if (
            resourceAdminState.formMode ===
            "edit" &&
            resourceAdminState.editingResourceId
        ) {

            await updateExistingResource(
                resourceAdminState.editingResourceId,
                finalResourceData
            );

            showAdminNotification(
                "Resource updated successfully.",
                "success"
            );

        } else {

            await createNewResource(
                finalResourceData
            );

            showAdminNotification(
                "Resource published successfully.",
                "success"
            );

        }

        await refreshResourcesAfterSave();

        closeResourceFormPanel();

    } catch (error) {

        console.error(
            "RESOURCE SAVE ERROR:",
            error
        );

        showAdminNotification(
            getReadableFirestoreError(
                error,
                "Resource could not be saved."
            ),
            "error"
        );

    } finally {

        setResourceFormBusy(
            false
        );

    }

}


/* =========================================================
   59. FIRESTORE AVAILABILITY CHECK
========================================================= */

function validateFirestoreAvailability() {

    const missingServices = [];

    if (!window.db) {

        missingServices.push(
            "Firestore database"
        );

    }

    if (
        typeof window.collection !==
        "function"
    ) {

        missingServices.push(
            "collection()"
        );

    }

    if (
        typeof window.addDoc !==
        "function"
    ) {

        missingServices.push(
            "addDoc()"
        );

    }

    if (
        typeof window.doc !==
        "function"
    ) {

        missingServices.push(
            "doc()"
        );

    }

    if (
        typeof window.updateDoc !==
        "function"
    ) {

        missingServices.push(
            "updateDoc()"
        );

    }

    if (
        typeof window.serverTimestamp !==
        "function"
    ) {

        missingServices.push(
            "serverTimestamp()"
        );

    }

    if (missingServices.length) {

        return {

            valid:
                false,

            message:
                `Firebase is not fully available: ${missingServices.join(", ")}.`

        };

    }

    return {

        valid:
            true,

        message:
            ""

    };

}


/* =========================================================
   60. PREPARE RESOURCE FILE DATA

   For now:
   - Existing internal URL is accepted.
   - Selected PDF metadata is preserved.
   - Actual Firebase Storage upload is added in Module 4.
========================================================= */

async function prepareResourceFileData(resourceData) {

    if (resourceData.sourceType === "external") {

        return {
            ...resourceData,
            fileUrl: "",
            storagePath: "",
            fileName: "",
            fileExtension: "",
            mimeType: "",
            fileCategory: "external",
            fileSize: "External resource",
            fileSizeBytes: 0
        };

    }

    const selectedFile =
        resourceAdminState.selectedResourceFile;

    if (!selectedFile) {

        return resourceData;

    }

    validateStorageAvailability();

    resourceAdminState.uploading =
        true;

    updateUploadProgress(0);

    const oldStoragePath =
        cleanAdminValue(
            resourceData.storagePath,
            700
        );

    const storagePath =
        createResourceStoragePath(
            selectedFile,
            resourceData.title
        );

    try {

        const result =
            await uploadResourceFileToStorage(
                selectedFile,
                storagePath
            );

        if (
            oldStoragePath &&
            oldStoragePath !== storagePath
        ) {

            await deleteStorageObjectSafely(
                oldStoragePath
            );

        }

        return {
            ...resourceData,

            fileUrl:
                result.downloadUrl,

            storagePath,

            fileName:
                cleanAdminValue(
                    selectedFile.name,
                    240
                ),

            fileExtension:
                getResourceFileExtension(
                    selectedFile.name
                ),

            mimeType:
                getResourceFileMimeType(
                    selectedFile
                ),

            fileCategory:
                getResourceFileCategory(
                    selectedFile
                ),

            fileSize:
                formatFileSize(
                    selectedFile.size
                ),

            fileSizeBytes:
                selectedFile.size
        };

    } finally {

        resourceAdminState.uploading =
            false;

    }

}




/* =========================================================
   61. CREATE NEW RESOURCE
========================================================= */

async function createNewResource(
    resourceData
) {

    const collectionReference =
        window.collection(
            window.db,
            RESOURCE_ADMIN_CONFIG.collectionName
        );

    const documentReference =
        await window.addDoc(
            collectionReference,
            sanitizeFirestoreResourceData(
                resourceData
            )
        );

    return documentReference.id;

}


/* =========================================================
   62. UPDATE EXISTING RESOURCE
========================================================= */

async function updateExistingResource(
    resourceId,
    resourceData
) {

    const safeResourceId =
        cleanAdminValue(
            resourceId,
            140
        );

    if (!safeResourceId) {

        throw new Error(
            "RESOURCE_ID_MISSING"
        );

    }

    const documentReference =
        window.doc(
            window.db,
            RESOURCE_ADMIN_CONFIG.collectionName,
            safeResourceId
        );

    const updateData = {
        ...resourceData
    };

    /*
     * Creation metadata should never be overwritten during
     * an edit operation.
     */

    delete updateData.createdAt;
    delete updateData.createdBy;

    await window.updateDoc(
        documentReference,
        sanitizeFirestoreResourceData(
            updateData
        )
    );

}


/* =========================================================
   63. SANITIZE FIRESTORE RESOURCE DATA
========================================================= */

function sanitizeFirestoreResourceData(
    resourceData
) {

    const data = {

        title:
            cleanAdminValue(
                resourceData.title,
                220
            ),

        titleLowercase:
            cleanAdminValue(
                resourceData.titleLowercase,
                220
            ).toLowerCase(),

        description:
            cleanAdminValue(
                resourceData.description,
                900
            ),

        resourceType:
            normalizeAdminSlug(
                resourceData.resourceType
            ) ||
            "notes",

        mainCategory:
            normalizeAdminSlug(
                resourceData.mainCategory
            ),

        educationLevel:
            normalizeAdminSlug(
                resourceData.educationLevel
            ),

        programExam:
            normalizeAdminSlug(
                resourceData.programExam
            ),

        semester:
            cleanAdminValue(
                resourceData.semester,
                20
            ),

        subject:
            normalizeAdminSlug(
                resourceData.subject
            ),

        subjectLabel:
            cleanAdminValue(
                resourceData.subjectLabel,
                120
            ),

        subjectLowercase:
            cleanAdminValue(
                resourceData.subjectLowercase,
                120
            ).toLowerCase(),

        year:
            cleanAdminValue(
                resourceData.year,
                10
            ),

        language:
            normalizeAdminSlug(
                resourceData.language
            ) ||
            RESOURCE_ADMIN_CONFIG.defaultLanguage,

        sourceType:
            normalizeAdminSlug(
                resourceData.sourceType
            ) ===
            "external"
                ? "external"
                : "internal",

        fileUrl:
            cleanAdminUrl(
                resourceData.fileUrl
            ),

        externalUrl:
            cleanAdminUrl(
                resourceData.externalUrl
            ),

        sourceName:
            cleanAdminValue(
                resourceData.sourceName,
                120
            ) ||
            "JobQuestAI",

        storagePath:
            cleanAdminValue(
                resourceData.storagePath,
                700
            ),

        fileName:
            cleanAdminValue(
                resourceData.fileName,
                240
            ),

        fileExtension:
            cleanAdminValue(
                resourceData.fileExtension,
                20
            ).toLowerCase(),

        mimeType:
            cleanAdminValue(
                resourceData.mimeType,
                180
            ).toLowerCase(),

        fileCategory:
            cleanAdminValue(
                resourceData.fileCategory,
                30
            ).toLowerCase() ||
            (
                normalizeAdminSlug(
                    resourceData.sourceType
                ) === "external"
                    ? "external"
                    : "file"
            ),

        fileSize:
            cleanAdminValue(
                resourceData.fileSize,
                50
            ),

        fileSizeBytes:
            parseSafeInteger(
                resourceData.fileSizeBytes,
                0
            ),

        pages:
            parseSafeInteger(
                resourceData.pages,
                0,
                20000
            ),

        thumbnailUrl:
            cleanAdminUrl(
                resourceData.thumbnailUrl
            ),

        featured:
            Boolean(
                resourceData.featured
            ),

        isNew:
            Boolean(
                resourceData.isNew
            ),

        status:
            normalizeAdminSlug(
                resourceData.status
            ) ===
            "draft"
                ? "draft"
                : "published",

        views:
            parseSafeInteger(
                resourceData.views,
                0
            ),

        downloads:
            parseSafeInteger(
                resourceData.downloads,
                0
            ),

        searchableKeywords:
            Array.isArray(
                resourceData.searchableKeywords
            )
                ? resourceData.searchableKeywords
                    .map(
                        function (keyword) {

                            return cleanAdminValue(
                                keyword,
                                120
                            ).toLowerCase();

                        }
                    )
                    .filter(Boolean)
                    .slice(
                        0,
                        80
                    )
                : [],

        updatedAt:
            resourceData.updatedAt ||
            window.serverTimestamp(),

        updatedBy:
            cleanAdminValue(
                resourceData.updatedBy,
                180
            ) ||
            getCurrentAdminIdentifier()

    };


    if (
        resourceData.createdAt
    ) {

        data.createdAt =
            resourceData.createdAt;

    }


    if (
        resourceData.createdBy
    ) {

        data.createdBy =
            cleanAdminValue(
                resourceData.createdBy,
                180
            );

    }


    return removeUndefinedFirestoreValues(
        data
    );

}


/* =========================================================
   64. REMOVE UNDEFINED FIRESTORE VALUES
========================================================= */

function removeUndefinedFirestoreValues(
    value
) {

    if (
        Array.isArray(value)
    ) {

        return value
            .map(
                removeUndefinedFirestoreValues
            )
            .filter(
                function (item) {

                    return (
                        item !== undefined
                    );

                }
            );

    }

    if (
        value &&
        typeof value ===
            "object" &&
        !isFirestoreSpecialValue(
            value
        )
    ) {

        return Object.fromEntries(
            Object.entries(
                value
            )
                .filter(
                    function ([, item]) {

                        return (
                            item !== undefined
                        );

                    }
                )
                .map(
                    function ([key, item]) {

                        return [
                            key,
                            removeUndefinedFirestoreValues(
                                item
                            )
                        ];

                    }
                )
        );

    }

    return value;

}


/* =========================================================
   65. FIRESTORE SPECIAL VALUE CHECK
========================================================= */

function isFirestoreSpecialValue(
    value
) {

    if (!value) {

        return false;

    }

    const constructorName =
        value.constructor
            ?.name ||
        "";

    return [

        "Timestamp",
        "FieldValue",
        "ServerTimestampTransform",
        "DeleteFieldValueImpl",
        "ServerTimestampFieldValueImpl"

    ].some(
        function (name) {

            return constructorName.includes(
                name
            );

        }
    );

}


/* =========================================================
   66. REFRESH AFTER SAVE
========================================================= */

async function refreshResourcesAfterSave() {

    if (
        typeof loadAdminResources ===
        "function"
    ) {

        await loadAdminResources();

        return;

    }

    /*
     * Module 3 adds loadAdminResources().
     */

    console.info(
        "Resource was saved. " +
        "Paste Module 3 to refresh and render the resources table."
    );

}


/* =========================================================
   67. SET DELETE BUTTON LOADING
========================================================= */

function setDeleteButtonLoading(
    loading
) {

    const isLoading =
        Boolean(loading);

    if (
        !resourceAdminDom
            .confirmDeleteResourceBtn
    ) {

        return;

    }

    resourceAdminDom.confirmDeleteResourceBtn.disabled =
        isLoading;

    resourceAdminDom.confirmDeleteResourceBtn.innerHTML =
        isLoading
            ? `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Deleting...
            `
            : `
                <i class="fa-solid fa-trash-can"></i>
                Delete Resource
            `;

}


/* =========================================================
   68. READABLE FIRESTORE ERROR
========================================================= */

function getReadableFirestoreError(
    error,
    fallbackMessage
) {

    const errorCode =
        cleanAdminValue(
            error?.code,
            160
        ).toLowerCase();

    const rawMessage =
        cleanAdminValue(
            error?.message,
            500
        );


    if (
        rawMessage ===
        "FILE_UPLOAD_NOT_CONNECTED"
    ) {

        return (
            "Firebase Storage upload is not connected yet. " +
            "Provide an existing public file URL instead."
        );

    }


    if (
        rawMessage ===
        "RESOURCE_ID_MISSING"
    ) {

        return (
            "The resource document ID is missing."
        );

    }


    if (
        errorCode.includes(
            "permission-denied"
        )
    ) {

        return (
            "Firestore permission denied. Check your Firebase security rules and admin access."
        );

    }


    if (
        errorCode.includes(
            "unauthenticated"
        )
    ) {

        return (
            "Your admin session has expired. Please log in again."
        );

    }


    if (
        errorCode.includes(
            "unavailable"
        )
    ) {

        return (
            "Firebase is temporarily unavailable. Check your internet connection and try again."
        );

    }


    if (
        errorCode.includes(
            "not-found"
        )
    ) {

        return (
            "The requested resource record could not be found."
        );

    }


    if (
        errorCode.includes(
            "invalid-argument"
        )
    ) {

        return (
            "Some resource information is invalid. Review the form and try again."
        );

    }


    if (
        errorCode.includes(
            "resource-exhausted"
        )
    ) {

        return (
            "Firebase usage limit has been reached. Please try again later."
        );

    }


    if (
        rawMessage &&
        !rawMessage.includes(
            "FirebaseError"
        )
    ) {

        return rawMessage;

    }


    return (
        fallbackMessage ||
        "A Firebase operation failed."
    );

}


/* =========================================================
   69. SAVE CURRENT RESOURCE LOCALLY

   This helper updates local state immediately after editing.
   Module 3 still reloads Firestore as the final source.
========================================================= */

function upsertLocalAdminResource(
    resource
) {

    const normalized =
        normalizeAdminResourceDocument(
            resource.id,
            resource
        );

    if (!normalized) {

        return;

    }

    const existingIndex =
        resourceAdminState
            .allResources
            .findIndex(
                function (item) {

                    return (
                        item.id ===
                        normalized.id
                    );

                }
            );

    if (existingIndex >= 0) {

        resourceAdminState.allResources[
            existingIndex
        ] = normalized;

    } else {

        resourceAdminState.allResources.unshift(
            normalized
        );

    }

}


/* =========================================================
   70. GET CURRENT FORM MODE LABEL
========================================================= */

function getResourceFormModeLabel() {

    return (
        resourceAdminState.formMode ===
        "edit"
            ? "Update Resource"
            : "Publish Resource"
    );

}


/* =========================================================
   71. RESTORE SAVE BUTTON LABEL
========================================================= */

function restoreSaveResourceButtonLabel() {

    if (
        !resourceAdminDom
            .saveResourceBtnText
    ) {

        return;

    }

    resourceAdminDom.saveResourceBtnText.textContent =
        getResourceFormModeLabel();

}


/* =========================================================
   72. OVERRIDE BUSY STATE LABEL RESTORATION

   This listener restores text after the CSS spinner is removed.
========================================================= */

resourceAdminDom.resourceForm
    ?.addEventListener(
        "transitionend",
        function () {

            if (
                !resourceAdminState.saving
            ) {

                restoreSaveResourceButtonLabel();

            }

        }
    );


/* =========================================================
   73. LIVE FORM ERROR CLEARING
========================================================= */

resourceAdminDom.resourceForm
    ?.addEventListener(
        "input",
        function (event) {

            const field =
                event.target.closest(
                    "input, select, textarea"
                );

            if (!field) {

                return;

            }

            clearFieldError(
                field
            );

            field.closest(
                ".form-group"
            )
                ?.classList.remove(
                    "has-success"
                );

        }
    );


/* =========================================================
   74. NORMALIZE SUBJECT KEY ON BLUR
========================================================= */

resourceAdminDom.resourceSubject
    ?.addEventListener(
        "blur",
        function () {

            const normalizedSubject =
                normalizeAdminSlug(
                    resourceAdminDom
                        .resourceSubject
                        .value
                );

            resourceAdminDom.resourceSubject.value =
                normalizedSubject;

            if (
                normalizedSubject &&
                !cleanAdminValue(
                    resourceAdminDom
                        .resourceSubjectLabel
                        ?.value
                )
            ) {

                setAdminFieldValue(
                    resourceAdminDom
                        .resourceSubjectLabel,
                    formatAdminSlugLabel(
                        normalizedSubject
                    )
                );

            }

        }
    );


/* =========================================================
   75. NORMALIZE PROGRAM / EXAM ON BLUR
========================================================= */

resourceAdminDom.programExam
    ?.addEventListener(
        "blur",
        function () {

            resourceAdminDom.programExam.value =
                normalizeAdminSlug(
                    resourceAdminDom
                        .programExam
                        .value
                );

        }
    );


/* =========================================================
   END OF RESOURCES.JS — MODULE 2B

   MODULE 2 IS NOW COMPLETE.

   APPEND MODULE 3 DIRECTLY BELOW THIS COMMENT.

   MODULE 3 WILL INCLUDE:
   - Load resources from Firestore
   - Normalize snapshots
   - Render resources table
   - Statistics
   - Search and filters
   - Preview actions
   - Empty/error states
========================================================= */

/* =========================================================
   JOBQUESTAI ADMIN — STUDY RESOURCES

   RESOURCES.JS — MODULE 3A OF 4

   APPEND THIS CODE BELOW MODULE 2B

   Includes:
   - Load resources from Firestore
   - Normalize Firestore documents
   - Sort resources
   - Search and filters
   - Resource statistics
   - Professional table rendering
   - Empty state
   - Loading and error states
   - Resource badge helpers

   Module 3B will complete:
   - Preview
   - Edit
   - Delete action routing
   - Form population
========================================================= */


/* =========================================================
   76. LOAD ADMIN RESOURCES
========================================================= */

async function loadAdminResources() {

    if (
        resourceAdminState.loading
    ) {

        return;

    }

    const firebaseValidation =
        validateResourceReadAvailability();

    if (
        !firebaseValidation.valid
    ) {

        renderResourceLoadError(
            firebaseValidation.message
        );

        return;

    }

    resourceAdminState.loading =
        true;

    renderResourceTableLoading();

    try {

        const collectionReference =
            window.collection(
                window.db,
                RESOURCE_ADMIN_CONFIG.collectionName
            );

        const snapshot =
            await window.getDocs(
                collectionReference
            );

        const loadedResources = [];

        snapshot.forEach(
            function (documentSnapshot) {

                const normalizedResource =
                    normalizeAdminResourceDocument(
                        documentSnapshot.id,
                        documentSnapshot.data()
                    );

                if (normalizedResource) {

                    loadedResources.push(
                        normalizedResource
                    );

                }

            }
        );

        resourceAdminState.allResources =
            sortAdminResourceCollection(
                loadedResources
            );

        updateAdminResourceStatistics();

        applyAdminResourceFilters();

    } catch (error) {

        console.error(
            "LOAD ADMIN RESOURCES ERROR:",
            error
        );

        renderResourceLoadError(
            getReadableFirestoreError(
                error,
                "Study resources could not be loaded."
            )
        );

    } finally {

        resourceAdminState.loading =
            false;

    }

}


/* =========================================================
   77. FIRESTORE READ AVAILABILITY
========================================================= */

function validateResourceReadAvailability() {

    const missingServices = [];

    if (!window.db) {

        missingServices.push(
            "Firestore database"
        );

    }

    if (
        typeof window.collection !==
        "function"
    ) {

        missingServices.push(
            "collection()"
        );

    }

    if (
        typeof window.getDocs !==
        "function"
    ) {

        missingServices.push(
            "getDocs()"
        );

    }

    if (missingServices.length) {

        return {

            valid:
                false,

            message:
                `Firebase read services are unavailable: ${missingServices.join(", ")}.`

        };

    }

    return {

        valid:
            true,

        message:
            ""

    };

}


/* =========================================================
   78. SORT ADMIN RESOURCE COLLECTION
========================================================= */

function sortAdminResourceCollection(
    resources
) {

    return [...resources]
        .sort(
            function (firstResource, secondResource) {

                const firstTime =
                    getAdminResourceTimestamp(
                        firstResource.updatedAt ||
                        firstResource.createdAt
                    );

                const secondTime =
                    getAdminResourceTimestamp(
                        secondResource.updatedAt ||
                        secondResource.createdAt
                    );

                if (
                    firstTime !==
                    secondTime
                ) {

                    return (
                        secondTime -
                        firstTime
                    );

                }

                return firstResource.title.localeCompare(
                    secondResource.title
                );

            }
        );

}


/* =========================================================
   79. APPLY ADMIN RESOURCE FILTERS
========================================================= */

function applyAdminResourceFilters() {

    const searchQuery =
        cleanAdminValue(
            resourceAdminState.searchQuery,
            200
        ).toLowerCase();

    const typeFilter =
        normalizeAdminSlug(
            resourceAdminState.typeFilter
        );

    const statusFilter =
        normalizeAdminSlug(
            resourceAdminState.statusFilter
        );

    const filteredResources =
        resourceAdminState
            .allResources
            .filter(
                function (resource) {

                    if (
                        typeFilter &&
                        resource.resourceType !==
                            typeFilter
                    ) {

                        return false;

                    }

                    if (
                        statusFilter &&
                        resource.status !==
                            statusFilter
                    ) {

                        return false;

                    }

                    if (
                        searchQuery &&
                        !adminResourceMatchesSearch(
                            resource,
                            searchQuery
                        )
                    ) {

                        return false;

                    }

                    return true;

                }
            );

    resourceAdminState.filteredResources =
        filteredResources;

    renderAdminResourcesTable(
        filteredResources
    );

    updateResourceTableSummary(
        filteredResources.length,
        resourceAdminState.allResources.length
    );

}


/* =========================================================
   80. RESOURCE SEARCH MATCHING
========================================================= */

function adminResourceMatchesSearch(
    resource,
    searchQuery
) {

    if (!searchQuery) {

        return true;

    }

    const searchableValues = [

        resource.title,
        resource.description,
        resource.resourceType,
        resource.mainCategory,
        resource.educationLevel,
        resource.programExam,
        resource.semester,
        resource.subject,
        resource.subjectLabel,
        resource.year,
        resource.language,
        resource.sourceName,
        resource.status,

        ...(Array.isArray(
            resource.searchableKeywords
        )
            ? resource.searchableKeywords
            : [])

    ];

    const searchableText =
        searchableValues
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

    return searchableText.includes(
        searchQuery
    );

}


/* =========================================================
   81. RENDER ADMIN RESOURCES TABLE
========================================================= */

function renderAdminResourcesTable(
    resources
) {

    if (
        !resourceAdminDom
            .resourcesTableBody
    ) {

        return;

    }

    if (!resources.length) {

        renderAdminResourcesEmptyState();

        return;

    }

    hideAdminResourcesEmptyState();

    resourceAdminDom.resourcesTableBody.innerHTML =
        resources
            .map(
                createAdminResourceRowMarkup
            )
            .join("");

}


/* =========================================================
   82. CREATE RESOURCE TABLE ROW
========================================================= */

function createAdminResourceRowMarkup(
    resource
) {

    const resourceTypeDetails =
        getAdminResourceTypeDetails(
            resource.resourceType
        );

    const categoryDetails =
        getAdminCategoryDetails(
            resource.mainCategory
        );

    const accessUrl =
        getAdminResourceAccessUrl(
            resource
        );

    const sourceLabel =
        resource.sourceType ===
        "external"
            ? (
                resource.sourceName ||
                "External Source"
            )
            : "JobQuestAI";

    const educationOrProgram =
        resource.programExam
            ? formatAdminProgramLabel(
                resource.programExam
            )
            : formatAdminEducationLabel(
                resource.educationLevel
            );

    const featuredMarkup =
        resource.featured
            ? `
                <span class="resource-feature-flag">

                    <i class="fa-solid fa-star"></i>

                    Featured

                </span>
            `
            : "";

    const newMarkup =
        resource.isNew
            ? `
                <span class="resource-new-flag">

                    <i class="fa-solid fa-bolt"></i>

                    New

                </span>
            `
            : "";

    return `
        <tr
            data-resource-row-id="${escapeAdminHtml(resource.id)}"
        >

            <td>

                <div class="resource-table-title-cell">

                    <span class="resource-table-icon">

                        <i class="fa-solid ${resourceTypeDetails.icon}"></i>

                    </span>


                    <div class="resource-table-title-content">

                        <strong title="${escapeAdminHtml(resource.title)}">

                            ${escapeAdminHtml(resource.title)}

                        </strong>


                        <small title="${escapeAdminHtml(resource.subjectLabel)}">

                            ${
                                escapeAdminHtml(
                                    resource.subjectLabel ||
                                    "No subject"
                                )
                            }

                            ${
                                resource.year
                                    ? ` • ${escapeAdminHtml(resource.year)}`
                                    : ""
                            }

                        </small>


                        <div class="resource-table-title-meta">

                            ${featuredMarkup}

                            ${newMarkup}

                        </div>

                    </div>

                </div>

            </td>


            <td>

                <span
                    class="resource-admin-badge resource-type-admin-badge ${escapeAdminHtml(resource.resourceType)}"
                >

                    <i class="fa-solid ${resourceTypeDetails.icon}"></i>

                    ${escapeAdminHtml(resourceTypeDetails.label)}

                </span>

            </td>


            <td>

                <div class="resource-subject-cell">

                    <span
                        class="resource-admin-badge resource-category-badge ${escapeAdminHtml(resource.mainCategory)}"
                    >

                        <i class="fa-solid ${categoryDetails.icon}"></i>

                        ${escapeAdminHtml(categoryDetails.label)}

                    </span>


                    <small>

                        ${
                            escapeAdminHtml(
                                educationOrProgram ||
                                "Not specified"
                            )
                        }

                        ${
                            resource.semester
                                ? ` • Semester ${escapeAdminHtml(resource.semester)}`
                                : ""
                        }

                    </small>

                </div>

            </td>


            <td>

                <div class="resource-source-details">

                    <span
                        class="resource-admin-badge resource-source-badge ${escapeAdminHtml(resource.sourceType)}"
                    >

                        <i class="fa-solid ${
                            resource.sourceType === "external"
                                ? "fa-link"
                                : "fa-file-pdf"
                        }"></i>

                        ${
                            resource.sourceType === "external"
                                ? "External"
                                : "Internal"
                        }

                    </span>


                    <small title="${escapeAdminHtml(sourceLabel)}">

                        ${escapeAdminHtml(sourceLabel)}

                    </small>

                </div>

            </td>


            <td>

                <div class="resource-status-details">

                    <span
                        class="resource-admin-badge resource-status-badge ${escapeAdminHtml(resource.status)}"
                    >

                        <i class="fa-solid ${
                            resource.status === "published"
                                ? "fa-circle-check"
                                : "fa-clock"
                        }"></i>

                        ${
                            resource.status === "published"
                                ? "Published"
                                : "Draft"
                        }

                    </span>

                </div>

            </td>


            <td>

                <div class="resource-performance">

                    <span class="resource-performance-item views">

                        <i class="fa-solid fa-eye"></i>

                        ${formatAdminCompactNumber(resource.views)}

                        views

                    </span>


                    <span class="resource-performance-item downloads">

                        <i class="fa-solid fa-download"></i>

                        ${formatAdminCompactNumber(resource.downloads)}

                        downloads

                    </span>

                </div>

            </td>


            <td>

                <div class="resource-admin-actions">

                    <button
                        type="button"
                        class="resource-admin-action-btn resource-preview-action"
                        data-resource-admin-action="preview"
                        data-resource-id="${escapeAdminHtml(resource.id)}"
                        title="Preview resource"
                        aria-label="Preview ${escapeAdminHtml(resource.title)}"
                        ${
                            accessUrl
                                ? ""
                                : "disabled"
                        }
                    >

                        <i class="fa-solid fa-eye"></i>

                    </button>


                    <button
                        type="button"
                        class="resource-admin-action-btn resource-edit-action"
                        data-resource-admin-action="edit"
                        data-resource-id="${escapeAdminHtml(resource.id)}"
                        title="Edit resource"
                        aria-label="Edit ${escapeAdminHtml(resource.title)}"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="resource-admin-action-btn resource-delete-action"
                        data-resource-admin-action="delete"
                        data-resource-id="${escapeAdminHtml(resource.id)}"
                        title="Delete resource"
                        aria-label="Delete ${escapeAdminHtml(resource.title)}"
                    >

                        <i class="fa-solid fa-trash-can"></i>

                    </button>

                </div>

            </td>

        </tr>
    `;

}


/* =========================================================
   83. UPDATE RESOURCE STATISTICS
========================================================= */

function updateAdminResourceStatistics() {

    const resources =
        resourceAdminState.allResources;

    const internalCount =
        resources.filter(
            function (resource) {

                return (
                    resource.sourceType ===
                    "internal"
                );

            }
        ).length;

    const externalCount =
        resources.filter(
            function (resource) {

                return (
                    resource.sourceType ===
                    "external"
                );

            }
        ).length;

    const publishedCount =
        resources.filter(
            function (resource) {

                return (
                    resource.status ===
                    "published"
                );

            }
        ).length;

    setAdminStatValue(
        resourceAdminDom.totalResourcesCount,
        resources.length
    );

    setAdminStatValue(
        resourceAdminDom.internalResourcesCount,
        internalCount
    );

    setAdminStatValue(
        resourceAdminDom.externalResourcesCount,
        externalCount
    );

    setAdminStatValue(
        resourceAdminDom.publishedResourcesCount,
        publishedCount
    );

}


/* =========================================================
   84. SET STATISTIC VALUE
========================================================= */

function setAdminStatValue(
    element,
    value
) {

    if (!element) {

        return;

    }

    element.textContent =
        formatAdminCompactNumber(
            value
        );

}


/* =========================================================
   85. TABLE SUMMARY
========================================================= */

function updateResourceTableSummary(
    visibleCount,
    totalCount
) {

    if (
        !resourceAdminDom
            .resourceTableSummary
    ) {

        return;

    }

    if (totalCount === 0) {

        resourceAdminDom.resourceTableSummary.textContent =
            "No study resources have been added yet.";

        return;

    }

    if (
        visibleCount ===
        totalCount
    ) {

        resourceAdminDom.resourceTableSummary.textContent =
            `${totalCount} resource${totalCount === 1 ? "" : "s"} available.`;

        return;

    }

    resourceAdminDom.resourceTableSummary.textContent =
        `Showing ${visibleCount} of ${totalCount} resources.`;

}


/* =========================================================
   86. TABLE LOADING STATE
========================================================= */

function renderResourceTableLoading() {

    if (
        !resourceAdminDom
            .resourcesTableBody
    ) {

        return;

    }

    hideAdminResourcesEmptyState();

    resourceAdminDom.resourcesTableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="table-loading-cell"
            >

                <i class="fa-solid fa-spinner fa-spin"></i>

                Loading study resources...

            </td>

        </tr>
    `;

    if (
        resourceAdminDom
            .resourceTableSummary
    ) {

        resourceAdminDom.resourceTableSummary.textContent =
            "Loading resources from Firestore...";

    }

}


/* =========================================================
   87. TABLE LOAD ERROR
========================================================= */

function renderResourceLoadError(
    message
) {

    if (
        !resourceAdminDom
            .resourcesTableBody
    ) {

        return;

    }

    hideAdminResourcesEmptyState();

    resourceAdminDom.resourcesTableBody.innerHTML = `

        <tr class="resource-table-error">

            <td colspan="7">

                <i class="fa-solid fa-circle-exclamation"></i>

                ${escapeAdminHtml(
                    message ||
                    "Resources could not be loaded."
                )}

            </td>

        </tr>
    `;

    if (
        resourceAdminDom
            .resourceTableSummary
    ) {

        resourceAdminDom.resourceTableSummary.textContent =
            "Resource loading failed.";

    }

}


/* =========================================================
   88. EMPTY RESOURCE STATE
========================================================= */

function renderAdminResourcesEmptyState() {

    if (
        resourceAdminDom
            .resourcesTableBody
    ) {

        resourceAdminDom.resourcesTableBody.innerHTML =
            "";

    }

    if (
        resourceAdminDom
            .resourcesEmptyState
    ) {

        resourceAdminDom.resourcesEmptyState.hidden =
            false;

    }

}


/* =========================================================
   89. HIDE EMPTY STATE
========================================================= */

function hideAdminResourcesEmptyState() {

    if (
        resourceAdminDom
            .resourcesEmptyState
    ) {

        resourceAdminDom.resourcesEmptyState.hidden =
            true;

    }

}


/* =========================================================
   90. RESOURCE TYPE DETAILS
========================================================= */

function getAdminResourceTypeDetails(
    resourceType
) {

    const resourceTypes = {

        notes: {

            label:
                "Notes",

            icon:
                "fa-book-open"

        },

        book: {

            label:
                "Book",

            icon:
                "fa-book"

        },

        "past-paper": {

            label:
                "Past Paper",

            icon:
                "fa-file-lines"

        },

        "solved-paper": {

            label:
                "Solved Paper",

            icon:
                "fa-file-circle-check"

        },

        mcqs: {

            label:
                "MCQs",

            icon:
                "fa-list-check"

        },

        syllabus: {

            label:
                "Syllabus",

            icon:
                "fa-clipboard-list"

        },

        "guess-paper": {

            label:
                "Guess Paper",

            icon:
                "fa-lightbulb"

        }

    };

    return (
        resourceTypes[
            resourceType
        ] ||
        {

            label:
                formatAdminSlugLabel(
                    resourceType
                ) ||
                "Resource",

            icon:
                "fa-file"
        }
    );

}


/* =========================================================
   91. CATEGORY DETAILS
========================================================= */

function getAdminCategoryDetails(
    mainCategory
) {

    const categories = {

        school: {

            label:
                "School",

            icon:
                "fa-school"

        },

        college: {

            label:
                "College",

            icon:
                "fa-building-columns"

        },

        university: {

            label:
                "University",

            icon:
                "fa-graduation-cap"

        },

        "entry-test": {

            label:
                "Entry Tests",

            icon:
                "fa-pen-to-square"

        },

        "competitive-exam": {

            label:
                "Competitive Exams",

            icon:
                "fa-trophy"

        },

        "government-job": {

            label:
                "Government Jobs",

            icon:
                "fa-landmark"

        }

    };

    return (
        categories[
            mainCategory
        ] ||
        {

            label:
                formatAdminSlugLabel(
                    mainCategory
                ) ||
                "Uncategorized",

            icon:
                "fa-folder"
        }
    );

}


/* =========================================================
   92. EDUCATION LABEL
========================================================= */

function formatAdminEducationLabel(
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
        labels[
            educationLevel
        ] ||
        formatAdminSlugLabel(
            educationLevel
        )
    );

}


/* =========================================================
   93. PROGRAM / EXAM LABEL
========================================================= */

function formatAdminProgramLabel(
    programExam
) {

    const labels = {

        bsse:
            "BS Software Engineering",

        bscs:
            "BS Computer Science",

        bsit:
            "BS Information Technology",

        bsai:
            "BS Artificial Intelligence",

        psychology:
            "BS Psychology",

        "fsc-pre-medical":
            "FSc Pre-Medical",

        "fsc-pre-engineering":
            "FSc Pre-Engineering",

        ics:
            "ICS",

        icom:
            "ICom",

        css:
            "CSS",

        pms:
            "PMS",

        ppsc:
            "PPSC",

        fpsc:
            "FPSC",

        mdcat:
            "MDCAT",

        ecat:
            "ECAT",

        police:
            "Police",

        fia:
            "FIA",

        fbr:
            "FBR",

        asf:
            "ASF"

    };

    return (
        labels[
            programExam
        ] ||
        formatAdminSlugLabel(
            programExam
        )
    );

}


/* =========================================================
   94. FORMAT COMPACT NUMBER
========================================================= */

function formatAdminCompactNumber(
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
   95. GET FIRESTORE TIMESTAMP
========================================================= */

function getAdminResourceTimestamp(
    timestampValue
) {

    if (!timestampValue) {

        return 0;

    }

    if (
        typeof timestampValue.toDate ===
        "function"
    ) {

        return timestampValue
            .toDate()
            .getTime();

    }

    if (
        typeof timestampValue.seconds ===
        "number"
    ) {

        return (
            timestampValue.seconds *
            1000
        );

    }

    const parsedDate =
        new Date(
            timestampValue
        );

    return Number.isNaN(
        parsedDate.getTime()
    )
        ? 0
        : parsedDate.getTime();

}


/* =========================================================
   END OF RESOURCES.JS — MODULE 3A

   APPEND MODULE 3B DIRECTLY BELOW THIS COMMENT.

   MODULE 3B WILL INCLUDE:
   - Resource action router
   - Preview internal/external resources
   - Edit resource form population
   - Delete modal opening
   - Table action safety
========================================================= */

/* =========================================================
   JOBQUESTAI ADMIN — STUDY RESOURCES

   RESOURCES.JS — MODULE 3B OF 4

   APPEND THIS CODE BELOW MODULE 3A

   Includes:
   - Resource action router
   - Internal PDF preview
   - External official link preview
   - Edit form population
   - Edit mode handling
   - Delete modal opening
   - Resource URL safety
   - Table action protection

   Module 4 will complete:
   - Firebase Storage upload
   - Firestore deletion
   - Storage deletion
   - Application initialization
   - Final CSS notification styles
========================================================= */


/* =========================================================
   96. RESOURCE ACTION ROUTER
========================================================= */

function handleAdminResourceAction(
    action,
    resourceId,
    actionButton
) {

    const resource =
        findAdminResourceById(
            resourceId
        );

    if (!resource) {

        console.error(
            "Admin resource not found:",
            resourceId
        );

        showAdminNotification(
            "The selected resource could not be found.",
            "error"
        );

        return;

    }

    switch (action) {

        case "preview":

            previewAdminResource(
                resource,
                actionButton
            );

            break;


        case "edit":

            openEditResourceForm(
                resource
            );

            break;


        case "delete":

            requestResourceDeletion(
                resource
            );

            break;


        default:

            console.warn(
                "Unknown admin resource action:",
                action
            );

    }

}


/* =========================================================
   97. PREVIEW ADMIN RESOURCE
========================================================= */

function previewAdminResource(
    resource,
    actionButton
) {

    const resourceUrl =
        getAdminResourceAccessUrl(
            resource
        );

    if (!resourceUrl) {

        showAdminNotification(
            "This resource does not have an accessible URL.",
            "error"
        );

        return;

    }

    setAdminActionButtonLoading(
        actionButton,
        true
    );

    try {

        const previewWindow =
            window.open(
                resourceUrl,
                "_blank",
                "noopener,noreferrer"
            );

        if (!previewWindow) {

            showAdminNotification(
                "Your browser blocked the preview window. Allow pop-ups and try again.",
                "warning"
            );

            return;

        }

        showAdminNotification(
            resource.sourceType ===
                "external"
                ? `Opening ${resource.sourceName || "official source"}...`
                : "Opening resource preview...",
            "success"
        );

    } catch (error) {

        console.error(
            "ADMIN RESOURCE PREVIEW ERROR:",
            error
        );

        showAdminNotification(
            "Resource preview could not be opened.",
            "error"
        );

    } finally {

        window.setTimeout(
            function () {

                setAdminActionButtonLoading(
                    actionButton,
                    false
                );

            },
            350
        );

    }

}


/* =========================================================
   98. ACTION BUTTON LOADING STATE
========================================================= */

function setAdminActionButtonLoading(
    button,
    loading
) {

    if (!button) {

        return;

    }

    const isLoading =
        Boolean(
            loading
        );

    button.disabled =
        isLoading;

    button.dataset.originalHtml =
        button.dataset.originalHtml ||
        button.innerHTML;

    if (isLoading) {

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;

        return;

    }

    if (
        button.dataset.originalHtml
    ) {

        button.innerHTML =
            button.dataset.originalHtml;

    }

}


/* =========================================================
   99. OPEN EDIT RESOURCE FORM
========================================================= */

function openEditResourceForm(
    resource
) {

    if (!resource) {

        return;

    }

    resetResourceForm();

    resourceAdminState.formMode =
        "edit";

    resourceAdminState.editingResourceId =
        resource.id;

    if (
        resourceAdminDom.resourceDocumentId
    ) {

        resourceAdminDom.resourceDocumentId.value =
            resource.id;

    }

    if (
        resourceAdminDom.resourceFormTitle
    ) {

        resourceAdminDom.resourceFormTitle.textContent =
            "Edit Study Resource";

    }

    if (
        resourceAdminDom.saveResourceBtnText
    ) {

        resourceAdminDom.saveResourceBtnText.textContent =
            "Update Resource";

    }

    populateResourceForm(
        resource
    );

    resourceAdminDom.resourceFormPanel.hidden =
        false;

    window.requestAnimationFrame(
        function () {

            resourceAdminDom.resourceFormPanel
                ?.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            resourceAdminDom.resourceTitle
                ?.focus();

        }
    );

}


/* =========================================================
   100. POPULATE RESOURCE FORM
========================================================= */

function populateResourceForm(
    resource
) {

    setAdminFieldValue(
        resourceAdminDom.resourceTitle,
        resource.title
    );

    setAdminFieldValue(
        resourceAdminDom.resourceDescription,
        resource.description
    );

    setAdminFieldValue(
        resourceAdminDom.resourceType,
        resource.resourceType
    );

    setAdminFieldValue(
        resourceAdminDom.mainCategory,
        resource.mainCategory
    );

    setAdminFieldValue(
        resourceAdminDom.educationLevel,
        resource.educationLevel
    );

    setAdminFieldValue(
        resourceAdminDom.programExam,
        resource.programExam
    );

    setAdminFieldValue(
        resourceAdminDom.resourceSemester,
        resource.semester
    );

    setAdminFieldValue(
        resourceAdminDom.resourceSubject,
        resource.subject
    );

    setAdminFieldValue(
        resourceAdminDom.resourceSubjectLabel,
        resource.subjectLabel
    );

    setAdminFieldValue(
        resourceAdminDom.resourceYear,
        resource.year
    );

    setAdminFieldValue(
        resourceAdminDom.resourceLanguage,
        resource.language ||
        RESOURCE_ADMIN_CONFIG.defaultLanguage
    );

    setAdminFieldValue(
        resourceAdminDom.resourceStatus,
        resource.status ||
        RESOURCE_ADMIN_CONFIG.defaultStatus
    );

    setAdminFieldValue(
        resourceAdminDom.resourceThumbnailUrl,
        resource.thumbnailUrl
    );

    if (
        resourceAdminDom.resourceFeatured
    ) {

        resourceAdminDom.resourceFeatured.checked =
            Boolean(
                resource.featured
            );

    }

    if (
        resourceAdminDom.resourceIsNew
    ) {

        resourceAdminDom.resourceIsNew.checked =
            Boolean(
                resource.isNew
            );

    }

    setResourceSourceType(
        resource.sourceType
    );


    if (
        resource.sourceType ===
        "external"
    ) {

        populateExternalResourceFields(
            resource
        );

    } else {

        populateInternalResourceFields(
            resource
        );

    }

}


/* =========================================================
   101. POPULATE INTERNAL FIELDS
========================================================= */

function populateInternalResourceFields(
    resource
) {

    setAdminFieldValue(
        resourceAdminDom.resourceFileUrl,
        resource.fileUrl
    );

    setAdminFieldValue(
        resourceAdminDom.resourceFileSize,
        resource.fileSize
    );

    setAdminFieldValue(
        resourceAdminDom.resourcePages,
        resource.pages || ""
    );

    setAdminFieldValue(
        resourceAdminDom.resourceExternalUrl,
        ""
    );

    setAdminFieldValue(
        resourceAdminDom.resourceSourceName,
        ""
    );

    clearSelectedResourceFile();

    if (
        resource.fileUrl &&
        resourceAdminDom.selectedFileName
    ) {

        resourceAdminDom.selectedFileName.textContent =
            "Existing PDF will be preserved";

        resourceAdminDom.fileUploadBox
            ?.classList.add(
                "has-file"
            );

    }

}


/* =========================================================
   102. POPULATE EXTERNAL FIELDS
========================================================= */

function populateExternalResourceFields(
    resource
) {

    setAdminFieldValue(
        resourceAdminDom.resourceExternalUrl,
        resource.externalUrl ||
        resource.fileUrl
    );

    setAdminFieldValue(
        resourceAdminDom.resourceSourceName,
        resource.sourceName
    );

    setAdminFieldValue(
        resourceAdminDom.resourceFileUrl,
        ""
    );

    setAdminFieldValue(
        resourceAdminDom.resourceFileSize,
        ""
    );

    setAdminFieldValue(
        resourceAdminDom.resourcePages,
        resource.pages || ""
    );

    clearSelectedResourceFile();

}


/* =========================================================
   103. REQUEST RESOURCE DELETION
========================================================= */

function requestResourceDeletion(
    resource
) {

    if (!resource) {

        return;

    }

    openDeleteResourceModal(
        resource.id,
        resource.storagePath
    );

    updateDeleteModalContent(
        resource
    );

}


/* =========================================================
   104. UPDATE DELETE MODAL CONTENT
========================================================= */

function updateDeleteModalContent(
    resource
) {

    const modalDialog =
        resourceAdminDom.deleteResourceModal
            ?.querySelector(
                ".admin-modal-dialog"
            );

    if (!modalDialog) {

        return;

    }

    const titleElement =
        modalDialog.querySelector(
            "#deleteResourceModalTitle"
        );

    const descriptionElement =
        titleElement
            ?.nextElementSibling;

    if (titleElement) {

        titleElement.textContent =
            "Delete Resource?";

    }

    if (descriptionElement) {

        descriptionElement.textContent =
            resource.sourceType ===
                "internal"
                ? `"${resource.title}" will be removed from Firestore and its uploaded PDF will also be deleted when Storage cleanup runs.`
                : `"${resource.title}" will be permanently removed from the JobQuestAI resource library.`;

    }

}


/* =========================================================
   105. RESOURCE FORM CHANGE WARNING
========================================================= */

function resourceFormHasMeaningfulData() {

    const values = [

        resourceAdminDom.resourceTitle
            ?.value,

        resourceAdminDom.resourceDescription
            ?.value,

        resourceAdminDom.resourceType
            ?.value,

        resourceAdminDom.mainCategory
            ?.value,

        resourceAdminDom.resourceSubject
            ?.value,

        resourceAdminDom.resourceFileUrl
            ?.value,

        resourceAdminDom.resourceExternalUrl
            ?.value

    ];

    return (
        values.some(
            function (value) {

                return Boolean(
                    cleanAdminValue(
                        value,
                        900
                    )
                );

            }
        ) ||
        Boolean(
            resourceAdminState.selectedResourceFile
        )
    );

}


/* =========================================================
   106. REPLACE CLOSE FORM PANEL

   This version warns before discarding unsaved form data.
========================================================= */

function closeResourceFormPanel() {

    if (
        resourceAdminState.saving ||
        resourceAdminState.uploading
    ) {

        showAdminNotification(
            "Please wait until the current resource operation finishes.",
            "warning"
        );

        return;

    }

    if (
        !resourceAdminDom.resourceFormPanel ||
        resourceAdminDom.resourceFormPanel.hidden
    ) {

        return;

    }

    const hasChanges =
        resourceFormHasMeaningfulData();

    if (hasChanges) {

        const shouldClose =
            window.confirm(
                resourceAdminState.formMode ===
                    "edit"
                    ? "Discard the changes made to this resource?"
                    : "Discard this new resource form?"
            );

        if (!shouldClose) {

            return;

        }

    }

    resourceAdminDom.resourceFormPanel.hidden =
        true;

    resetResourceForm();

}


/* =========================================================
   107. RESTORE FORM MODE AFTER RESET
========================================================= */

function resetResourceFormMode() {

    resourceAdminState.formMode =
        "create";

    resourceAdminState.editingResourceId =
        "";

    if (
        resourceAdminDom.resourceFormTitle
    ) {

        resourceAdminDom.resourceFormTitle.textContent =
            "Add New Resource";

    }

    if (
        resourceAdminDom.saveResourceBtnText
    ) {

        resourceAdminDom.saveResourceBtnText.textContent =
            "Publish Resource";

    }

}


/* =========================================================
   108. INTERNAL RESOURCE INDICATOR
========================================================= */

function updateExistingPdfIndicator(
    resource
) {

    if (
        !resourceAdminDom.fileUploadBox ||
        !resourceAdminDom.selectedFileName
    ) {

        return;

    }

    if (
        resource?.sourceType ===
            "internal" &&
        resource.fileUrl
    ) {

        resourceAdminDom.fileUploadBox
            .classList.add(
                "has-file"
            );

        resourceAdminDom.selectedFileName.textContent =
            resource.fileSize
                ? `Existing PDF • ${resource.fileSize}`
                : "Existing PDF available";

        return;

    }

    clearSelectedResourceFile();

}


/* =========================================================
   109. SAFE EXTERNAL LINK CHECK
========================================================= */

function isTrustedOfficialResourceUrl(
    url
) {

    const cleanedUrl =
        cleanAdminUrl(
            url
        );

    if (!cleanedUrl) {

        return false;

    }

    try {

        const parsedUrl =
            new URL(
                cleanedUrl
            );

        const host =
            parsedUrl.hostname
                .toLowerCase();

        const suspiciousPatterns = [

            "javascript:",
            "data:",
            "file:",
            "localhost"

        ];

        if (
            suspiciousPatterns.some(
                function (pattern) {

                    return cleanedUrl
                        .toLowerCase()
                        .startsWith(
                            pattern
                        );

                }
            )
        ) {

            return false;

        }

        return (
            host.length > 3 &&
            !host.includes(
                " "
            )
        );

    } catch {

        return false;

    }

}


/* =========================================================
   110. ENHANCED EXTERNAL VALIDATION
========================================================= */

function validateExternalSourceTrust(
    errors
) {

    const externalUrl =
        cleanAdminValue(
            resourceAdminDom.resourceExternalUrl
                ?.value,
            2200
        );

    if (
        externalUrl &&
        !isTrustedOfficialResourceUrl(
            externalUrl
        )
    ) {

        registerValidationError(
            errors,
            resourceAdminDom.resourceExternalUrl,
            "Enter a valid and trusted official website URL."
        );

    }

}


/* =========================================================
   111. PREVIEW FORM RESOURCE
========================================================= */

function createPreviewResourceFromForm() {

    const resourceData =
        collectResourceFormData();

    if (!resourceData) {

        return null;

    }

    return {

        id:
            resourceAdminState.editingResourceId ||
            "resource-preview",

        ...resourceData

    };

}


/* =========================================================
   112. UNSAVED LOCAL PDF PREVIEW
========================================================= */

function previewSelectedLocalResourceFile() {

    const selectedFile =
        resourceAdminState.selectedResourceFile;

    if (!selectedFile) {

        return false;

    }

    if (
        resourceAdminState.activeObjectUrl
    ) {

        URL.revokeObjectURL(
            resourceAdminState.activeObjectUrl
        );

    }

    resourceAdminState.activeObjectUrl =
        URL.createObjectURL(
            selectedFile
        );

    const previewWindow =
        window.open(
            resourceAdminState.activeObjectUrl,
            "_blank",
            "noopener,noreferrer"
        );

    return Boolean(
        previewWindow
    );

}


/* =========================================================
   113. CLEAN LOCAL OBJECT URL
========================================================= */

function clearAdminObjectUrl() {

    if (
        !resourceAdminState.activeObjectUrl
    ) {

        return;

    }

    URL.revokeObjectURL(
        resourceAdminState.activeObjectUrl
    );

    resourceAdminState.activeObjectUrl =
        "";

}


/* =========================================================
   114. PAGE UNLOAD CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        clearAdminObjectUrl();

        if (
            resourceAdminState.searchTimer
        ) {

            window.clearTimeout(
                resourceAdminState.searchTimer
            );

        }

    }
);


/* =========================================================
   END OF RESOURCES.JS — MODULE 3B

   MODULE 3 IS NOW COMPLETE.

   APPEND MODULE 4A DIRECTLY BELOW THIS COMMENT.

   MODULE 4A WILL INCLUDE:
   - Firebase Storage imports integration
   - PDF upload with progress
   - Storage path generation
   - Existing PDF replacement
   - Download URL retrieval
========================================================= */

/* =========================================================
   RESOURCES.JS — MODULE 4 (RECOVERED FINAL)
   Firebase Storage, deletion and application startup
========================================================= */

function validateStorageAvailability() {
    const required = [
        [window.storage, "Firebase Storage"],
        [window.storageRef, "storageRef()"],
        [window.uploadBytesResumable, "uploadBytesResumable()"],
        [window.getDownloadURL, "getDownloadURL()"]
    ];
    const missing = required.filter(([value]) => !value || (typeof value !== "function" && value !== window.storage)).map(([, name]) => name);
    if (missing.length) throw new Error(`Firebase Storage is unavailable: ${missing.join(", ")}`);
}

function createResourceStoragePath(
    file,
    title
) {

    const titleSlug =
        normalizeAdminSlug(
            title
        ) || "resource";

    const extension =
        getResourceFileExtension(
            file?.name || ""
        ) || ".bin";

    const originalNameWithoutExtension =
        String(
            file?.name || "resource-file"
        ).replace(
            /\.[^.]+$/,
            ""
        );

    const safeFileName =
        normalizeAdminSlug(
            originalNameWithoutExtension
        ) || "resource-file";

    const uniqueId =
        `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`;

    return (
        `${RESOURCE_ADMIN_CONFIG.storageFolder}/` +
        `${titleSlug}/` +
        `${uniqueId}-${safeFileName}${extension}`
    );

}


function uploadResourceFileToStorage(
    file,
    storagePath
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            try {

                const reference =
                    window.storageRef(
                        window.storage,
                        storagePath
                    );

                const mimeType =
                    getResourceFileMimeType(
                        file
                    );

                const uploadTask =
                    window.uploadBytesResumable(
                        reference,
                        file,
                        {
                            contentType:
                                mimeType,

                            customMetadata: {

                                uploadedBy:
                                    getCurrentAdminIdentifier(),

                                originalName:
                                    cleanAdminValue(
                                        file.name,
                                        240
                                    ),

                                fileCategory:
                                    getResourceFileCategory(
                                        file
                                    ),

                                fileExtension:
                                    getResourceFileExtension(
                                        file.name
                                    )

                            }
                        }
                    );

                resourceAdminState.uploadTask =
                    uploadTask;

                uploadTask.on(

                    "state_changed",

                    function (snapshot) {

                        const percentage =
                            snapshot.totalBytes
                                ? (
                                    snapshot.bytesTransferred /
                                    snapshot.totalBytes
                                ) * 100
                                : 0;

                        updateUploadProgress(
                            percentage
                        );

                    },

                    function (error) {

                        resourceAdminState.uploadTask =
                            null;

                        markUploadError();

                        reject(
                            error
                        );

                    },

                    async function () {

                        try {

                            const downloadUrl =
                                await window.getDownloadURL(
                                    uploadTask.snapshot.ref
                                );

                            resourceAdminState.uploadTask =
                                null;

                            resourceAdminState.uploadedFileUrl =
                                downloadUrl;

                            resourceAdminState.uploadedFilePath =
                                storagePath;

                            updateUploadProgress(
                                100
                            );

                            resolve({
                                downloadUrl,
                                storagePath,
                                mimeType,
                                fileCategory:
                                    getResourceFileCategory(
                                        file
                                    ),
                                fileExtension:
                                    getResourceFileExtension(
                                        file.name
                                    )
                            });

                        } catch (error) {

                            resourceAdminState.uploadTask =
                                null;

                            reject(
                                error
                            );

                        }

                    }

                );

            } catch (error) {

                reject(
                    error
                );

            }

        }
    );

}

function markUploadError() {
    resourceAdminDom.resourceUploadProgress?.classList.add("is-error");
    if (resourceAdminDom.resourceUploadPercent) resourceAdminDom.resourceUploadPercent.textContent = "Failed";
}

async function deleteStorageObjectSafely(storagePath) {
    const path = cleanAdminValue(storagePath, 700);
    if (!path || !window.storage || typeof window.storageRef !== "function" || typeof window.deleteObject !== "function") return false;
    try {
        await window.deleteObject(window.storageRef(window.storage, path));
        return true;
    } catch (error) {
        const code = cleanAdminValue(error?.code, 120);
        if (!code.includes("object-not-found")) console.warn("Storage cleanup warning:", error);
        return false;
    }
}

async function confirmResourceDeletion() {
    if (resourceAdminState.deleting) return;
    const resourceId = cleanAdminValue(resourceAdminState.pendingDeleteResourceId, 140);
    if (!resourceId) return;

    const resource = findAdminResourceById(resourceId);
    resourceAdminState.deleting = true;
    setDeleteButtonLoading(true);

    try {
        if (!window.db || typeof window.doc !== "function" || typeof window.deleteDoc !== "function") throw new Error("Firebase delete service is unavailable.");
        await window.deleteDoc(window.doc(window.db, RESOURCE_ADMIN_CONFIG.collectionName, resourceId));
        if (resource?.sourceType === "internal" && resource.storagePath) await deleteStorageObjectSafely(resource.storagePath);
        resourceAdminState.allResources = resourceAdminState.allResources.filter((item) => item.id !== resourceId);
        updateAdminResourceStatistics();
        applyAdminResourceFilters();
        showAdminNotification("Resource deleted successfully.", "success");
        resourceAdminState.deleting = false;
        closeDeleteResourceModal();
    } catch (error) {
        console.error("RESOURCE DELETE ERROR:", error);
        showAdminNotification(getReadableFirestoreError(error, "Resource could not be deleted."), "error");
        resourceAdminState.deleting = false;
    } finally {
        setDeleteButtonLoading(false);
    }
}

function injectResourceNotificationStyles() {
    if (document.getElementById("resourceNotificationStyles")) return;
    const style = document.createElement("style");
    style.id = "resourceNotificationStyles";
    style.textContent = `
        .admin-resource-notification{position:fixed;right:22px;bottom:22px;z-index:2200;display:flex;align-items:center;gap:10px;max-width:min(410px,calc(100% - 30px));padding:14px 18px;color:#fff;background:#0f172a;border:1px solid rgba(255,255,255,.14);border-radius:14px;box-shadow:0 20px 50px rgba(15,23,42,.3);font-size:13px;font-weight:700;opacity:0;transform:translateY(18px);transition:opacity .22s ease,transform .22s ease}.admin-resource-notification.show{opacity:1;transform:translateY(0)}.admin-resource-notification.success i{color:#4ade80}.admin-resource-notification.error i{color:#f87171}.admin-resource-notification.warning i{color:#fbbf24}@media(max-width:600px){.admin-resource-notification{left:15px;right:15px;bottom:15px;max-width:none}}
    `;
    document.head.appendChild(style);
}

function initializeResourceDefaults() {
    if (resourceAdminDom.resourceYear && !resourceAdminDom.resourceYear.value) resourceAdminDom.resourceYear.value = String(RESOURCE_ADMIN_CONFIG.currentYear);
    setResourceSourceType(RESOURCE_ADMIN_CONFIG.defaultSourceType);
    resetUploadProgress();
}

async function startResourceAdminApplication() {
    if (resourceAdminState.initialized) return;
    try {
        validateResourceAdminElements();
        injectResourceNotificationStyles();
        initializeResourceDefaults();
        bindResourceAdminEvents();
        resourceAdminState.initialized = true;
        await loadAdminResources();
        console.log("Study Resources Admin Loaded Successfully");
    } catch (error) {
        console.error("RESOURCES ADMIN INITIALIZATION ERROR:", error);
        renderResourceLoadError(error.message || "Resources Admin could not be initialized.");
        showAdminNotification(error.message || "Resources Admin could not be initialized.", "error");
    }
}

