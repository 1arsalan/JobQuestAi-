"use strict";

/* =========================================================
   JOBQUESTAI — AI LIVE RECRUITER

   MOCK INTERVIEW JAVASCRIPT
   PART 1

   Includes:
   - Configuration
   - Application state
   - DOM references
   - Form validation
   - Character counter
   - CV upload handling
   - Drag and drop
   - Screen management
   - Backend session creation
   - Connection-screen progress
   - Bootstrap modal helpers

   IMPORTANT:
   Gemini Live microphone/audio connection will be added
   directly below this code in Part 2.
========================================================= */


/* =========================================================
   1. APPLICATION CONFIGURATION
========================================================= */

const INTERVIEW_CONFIG = Object.freeze({

    apiBaseUrl:
        "http://localhost:3000/api/live-interview",

    sessionEndpoint:
        "/session",

    reportEndpoint:
        "/report",

    healthEndpoint:
        "/health",

    maximumCvSize:
        5 * 1024 * 1024,

    allowedCvExtensions: [
        ".pdf",
        ".docx"
    ],

    maximumBackgroundLength:
        3500,

    minimumCandidateNameLength:
        2,

    minimumTargetJobLength:
        2,

    connectionTimeout:
        30000

});


/* =========================================================
   2. APPLICATION STATE
========================================================= */

const interviewState = {

    currentScreen:
        "setup",

    candidate:
        null,

    selectedCvFile:
        null,

    session:
        null,

    liveSession:
        null,

    microphoneStream:
        null,

    microphoneMuted:
        false,

    interviewActive:
        false,

    interviewEnding:
        false,

    naturalCompletion:
        false,

    connectionCancelled:
        false,

    transcript:
        [],

    partialUserTranscript:
        "",

    partialAiTranscript:
        "",

    startedAt:
        null,

    endedAt:
        null,

    elapsedSeconds:
        0,

    timerInterval:
        null,

    connectionAbortController:
        null,

    audioContext:
        null,

    audioWorkletNode:
        null,

    microphoneSource:
        null,

    outputAudioQueue:
        [],

    outputPlaying:
        false

};


/* =========================================================
   3. DOM REFERENCES
========================================================= */

const dom = {

    /* Main screens */

    setupScreen:
        document.getElementById(
            "setupScreen"
        ),

    connectionScreen:
        document.getElementById(
            "connectionScreen"
        ),

    liveInterviewScreen:
        document.getElementById(
            "liveInterviewScreen"
        ),

    reportLoadingScreen:
        document.getElementById(
            "reportLoadingScreen"
        ),

    reportScreen:
        document.getElementById(
            "reportScreen"
        ),


    /* Setup form */

    interviewSetupForm:
        document.getElementById(
            "interviewSetupForm"
        ),

    candidateName:
        document.getElementById(
            "candidateName"
        ),

    targetJob:
        document.getElementById(
            "targetJob"
        ),

    interviewType:
        document.getElementById(
            "interviewType"
        ),

    experienceLevel:
        document.getElementById(
            "experienceLevel"
        ),

    interviewLanguage:
        document.getElementById(
            "interviewLanguage"
        ),

    questionCount:
        document.getElementById(
            "questionCount"
        ),

    candidateBackground:
        document.getElementById(
            "candidateBackground"
        ),

    backgroundCharacterCount:
        document.getElementById(
            "backgroundCharacterCount"
        ),

    candidateCv:
        document.getElementById(
            "candidateCv"
        ),

    cvUploadZone:
        document.getElementById(
            "cvUploadZone"
        ),

    selectedCvFile:
        document.getElementById(
            "selectedCvFile"
        ),

    selectedCvName:
        document.getElementById(
            "selectedCvName"
        ),

    selectedCvSize:
        document.getElementById(
            "selectedCvSize"
        ),

    removeCvBtn:
        document.getElementById(
            "removeCvBtn"
        ),

    setupError:
        document.getElementById(
            "setupError"
        ),

    setupErrorText:
        document.getElementById(
            "setupErrorText"
        ),

    startInterviewBtn:
        document.getElementById(
            "startInterviewBtn"
        ),

    startButtonDefaultContent:
        document.querySelector(
            "#startInterviewBtn .button-default-content"
        ),

    startButtonLoadingContent:
        document.querySelector(
            "#startInterviewBtn .button-loading-content"
        ),


    /* Connection screen */

    connectionTitle:
        document.getElementById(
            "connectionTitle"
        ),

    connectionMessage:
        document.getElementById(
            "connectionMessage"
        ),

    connectionProgressBar:
        document.getElementById(
            "connectionProgressBar"
        ),

    connectionSteps:
        document.getElementById(
            "connectionSteps"
        ),

    cancelConnectionBtn:
        document.getElementById(
            "cancelConnectionBtn"
        ),


    /* Live interview */

    liveCallMeta:
        document.getElementById(
            "liveCallMeta"
        ),

    liveConnectionStatus:
        document.getElementById(
            "liveConnectionStatus"
        ),

    interviewTimer:
        document.getElementById(
            "interviewTimer"
        ),

    aiAvatar:
        document.getElementById(
            "aiAvatar"
        ),

    interviewActivityStatus:
        document.getElementById(
            "interviewActivityStatus"
        ),

    audioVisualizer:
        document.getElementById(
            "audioVisualizer"
        ),

    currentSpeechCard:
        document.getElementById(
            "currentSpeechCard"
        ),

    currentSpeakerLabel:
        document.getElementById(
            "currentSpeakerLabel"
        ),

    currentSpeechText:
        document.getElementById(
            "currentSpeechText"
        ),

    muteMicrophoneBtn:
        document.getElementById(
            "muteMicrophoneBtn"
        ),

    toggleTranscriptBtn:
        document.getElementById(
            "toggleTranscriptBtn"
        ),

    endInterviewBtn:
        document.getElementById(
            "endInterviewBtn"
        ),

    microphoneState:
        document.getElementById(
            "microphoneState"
        ),

    transcriptPanel:
        document.getElementById(
            "transcriptPanel"
        ),

    closeTranscriptBtn:
        document.getElementById(
            "closeTranscriptBtn"
        ),

    transcriptMessages:
        document.getElementById(
            "transcriptMessages"
        ),


    /* Report */

    reportLoadingMessage:
        document.getElementById(
            "reportLoadingMessage"
        ),

    analysisProgressBar:
        document.getElementById(
            "analysisProgressBar"
        ),

    reportContainer:
        document.getElementById(
            "reportContainer"
        ),

    printReportBtn:
        document.getElementById(
            "printReportBtn"
        ),

    downloadReportBtn:
        document.getElementById(
            "downloadReportBtn"
        ),

    startNewInterviewBtn:
        document.getElementById(
            "startNewInterviewBtn"
        ),


    /* Error modal */

    interviewErrorModal:
        document.getElementById(
            "interviewErrorModal"
        ),

    interviewErrorMessage:
        document.getElementById(
            "interviewErrorMessage"
        ),

    retryInterviewBtn:
        document.getElementById(
            "retryInterviewBtn"
        ),


    /* End confirmation modal */

    endInterviewModal:
        document.getElementById(
            "endInterviewModal"
        ),

    endInterviewModalMessage:
        document.getElementById(
            "endInterviewModalMessage"
        ),

    insufficientEvidenceWarning:
        document.getElementById(
            "insufficientEvidenceWarning"
        ),

    confirmEndInterviewBtn:
        document.getElementById(
            "confirmEndInterviewBtn"
        )

};


/* =========================================================
   4. BOOTSTRAP MODAL INSTANCES
========================================================= */

let errorModalInstance =
    null;

let endInterviewModalInstance =
    null;


/* =========================================================
   5. APPLICATION INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeInterviewApplication
);


function initializeInterviewApplication() {

    validateRequiredDomElements();

    initializeBootstrapModals();

    bindSetupFormEvents();

    bindCvUploadEvents();

    bindConnectionEvents();

    bindLiveScreenEvents();

    bindReportEvents();

    updateBackgroundCharacterCount();

    resetConnectionProgress();

    showScreen(
        "setup"
    );

}


/* =========================================================
   6. REQUIRED DOM VALIDATION
========================================================= */

function validateRequiredDomElements() {

    const requiredElements = {

        interviewSetupForm:
            dom.interviewSetupForm,

        candidateName:
            dom.candidateName,

        targetJob:
            dom.targetJob,

        startInterviewBtn:
            dom.startInterviewBtn,

        setupScreen:
            dom.setupScreen,

        connectionScreen:
            dom.connectionScreen,

        liveInterviewScreen:
            dom.liveInterviewScreen,

        reportScreen:
            dom.reportScreen

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

    if (missingElements.length > 0) {

        throw new Error(
            `Missing required interview elements: ${missingElements.join(", ")}`
        );

    }

}


/* =========================================================
   7. BOOTSTRAP MODALS
========================================================= */

function initializeBootstrapModals() {

    if (
        typeof bootstrap ===
        "undefined"
    ) {

        console.warn(
            "Bootstrap JavaScript is not loaded."
        );

        return;

    }

    if (dom.interviewErrorModal) {

        errorModalInstance =
            new bootstrap.Modal(
                dom.interviewErrorModal,
                {
                    backdrop:
                        "static",

                    keyboard:
                        true
                }
            );

    }

    if (dom.endInterviewModal) {

        endInterviewModalInstance =
            new bootstrap.Modal(
                dom.endInterviewModal,
                {
                    backdrop:
                        "static",

                    keyboard:
                        true
                }
            );

    }

}


/* =========================================================
   8. SETUP FORM EVENTS
========================================================= */

function bindSetupFormEvents() {

    dom.interviewSetupForm.addEventListener(
        "submit",
        handleSetupFormSubmit
    );

    dom.candidateName.addEventListener(
        "input",
        function () {

            clearFieldError(
                dom.candidateName
            );

            hideSetupError();

        }
    );

    dom.targetJob.addEventListener(
        "input",
        function () {

            clearFieldError(
                dom.targetJob
            );

            hideSetupError();

        }
    );

    dom.candidateBackground.addEventListener(
        "input",
        updateBackgroundCharacterCount
    );

}


/* =========================================================
   9. CHARACTER COUNTER
========================================================= */

function updateBackgroundCharacterCount() {

    const currentLength =
        String(
            dom.candidateBackground
                ?.value || ""
        ).length;

    if (!dom.backgroundCharacterCount) {
        return;
    }

    dom.backgroundCharacterCount.textContent =
        `${currentLength} / ${INTERVIEW_CONFIG.maximumBackgroundLength}`;

    dom.backgroundCharacterCount.classList.toggle(
        "near-limit",
        currentLength >= 3000 &&
        currentLength < INTERVIEW_CONFIG.maximumBackgroundLength
    );

    dom.backgroundCharacterCount.classList.toggle(
        "limit-reached",
        currentLength >=
        INTERVIEW_CONFIG.maximumBackgroundLength
    );

}


/* =========================================================
   10. CV UPLOAD EVENTS
========================================================= */

function bindCvUploadEvents() {

    if (
        !dom.candidateCv ||
        !dom.cvUploadZone
    ) {

        return;

    }

    dom.candidateCv.addEventListener(
        "change",
        handleCvInputChange
    );

    dom.removeCvBtn?.addEventListener(
        "click",
        removeSelectedCv
    );

    [
        "dragenter",
        "dragover"
    ].forEach(
        function (eventName) {

            dom.cvUploadZone.addEventListener(
                eventName,
                handleCvDragEnter
            );

        }
    );

    [
        "dragleave",
        "drop"
    ].forEach(
        function (eventName) {

            dom.cvUploadZone.addEventListener(
                eventName,
                handleCvDragLeave
            );

        }
    );

    dom.cvUploadZone.addEventListener(
        "drop",
        handleCvFileDrop
    );

}


function handleCvInputChange(event) {

    const selectedFile =
        event.target.files?.[0] ||
        null;

    if (!selectedFile) {

        removeSelectedCv();

        return;

    }

    processSelectedCv(
        selectedFile
    );

}


function handleCvDragEnter(event) {

    event.preventDefault();
    event.stopPropagation();

    dom.cvUploadZone.classList.add(
        "drag-active"
    );

}


function handleCvDragLeave(event) {

    event.preventDefault();
    event.stopPropagation();

    dom.cvUploadZone.classList.remove(
        "drag-active"
    );

}


function handleCvFileDrop(event) {

    event.preventDefault();
    event.stopPropagation();

    const droppedFile =
        event.dataTransfer
            ?.files?.[0] ||
        null;

    if (!droppedFile) {
        return;
    }

    processSelectedCv(
        droppedFile
    );

    try {

        const transfer =
            new DataTransfer();

        transfer.items.add(
            droppedFile
        );

        dom.candidateCv.files =
            transfer.files;

    } catch (error) {

        console.warn(
            "Browser did not allow programmatic file assignment:",
            error.message
        );

    }

}


function processSelectedCv(file) {

    try {

        validateCvFile(
            file
        );

        interviewState.selectedCvFile =
            file;

        renderSelectedCv(
            file
        );

        dom.cvUploadZone.classList.remove(
            "has-error"
        );

        dom.cvUploadZone.classList.add(
            "has-file"
        );

        hideSetupError();

    } catch (error) {

        interviewState.selectedCvFile =
            null;

        resetCvInput();

        dom.cvUploadZone.classList.remove(
            "has-file"
        );

        dom.cvUploadZone.classList.add(
            "has-error"
        );

        showSetupError(
            error.message
        );

    }

}


function validateCvFile(file) {

    const fileName =
        String(
            file?.name || ""
        ).toLowerCase();

    const fileExtension =
        fileName.includes(".")
            ? fileName.slice(
                fileName.lastIndexOf(".")
            )
            : "";

    if (
        !INTERVIEW_CONFIG
            .allowedCvExtensions
            .includes(fileExtension)
    ) {

        throw new Error(
            "Only PDF and DOCX CV files are supported."
        );

    }

    if (
        Number(file.size) >
        INTERVIEW_CONFIG.maximumCvSize
    ) {

        throw new Error(
            "CV file must be 5 MB or smaller."
        );

    }

    if (
        Number(file.size) <= 0
    ) {

        throw new Error(
            "The selected CV file is empty."
        );

    }

}


function renderSelectedCv(file) {

    if (
        !dom.selectedCvFile ||
        !dom.selectedCvName ||
        !dom.selectedCvSize
    ) {

        return;

    }

    dom.selectedCvName.textContent =
        file.name;

    dom.selectedCvSize.textContent =
        formatFileSize(
            file.size
        );

    dom.selectedCvFile.hidden =
        false;

}


function removeSelectedCv() {

    interviewState.selectedCvFile =
        null;

    resetCvInput();

    dom.selectedCvFile.hidden =
        true;

    dom.selectedCvName.textContent =
        "CV file";

    dom.selectedCvSize.textContent =
        "0 KB";

    dom.cvUploadZone.classList.remove(
        "has-file",
        "has-error",
        "drag-active"
    );

}


function resetCvInput() {

    if (dom.candidateCv) {

        dom.candidateCv.value =
            "";

    }

}


/* =========================================================
   11. FORM SUBMISSION
========================================================= */

async function handleSetupFormSubmit(event) {

    event.preventDefault();

    if (
        interviewState.interviewActive ||
        interviewState.connectionAbortController
    ) {

        return;

    }

    hideSetupError();

    clearAllFieldErrors();

    try {

        const setup =
            collectAndValidateInterviewSetup();

        interviewState.candidate =
            setup;

        interviewState.connectionCancelled =
            false;

        interviewState.transcript =
            [];

        interviewState.elapsedSeconds =
            0;

        setStartButtonLoading(
            true
        );

        showScreen(
            "connection"
        );

        resetConnectionProgress();

        updateConnectionStage(
            "session",
            {
                title:
                    "Preparing your interview...",

                message:
                    "Creating a secure AI interview session.",

                progress:
                    18
            }
        );

        const sessionData =
            await requestInterviewSession(
                setup
            );
        console.log(
            "LIVE INTERVIEW SESSION DATA:",
            sessionData
        );

        
        console.log("========== CV RECEIVED BY BACKEND ==========");
        console.log("Uploaded:", sessionData.cv?.uploaded);
        console.log("File Name:", sessionData.cv?.fileName);
        console.log(
            "Extracted Characters:",
            sessionData.cv?.extractedCharacters
        );
        console.log("CV Preview:");
        console.log(
            sessionData.cv?.preview ||
            "No CV text received"
        );
        console.log("============================================");

        if (
            interviewState.connectionCancelled
        ) {

            return;

        }

        interviewState.session =
            sessionData;

        updateConnectionStage(
            "microphone",
            {
                title:
                    "Secure session created",

                message:
                    "Preparing microphone access for your live interview.",

                progress:
                    48,

                completePrevious:
                    true
            }
        );

        /*
           This function will be implemented in Part 2.
           It will:
           - request microphone permission
           - connect to Gemini Live
           - stream PCM audio
           - receive AI audio and transcripts
        */

        await connectGeminiLiveSession(
            sessionData
        );

    } catch (error) {

        console.error(
            "INTERVIEW START ERROR:",
            error
        );

        await cleanupFailedConnection();

        showScreen(
            "setup"
        );

        setStartButtonLoading(
            false
        );

        showInterviewError(
            normalizeApplicationError(
                error
            )
        );

    }

}


/* =========================================================
   12. COLLECT AND VALIDATE SETUP
========================================================= */

function collectAndValidateInterviewSetup() {

    const candidateName =
        cleanSingleLine(
            dom.candidateName.value,
            100
        );

    const targetJob =
        cleanSingleLine(
            dom.targetJob.value,
            160
        );

    const interviewType =
        cleanSingleLine(
            dom.interviewType.value,
            100
        );

    const experienceLevel =
        cleanSingleLine(
            dom.experienceLevel.value,
            100
        );

    const interviewLanguage =
        cleanSingleLine(
            dom.interviewLanguage.value,
            60
        );

    const questionCount =
        Number.parseInt(
            dom.questionCount.value,
            10
        );

    const candidateBackground =
        cleanMultilineText(
            dom.candidateBackground.value,
            INTERVIEW_CONFIG.maximumBackgroundLength
        );

    let firstInvalidElement =
        null;

    if (
        candidateName.length <
        INTERVIEW_CONFIG.minimumCandidateNameLength
    ) {

        setFieldError(
            dom.candidateName,
            "Please enter your valid full name."
        );

        firstInvalidElement =
            firstInvalidElement ||
            dom.candidateName;

    }

    if (
        targetJob.length <
        INTERVIEW_CONFIG.minimumTargetJobLength
    ) {

        setFieldError(
            dom.targetJob,
            "Please enter your target job or role."
        );

        firstInvalidElement =
            firstInvalidElement ||
            dom.targetJob;

    }

    if (
        interviewState.selectedCvFile
    ) {

        try {

            validateCvFile(
                interviewState.selectedCvFile
            );

        } catch (error) {

            showSetupError(
                error.message
            );

            firstInvalidElement =
                firstInvalidElement ||
                dom.candidateCv;

        }

    }

    if (firstInvalidElement) {

        firstInvalidElement.focus();

        throw new Error(
            "Please correct the highlighted interview information."
        );

    }

    return {

        candidateName,

        targetJob,

        interviewType:
            interviewType ||
            "Mixed Interview",

        experienceLevel:
            experienceLevel ||
            "Fresh Graduate",

        interviewLanguage:
            interviewLanguage ||
            "English",

        questionCount:
            Number.isFinite(questionCount)
                ? questionCount
                : 5,

        candidateBackground,

        cvFile:
            interviewState.selectedCvFile

    };

}


/* =========================================================
   13. BUILD BACKEND FORM DATA
========================================================= */

function buildSessionFormData(setup) {

    const formData =
        new FormData();

    formData.append(
        "candidateName",
        setup.candidateName
    );

    formData.append(
        "targetJob",
        setup.targetJob
    );

    formData.append(
        "interviewType",
        setup.interviewType
    );

    formData.append(
        "experienceLevel",
        setup.experienceLevel
    );

    formData.append(
        "interviewLanguage",
        setup.interviewLanguage
    );

    formData.append(
        "questionCount",
        String(
            setup.questionCount
        )
    );

    formData.append(
        "candidateBackground",
        setup.candidateBackground
    );

    if (setup.cvFile) {

        formData.append(
            "cv",
            setup.cvFile
        );

    }

    return formData;

}


/* =========================================================
   14. BACKEND SESSION REQUEST
========================================================= */

async function requestInterviewSession(setup) {

    interviewState.connectionAbortController =
        new AbortController();

    const timeoutId =
        window.setTimeout(
            function () {

                interviewState
                    .connectionAbortController
                    ?.abort();

            },
            INTERVIEW_CONFIG.connectionTimeout
        );

    try {

        const response =
            await fetch(
                `${INTERVIEW_CONFIG.apiBaseUrl}${INTERVIEW_CONFIG.sessionEndpoint}`,
                {
                    method:
                        "POST",

                    body:
                        buildSessionFormData(
                            setup
                        ),

                    signal:
                        interviewState
                            .connectionAbortController
                            .signal
                }
            );

        const responseText =
            await response.text();

        let responseData = {};

        try {

            responseData =
                responseText
                    ? JSON.parse(
                        responseText
                    )
                    : {};

        } catch (parseError) {

            throw new Error(
                "The interview server returned an unreadable response."
            );

        }

        if (!response.ok) {

            const serverError =
                new Error(
                    responseData.error ||
                    "The AI interview session could not be created."
                );

            serverError.code =
                responseData.code ||
                "SESSION_REQUEST_FAILED";

            serverError.status =
                response.status;

            throw serverError;

        }

        if (
            !responseData.token ||
            !responseData.model ||
            !responseData.instructions
        ) {

            throw new Error(
                "The interview server did not return complete Gemini Live session details."
            );

        }

        return responseData;

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            if (
                interviewState
                    .connectionCancelled
            ) {

                throw new Error(
                    "Interview connection was cancelled."
                );

            }

            throw new Error(
                "The interview server took too long to respond. Confirm that the server and internet connection are working."
            );

        }

        if (
            String(error.message)
                .toLowerCase()
                .includes(
                    "failed to fetch"
                )
        ) {

            throw new Error(
                "Could not connect to the JobQuestAI server. Confirm that server.js is running on http://localhost:3000."
            );

        }

        throw error;

    } finally {

        window.clearTimeout(
            timeoutId
        );

        interviewState.connectionAbortController =
            null;

    }

}


/* =========================================================
   15. CONNECTION SCREEN EVENTS
========================================================= */

function bindConnectionEvents() {

    dom.cancelConnectionBtn
        ?.addEventListener(
            "click",
            cancelInterviewConnection
        );

}


async function cancelInterviewConnection() {

    interviewState.connectionCancelled =
        true;

    interviewState
        .connectionAbortController
        ?.abort();

    try {

        if (
            typeof disconnectGeminiLiveSession ===
            "function"
        ) {

            await disconnectGeminiLiveSession({
                preserveEvidence:
                    false
            });

        }

    } catch (error) {

        console.warn(
            "Connection cancellation cleanup warning:",
            error.message
        );

    }

    resetInterviewStateForNewSession();

    setStartButtonLoading(
        false
    );

    showScreen(
        "setup"
    );

}


/* =========================================================
   16. CONNECTION PROGRESS
========================================================= */

function resetConnectionProgress() {

    dom.connectionScreen
        ?.classList.remove(
            "is-error",
            "is-success"
        );

    if (
        dom.connectionProgressBar
    ) {

        dom.connectionProgressBar.style.width =
            "18%";

        dom.connectionProgressBar.classList.add(
            "animated"
        );

    }

    const steps =
        getConnectionStepElements();

    steps.forEach(
        function (step) {

            step.classList.remove(
                "active",
                "complete",
                "failed"
            );

            step.removeAttribute(
                "aria-current"
            );

        }
    );

    const firstStep =
        getConnectionStep(
            "session"
        );

    firstStep?.classList.add(
        "active"
    );

    firstStep?.setAttribute(
        "aria-current",
        "step"
    );

}


function updateConnectionStage(
    stage,
    options = {}
) {

    const {
        title,
        message,
        progress,
        completePrevious = false
    } = options;

    if (
        typeof title ===
        "string"
    ) {

        dom.connectionTitle.textContent =
            title;

    }

    if (
        typeof message ===
        "string"
    ) {

        dom.connectionMessage.textContent =
            message;

    }

    if (
        Number.isFinite(progress)
    ) {

        dom.connectionProgressBar.style.width =
            `${Math.max(0, Math.min(100, progress))}%`;

    }

    const steps =
        getConnectionStepElements();

    const targetIndex =
        steps.findIndex(
            function (element) {

                return (
                    element.dataset.step ===
                    stage
                );

            }
        );

    steps.forEach(
        function (step, index) {

            step.classList.remove(
                "active"
            );

            step.removeAttribute(
                "aria-current"
            );

            if (
                completePrevious &&
                index < targetIndex
            ) {

                step.classList.add(
                    "complete"
                );

            }

        }
    );

    const activeStep =
        getConnectionStep(
            stage
        );

    activeStep?.classList.add(
        "active"
    );

    activeStep?.setAttribute(
        "aria-current",
        "step"
    );

}


function markConnectionReady() {

    const steps =
        getConnectionStepElements();

    steps.forEach(
        function (step) {

            step.classList.remove(
                "active",
                "failed"
            );

            step.classList.add(
                "complete"
            );

            step.removeAttribute(
                "aria-current"
            );

        }
    );

    dom.connectionProgressBar.style.width =
        "100%";

    dom.connectionScreen.classList.add(
        "is-success"
    );

}


function markConnectionFailed(
    stage = "recruiter"
) {

    const failedStep =
        getConnectionStep(
            stage
        );

    failedStep?.classList.remove(
        "active",
        "complete"
    );

    failedStep?.classList.add(
        "failed"
    );

    dom.connectionScreen.classList.add(
        "is-error"
    );

}


function getConnectionStepElements() {

    return Array.from(
        dom.connectionSteps
            ?.querySelectorAll(
                ".connection-step"
            ) || []
    );

}


function getConnectionStep(stage) {

    return dom.connectionSteps
        ?.querySelector(
            `[data-step="${stage}"]`
        ) || null;

}


/* =========================================================
   17. SCREEN MANAGEMENT
========================================================= */

function showScreen(screenName) {

    const screenMap = {

        setup:
            dom.setupScreen,

        connection:
            dom.connectionScreen,

        live:
            dom.liveInterviewScreen,

        reportLoading:
            dom.reportLoadingScreen,

        report:
            dom.reportScreen

    };

    Object.entries(
        screenMap
    ).forEach(
        function ([name, element]) {

            if (!element) {
                return;
            }

            element.hidden =
                name !== screenName;

        }
    );

    interviewState.currentScreen =
        screenName;

    window.scrollTo({
        top:
            0,

        behavior:
            screenName === "live"
                ? "auto"
                : "smooth"
    });

}


/* =========================================================
   18. START BUTTON STATE
========================================================= */

function setStartButtonLoading(isLoading) {

    dom.startInterviewBtn.disabled =
        Boolean(isLoading);

    dom.startButtonDefaultContent.hidden =
        Boolean(isLoading);

    dom.startButtonLoadingContent.hidden =
        !isLoading;

}


/* =========================================================
   19. FIELD VALIDATION UI
========================================================= */

function setFieldError(
    inputElement,
    message
) {

    if (!inputElement) {
        return;
    }

    clearFieldError(
        inputElement
    );

    inputElement.classList.add(
        "is-invalid"
    );

    const formField =
        inputElement.closest(
            ".form-field"
        );

    formField?.classList.add(
        "has-error"
    );

    const errorElement =
        document.createElement(
            "div"
        );

    errorElement.className =
        "field-error-message";

    errorElement.innerHTML = `
        <i class="bi bi-exclamation-circle-fill"></i>
        <span>${escapeHtml(message)}</span>
    `;

    formField?.appendChild(
        errorElement
    );

}


function clearFieldError(inputElement) {

    if (!inputElement) {
        return;
    }

    inputElement.classList.remove(
        "is-invalid"
    );

    const formField =
        inputElement.closest(
            ".form-field"
        );

    formField?.classList.remove(
        "has-error"
    );

    formField
        ?.querySelector(
            ".field-error-message"
        )
        ?.remove();

}


function clearAllFieldErrors() {

    [
        dom.candidateName,
        dom.targetJob,
        dom.interviewType,
        dom.experienceLevel,
        dom.interviewLanguage,
        dom.questionCount,
        dom.candidateBackground
    ].forEach(
        clearFieldError
    );

}


/* =========================================================
   20. SETUP ERROR
========================================================= */

function showSetupError(message) {

    dom.setupErrorText.textContent =
        message;

    dom.setupError.hidden =
        false;

}


function hideSetupError() {

    dom.setupError.hidden =
        true;

}


/* =========================================================
   21. ERROR MODAL
========================================================= */

function showInterviewError(message) {

    dom.interviewErrorMessage.textContent =
        message;

    if (errorModalInstance) {

        errorModalInstance.show();

    } else {

        window.alert(
            message
        );

    }

}


/* =========================================================
   22. LIVE AND REPORT EVENT PLACEHOLDERS
   Completed handlers will be added in later parts.
========================================================= */

function bindLiveScreenEvents() {

    dom.toggleTranscriptBtn
        ?.addEventListener(
            "click",
            function () {

                dom.transcriptPanel
                    ?.classList.toggle(
                        "open"
                    );

            }
        );

    dom.closeTranscriptBtn
        ?.addEventListener(
            "click",
            function () {

                dom.transcriptPanel
                    ?.classList.remove(
                        "open"
                    );

            }
        );

}


function bindReportEvents() {

    dom.printReportBtn
        ?.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    dom.startNewInterviewBtn
        ?.addEventListener(
            "click",
            resetApplicationForNewInterview
        );

    dom.retryInterviewBtn
        ?.addEventListener(
            "click",
            function () {

                errorModalInstance?.hide();

                showScreen(
                    "setup"
                );

            }
        );

}


/* =========================================================
   23. FAILED CONNECTION CLEANUP
========================================================= */

async function cleanupFailedConnection() {

    interviewState.interviewActive =
        false;

    interviewState.interviewEnding =
        false;

    interviewState.microphoneMuted =
        false;

    stopInterviewTimer();

    if (
        typeof disconnectGeminiLiveSession ===
        "function"
    ) {

        try {

            await disconnectGeminiLiveSession({
                preserveEvidence:
                    false
            });

        } catch (error) {

            console.warn(
                "Gemini Live cleanup warning:",
                error.message
            );

        }

    }

}


/* =========================================================
   24. RESET APPLICATION
========================================================= */

async function resetApplicationForNewInterview() {

    if (
        typeof disconnectGeminiLiveSession ===
        "function"
    ) {

        try {

            await disconnectGeminiLiveSession({
                preserveEvidence:
                    false
            });

        } catch (error) {

            console.warn(
                "Session reset cleanup warning:",
                error.message
            );

        }

    }

    resetInterviewStateForNewSession();

    clearTranscriptInterface();

    resetConnectionProgress();

    setStartButtonLoading(
        false
    );

    showScreen(
        "setup"
    );

}


function resetInterviewStateForNewSession() {

    stopInterviewTimer();

    interviewState.currentScreen =
        "setup";

    interviewState.candidate =
        null;

    interviewState.session =
        null;

    interviewState.liveSession =
        null;

    interviewState.microphoneStream =
        null;

    interviewState.microphoneMuted =
        false;

    interviewState.interviewActive =
        false;

    interviewState.interviewEnding =
        false;

    interviewState.naturalCompletion =
        false;

    interviewState.connectionCancelled =
        false;

    interviewState.transcript =
        [];

    interviewState.partialUserTranscript =
        "";

    interviewState.partialAiTranscript =
        "";

    interviewState.startedAt =
        null;

    interviewState.endedAt =
        null;

    interviewState.elapsedSeconds =
        0;

    interviewState.outputAudioQueue =
        [];

    interviewState.outputPlaying =
        false;

}


/* =========================================================
   25. TIMER BASE FUNCTIONS
   Full timer integration will be used in Part 3.
========================================================= */

function startInterviewTimer() {

    stopInterviewTimer();

    interviewState.elapsedSeconds =
        0;

    interviewState.startedAt =
        new Date();

    updateInterviewTimerDisplay();

    interviewState.timerInterval =
        window.setInterval(
            function () {

                interviewState.elapsedSeconds +=
                    1;

                updateInterviewTimerDisplay();

            },
            1000
        );

}


function stopInterviewTimer() {

    if (
        interviewState.timerInterval
    ) {

        window.clearInterval(
            interviewState.timerInterval
        );

    }

    interviewState.timerInterval =
        null;

}


function updateInterviewTimerDisplay() {

    if (!dom.interviewTimer) {
        return;
    }

    dom.interviewTimer.textContent =
        formatDuration(
            interviewState.elapsedSeconds
        );

}


/* =========================================================
   26. TRANSCRIPT INTERFACE RESET
========================================================= */

function clearTranscriptInterface() {

    if (!dom.transcriptMessages) {
        return;
    }

    dom.transcriptMessages.innerHTML = `
        <div class="transcript-empty-state">
            <i class="bi bi-chat-square-dots"></i>

            <p>
                The conversation transcript will appear here
                when the interview begins.
            </p>
        </div>
    `;

}


/* =========================================================
   27. TEXT UTILITIES
========================================================= */

function cleanSingleLine(
    value,
    maximumLength = 200
) {

    return String(
        value || ""
    )
        .replace(/\0/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(
            0,
            maximumLength
        );

}


function cleanMultilineText(
    value,
    maximumLength = 3500
) {

    return String(
        value || ""
    )
        .replace(/\0/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(
            0,
            maximumLength
        );

}


function escapeHtml(value) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        String(value || "");

    return element.innerHTML;

}


/* =========================================================
   28. FORMATTING UTILITIES
========================================================= */

function formatFileSize(bytes) {

    const safeBytes =
        Number(bytes) || 0;

    if (safeBytes < 1024) {

        return `${safeBytes} B`;

    }

    if (
        safeBytes <
        1024 * 1024
    ) {

        return `${
            (
                safeBytes /
                1024
            ).toFixed(1)
        } KB`;

    }

    return `${
        (
            safeBytes /
            (
                1024 *
                1024
            )
        ).toFixed(2)
    } MB`;

}


function formatDuration(totalSeconds) {

    const safeSeconds =
        Math.max(
            0,
            Number(totalSeconds) || 0
        );

    const minutes =
        String(
            Math.floor(
                safeSeconds / 60
            )
        ).padStart(
            2,
            "0"
        );

    const seconds =
        String(
            Math.floor(
                safeSeconds % 60
            )
        ).padStart(
            2,
            "0"
        );

    return `${minutes}:${seconds}`;

}


/* =========================================================
   29. ERROR NORMALIZATION
========================================================= */

function normalizeApplicationError(error) {

    const message =
        String(
            error?.message ||
            "An unexpected interview error occurred."
        );

    if (
        message
            .toLowerCase()
            .includes(
                "gemini_api_key"
            )
    ) {

        return (
            "The Gemini API key is missing from the backend. " +
            "Add GEMINI_API_KEY to server/.env and restart server.js."
        );

    }

    if (
        message
            .toLowerCase()
            .includes(
                "quota"
            )
    ) {

        return (
            "Gemini API quota is currently unavailable or exhausted. " +
            "Check your Google AI Studio project and API limits."
        );

    }

    return message;

}


/* =========================================================
   30. PAGE-LEAVE SAFETY
========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        if (
            interviewState
                .connectionAbortController
        ) {

            interviewState
                .connectionAbortController
                .abort();

        }

        if (
            interviewState.microphoneStream
        ) {

            interviewState
                .microphoneStream
                .getTracks()
                .forEach(
                    function (track) {

                        track.stop();

                    }
                );

        }

        if (
            interviewState.liveSession &&
            typeof interviewState
                .liveSession
                .close ===
                "function"
        ) {

            try {

                interviewState
                    .liveSession
                    .close();

            } catch (error) {

                console.warn(
                    "Page-leave session cleanup warning:",
                    error.message
                );

            }

        }

    }
);


/* =========================================================
   END OF MOCK INTERVIEW JAVASCRIPT — PART 1

   PASTE PART 2 DIRECTLY BELOW THIS COMMENT.

   PART 2 WILL INCLUDE:
   - Gemini GenAI SDK browser loading
   - Gemini Live connection
   - Ephemeral token authentication
   - Microphone permission
   - AudioContext configuration
   - PCM 16kHz microphone streaming
   - PCM 24kHz AI audio playback
   - Gemini callbacks
   - Input and output transcription
   - Barge-in / interruption
========================================================= */

/* =========================================================
   JOBQUESTAI — AI LIVE RECRUITER

   MOCK INTERVIEW JAVASCRIPT
   PART 2

   Includes:
   - Gemini Live WebSocket connection
   - Ephemeral token authentication
   - Microphone permission
   - AudioWorklet microphone capture
   - PCM 16 kHz input conversion
   - PCM 24 kHz AI audio playback
   - Input and output transcription
   - AI interruption handling
   - Mute and unmute
   - Live speaking/listening/thinking UI
========================================================= */


/* =========================================================
   31. GEMINI LIVE CONFIGURATION
========================================================= */

const GEMINI_LIVE_CONFIG = Object.freeze({

    websocketBaseUrl:
        "wss://generativelanguage.googleapis.com/ws/" +
        "google.ai.generativelanguage.v1alpha." +
        "GenerativeService.BidiGenerateContentConstrained",

    inputSampleRate:
        16000,

    outputSampleRate:
        24000,

    microphoneChannelCount:
        1,

    voiceName:
        "Kore",

    websocketSetupTimeout:
        20000,

    microphoneChunkSize:
        2048

});


/* =========================================================
   32. GEMINI LIVE RUNTIME STATE
========================================================= */

const geminiRuntime = {

    websocket:
        null,

    websocketSetupComplete:
        false,

    websocketClosing:
        false,

    inputAudioContext:
        null,

    outputAudioContext:
        null,

    microphoneSource:
        null,

    microphoneWorklet:
        null,

    microphoneSilentGain:
        null,

    microphoneWorkletUrl:
        null,

    audioPlaybackSources:
        new Set(),

    nextAudioPlaybackTime:
        0,

    aiCurrentlySpeaking:
        false,

    userCurrentlySpeaking:
        false,

    currentUserTranscript:
        "",

    currentAiTranscript:
        "",

    setupResolve:
        null,

    setupReject:
        null,

    setupTimeout:
        null

};


/* =========================================================
   33. CONNECT GEMINI LIVE SESSION
========================================================= */

async function connectGeminiLiveSession(
    sessionData
) {

    if (
        !sessionData?.token ||
        !sessionData?.model ||
        !sessionData?.instructions
    ) {

        throw new Error(
            "Gemini Live session details are incomplete."
        );

    }

    if (
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices
            .getUserMedia !==
            "function"
    ) {

        throw new Error(
            "This browser does not support live microphone access. " +
            "Use the latest Google Chrome or Microsoft Edge."
        );

    }

    await prepareLiveMicrophone();

    if (
        interviewState.connectionCancelled
    ) {

        throw new Error(
            "Interview connection was cancelled."
        );

    }

    updateConnectionStage(
        "recruiter",
        {
            title:
                "Connecting to AI recruiter",

            message:
                "Starting the secure live voice connection.",

            progress:
                72,

            completePrevious:
                true
        }
    );

    await openGeminiLiveWebSocket(
        sessionData
    );

    if (
        interviewState.connectionCancelled
    ) {

        throw new Error(
            "Interview connection was cancelled."
        );

    }

    markConnectionReady();

    dom.connectionTitle.textContent =
        "AI recruiter is ready";

    dom.connectionMessage.textContent =
        "Your live professional interview is starting.";

    await delay(
        450
    );

    startLiveInterviewInterface(
        sessionData
    );

}


/* =========================================================
   34. MICROPHONE PERMISSION
========================================================= */

async function prepareLiveMicrophone() {

    updateConnectionStage(
        "microphone",
        {
            title:
                "Allow microphone access",

            message:
                "Your browser may ask for permission to use your microphone.",

            progress:
                48,

            completePrevious:
                true
        }
    );

    try {

        interviewState.microphoneStream =
            await navigator.mediaDevices
                .getUserMedia({

                    audio: {

                        echoCancellation:
                            true,

                        noiseSuppression:
                            true,

                        autoGainControl:
                            true,

                        channelCount:
                            GEMINI_LIVE_CONFIG
                                .microphoneChannelCount

                    },

                    video:
                        false

                });

    } catch (error) {

        if (
            error.name ===
                "NotAllowedError" ||
            error.name ===
                "PermissionDeniedError"
        ) {

            throw new Error(
                "Microphone permission was denied. " +
                "Allow microphone access from the browser address bar " +
                "and start the interview again."
            );

        }

        if (
            error.name ===
                "NotFoundError" ||
            error.name ===
                "DevicesNotFoundError"
        ) {

            throw new Error(
                "No microphone was detected. " +
                "Connect a working microphone and try again."
            );

        }

        if (
            error.name ===
                "NotReadableError" ||
            error.name ===
                "TrackStartError"
        ) {

            throw new Error(
                "The microphone is currently being used by another application. " +
                "Close other recording or calling applications and try again."
            );

        }

        throw new Error(
            error.message ||
            "The microphone could not be started."
        );

    }

    const microphoneTrack =
        interviewState
            .microphoneStream
            .getAudioTracks()[0];

    if (!microphoneTrack) {

        throw new Error(
            "No active microphone audio track was found."
        );

    }

    microphoneTrack.enabled =
        true;

}


/* =========================================================
   35. OPEN GEMINI LIVE WEBSOCKET
========================================================= */

function openGeminiLiveWebSocket(
    sessionData
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            cleanupGeminiSetupPromise();

            geminiRuntime.setupResolve =
                resolve;

            geminiRuntime.setupReject =
                reject;

            geminiRuntime.websocketClosing =
                false;

            geminiRuntime.websocketSetupComplete =
                false;

            const token =
                encodeURIComponent(
                    sessionData.token
                );

            const websocketUrl =
                `${GEMINI_LIVE_CONFIG.websocketBaseUrl}` +
                `?access_token=${token}`;

            const websocket =
                new WebSocket(
                    websocketUrl
                );

            geminiRuntime.websocket =
                websocket;

            interviewState.liveSession =
                websocket;

            geminiRuntime.setupTimeout =
                window.setTimeout(
                    function () {

                        if (
                            !geminiRuntime
                                .websocketSetupComplete
                        ) {

                            rejectGeminiSetup(
                                new Error(
                                    "Gemini Live connection timed out before setup completed."
                                )
                            );

                            closeGeminiWebSocket();

                        }

                    },
                    GEMINI_LIVE_CONFIG
                        .websocketSetupTimeout
                );


            websocket.onopen =
                function () {

                    sendGeminiSetupMessage(
                        sessionData
                    );

                };


            websocket.onmessage =
                async function (event) {

                    try {

                        await handleGeminiWebSocketMessage(
                            event.data
                        );

                    } catch (error) {

                        console.error(
                            "GEMINI MESSAGE HANDLING ERROR:",
                            error
                        );

                        showLiveConnectionError(
                            error.message ||
                            "A Gemini Live response could not be processed."
                        );

                    }

                };


            websocket.onerror =
                function (event) {

                    console.error(
                        "GEMINI WEBSOCKET ERROR:",
                        event
                    );

                    if (
                        !geminiRuntime
                            .websocketSetupComplete
                    ) {

                        rejectGeminiSetup(
                            new Error(
                                "The Gemini Live voice connection could not be established."
                            )
                        );

                    } else {

                        setLiveConnectionStatus(
                            "disconnected",
                            "Connection error"
                        );

                        showLiveConnectionError(
                            "The live AI connection encountered an error."
                        );

                    }

                };


            websocket.onclose =
                function (event) {

                    const wasIntentional =
                        geminiRuntime
                            .websocketClosing ||
                        interviewState
                            .interviewEnding ||
                        interviewState
                            .connectionCancelled;

                    geminiRuntime.websocketSetupComplete =
                        false;

                    geminiRuntime.websocket =
                        null;

                    interviewState.liveSession =
                        null;

                    if (
                        !wasIntentional &&
                        !interviewState
                            .interviewEnding
                    ) {

                        if (
                            geminiRuntime
                                .setupReject
                        ) {

                            rejectGeminiSetup(
                                new Error(
                                    event.reason ||
                                    "Gemini Live closed the connection before the interview started."
                                )
                            );

                        } else if (
                            interviewState
                                .interviewActive
                        ) {

                            setLiveConnectionStatus(
                                "disconnected",
                                "Disconnected"
                            );

                            showLiveConnectionError(
                                event.reason ||
                                "The AI recruiter connection ended unexpectedly."
                            );

                        }

                    }

                };

        }
    );

}


/* =========================================================
   36. GEMINI SETUP MESSAGE
========================================================= */

function sendGeminiSetupMessage(
    sessionData
) {

    const websocket =
        geminiRuntime.websocket;

    if (
        !websocket ||
        websocket.readyState !==
            WebSocket.OPEN
    ) {

        rejectGeminiSetup(
            new Error(
                "Gemini Live WebSocket is not open."
            )
        );

        return;

    }

    const modelName =
        String(
            sessionData.model || ""
        ).startsWith("models/")
            ? sessionData.model
            : `models/${sessionData.model}`;

    const setupMessage = {

        setup: {

            model:
                modelName,

            generationConfig: {

                responseModalities: [
                    "AUDIO"
                ],

                temperature:
                    0.7,

                speechConfig: {

                    voiceConfig: {

                        prebuiltVoiceConfig: {

                            voiceName:
                                GEMINI_LIVE_CONFIG
                                    .voiceName

                        }

                    }

                }

            },


            inputAudioTranscription:
                {},

            outputAudioTranscription:
                {}

        }

    };

    console.log(
        "Sending Gemini Live setup:",
        {
            model:
                modelName,

            responseModalities: [
                "AUDIO"
            ],

            voiceName:
                GEMINI_LIVE_CONFIG
                    .voiceName
        }
    );

    websocket.send(
        JSON.stringify(
            setupMessage
        )
    );

}


/* =========================================================
   37. HANDLE GEMINI SERVER MESSAGE
========================================================= */

async function handleGeminiWebSocketMessage(
    rawData
) {

    const messageText =
        await websocketPayloadToText(
            rawData
        );

    let message;

    try {

        message =
            JSON.parse(
                messageText
            );

    } catch (error) {

        console.warn(
            "Unreadable Gemini Live message:",
            messageText
        );

        return;

    }

    if (
        message.setupComplete !==
        undefined
    ) {

        handleGeminiSetupComplete();

    }

    if (message.serverContent) {

        await handleGeminiServerContent(
            message.serverContent
        );

    }

    if (message.goAway) {

        handleGeminiGoAway(
            message.goAway
        );

    }

    if (message.sessionResumptionUpdate) {

        console.debug(
            "Gemini session resumption update received."
        );

    }

    if (message.error) {

        const errorMessage =
            message.error.message ||
            "Gemini Live returned an error.";

        throw new Error(
            errorMessage
        );

    }

}


/* =========================================================
   38. SETUP COMPLETE
========================================================= */

async function handleGeminiSetupComplete() {

    if (
        geminiRuntime
            .websocketSetupComplete
    ) {

        return;

    }

    geminiRuntime.websocketSetupComplete =
        true;

    window.clearTimeout(
        geminiRuntime.setupTimeout
    );

    geminiRuntime.setupTimeout =
        null;

    try {

        await initializeInputAudioPipeline();

        await initializeOutputAudioPipeline();

    } catch (error) {

        rejectGeminiSetup(
            error
        );

        closeGeminiWebSocket();

        return;

    }

    if (
        typeof geminiRuntime
            .setupResolve ===
        "function"
    ) {

        const resolve =
            geminiRuntime.setupResolve;

        geminiRuntime.setupResolve =
            null;

        geminiRuntime.setupReject =
            null;

        resolve();

    }

}


/* =========================================================
   39. INPUT AUDIO PIPELINE
========================================================= */

async function initializeInputAudioPipeline() {

    if (
        !interviewState
            .microphoneStream
    ) {

        throw new Error(
            "Microphone stream is unavailable."
        );

    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {

        throw new Error(
            "This browser does not support Web Audio."
        );

    }

    const audioContext =
        new AudioContextClass();

    interviewState.audioContext =
        audioContext;

    geminiRuntime.inputAudioContext =
        audioContext;

    if (
        audioContext.state ===
        "suspended"
    ) {

        await audioContext.resume();

    }

    const workletCode = `
        class JobQuestMicrophoneProcessor
            extends AudioWorkletProcessor {

            constructor() {
                super();

                this.bufferSize = ${GEMINI_LIVE_CONFIG.microphoneChunkSize};
                this.buffer = new Float32Array(this.bufferSize);
                this.writeIndex = 0;
            }

            process(inputs) {

                const input = inputs[0];

                if (!input || !input[0]) {
                    return true;
                }

                const channelData = input[0];

                for (
                    let index = 0;
                    index < channelData.length;
                    index += 1
                ) {

                    this.buffer[this.writeIndex] =
                        channelData[index];

                    this.writeIndex += 1;

                    if (
                        this.writeIndex >=
                        this.bufferSize
                    ) {

                        const completedBuffer =
                            this.buffer.slice();

                        this.port.postMessage(
                            {
                                samples:
                                    completedBuffer,

                                sampleRate:
                                    sampleRate
                            },
                            [
                                completedBuffer.buffer
                            ]
                        );

                        this.buffer =
                            new Float32Array(
                                this.bufferSize
                            );

                        this.writeIndex =
                            0;

                    }

                }

                return true;

            }

        }

        registerProcessor(
            "jobquest-microphone-processor",
            JobQuestMicrophoneProcessor
        );
    `;

    const workletBlob =
        new Blob(
            [
                workletCode
            ],
            {
                type:
                    "application/javascript"
            }
        );

    const workletUrl =
        URL.createObjectURL(
            workletBlob
        );

    geminiRuntime.microphoneWorkletUrl =
        workletUrl;

    await audioContext
        .audioWorklet
        .addModule(
            workletUrl
        );

    const microphoneSource =
        audioContext
            .createMediaStreamSource(
                interviewState
                    .microphoneStream
            );

    const microphoneWorklet =
        new AudioWorkletNode(
            audioContext,
            "jobquest-microphone-processor"
        );

    const silentGain =
        audioContext.createGain();

    silentGain.gain.value =
        0;

    microphoneWorklet.port.onmessage =
        function (event) {

            if (
                !interviewState
                    .interviewActive &&
                interviewState
                    .currentScreen !==
                    "connection"
            ) {

                return;

            }

            if (
                interviewState
                    .microphoneMuted
            ) {

                return;

            }

            const sourceSamples =
                event.data?.samples;

            const sourceSampleRate =
                Number(
                    event.data?.sampleRate
                );

            if (
                !sourceSamples ||
                !sourceSampleRate
            ) {

                return;

            }

            const resampled =
                resampleFloat32Audio(
                    sourceSamples,
                    sourceSampleRate,
                    GEMINI_LIVE_CONFIG
                        .inputSampleRate
                );

            const pcmData =
                float32ToPcm16(
                    resampled
                );

            sendMicrophonePcmChunk(
                pcmData
            );

        };

    microphoneSource.connect(
        microphoneWorklet
    );

    microphoneWorklet.connect(
        silentGain
    );

    silentGain.connect(
        audioContext.destination
    );

    geminiRuntime.microphoneSource =
        microphoneSource;

    geminiRuntime.microphoneWorklet =
        microphoneWorklet;

    geminiRuntime.microphoneSilentGain =
        silentGain;

    interviewState.microphoneSource =
        microphoneSource;

    interviewState.audioWorkletNode =
        microphoneWorklet;

}


/* =========================================================
   40. OUTPUT AUDIO PIPELINE
========================================================= */

async function initializeOutputAudioPipeline() {

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {

        throw new Error(
            "This browser does not support AI audio playback."
        );

    }

    const outputContext =
        new AudioContextClass({
            sampleRate:
                GEMINI_LIVE_CONFIG
                    .outputSampleRate
        });

    if (
        outputContext.state ===
        "suspended"
    ) {

        await outputContext.resume();

    }

    geminiRuntime.outputAudioContext =
        outputContext;

    geminiRuntime.nextAudioPlaybackTime =
        outputContext.currentTime;

}


/* =========================================================
   41. SEND MICROPHONE PCM
========================================================= */

function sendMicrophonePcmChunk(
    pcm16Array
) {

    const websocket =
        geminiRuntime.websocket;

    if (
        !websocket ||
        websocket.readyState !==
            WebSocket.OPEN ||
        !geminiRuntime
            .websocketSetupComplete ||
        interviewState
            .microphoneMuted
    ) {

        return;

    }

    const base64Audio =
        arrayBufferToBase64(
            pcm16Array.buffer
        );

    const audioMessage = {

        realtimeInput: {

            audio: {

                data:
                    base64Audio,

                mimeType:
                    `audio/pcm;rate=` +
                    `${GEMINI_LIVE_CONFIG.inputSampleRate}`

            }

        }

    };

    websocket.send(
        JSON.stringify(
            audioMessage
        )
    );

}


/* =========================================================
   42. SERVER CONTENT
========================================================= */

async function handleGeminiServerContent(
    serverContent
) {

    if (
        serverContent.interrupted
    ) {

        handleGeminiInterruption();

    }

    if (
        serverContent.inputTranscription
            ?.text
    ) {

        handleUserTranscriptionChunk(
            serverContent
                .inputTranscription
                .text
        );

    }

    if (
        serverContent.outputTranscription
            ?.text
    ) {

        handleAiTranscriptionChunk(
            serverContent
                .outputTranscription
                .text
        );

    }

    const parts =
        serverContent
            .modelTurn
            ?.parts ||
        [];

    for (
        const part of parts
    ) {

        if (
            part.inlineData?.data
        ) {

            const mimeType =
                String(
                    part.inlineData
                        .mimeType ||
                    ""
                ).toLowerCase();

            if (
                !mimeType ||
                mimeType.includes(
                    "audio"
                )
            ) {

                await queueGeminiAudioChunk(
                    part.inlineData.data
                );

            }

        }

        if (
            typeof part.text ===
                "string" &&
            part.text.trim()
        ) {

            handleAiTranscriptionChunk(
                part.text
            );

        }

    }

    if (
        serverContent.turnComplete ||
        serverContent.generationComplete
    ) {

        handleGeminiTurnComplete();

    }

}


/* =========================================================
   43. PLAY GEMINI AUDIO
========================================================= */

async function queueGeminiAudioChunk(
    base64Audio
) {

    const audioContext =
        geminiRuntime
            .outputAudioContext;

    if (!audioContext) {
        return;
    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        await audioContext.resume();

    }

    const pcmBuffer =
        base64ToArrayBuffer(
            base64Audio
        );

    const pcmSamples =
        new Int16Array(
            pcmBuffer
        );

    if (!pcmSamples.length) {
        return;
    }

    const floatSamples =
        new Float32Array(
            pcmSamples.length
        );

    for (
        let index = 0;
        index < pcmSamples.length;
        index += 1
    ) {

        floatSamples[index] =
            Math.max(
                -1,
                Math.min(
                    1,
                    pcmSamples[index] /
                    32768
                )
            );

    }

    const audioBuffer =
        audioContext.createBuffer(
            1,
            floatSamples.length,
            GEMINI_LIVE_CONFIG
                .outputSampleRate
        );

    audioBuffer
        .getChannelData(0)
        .set(
            floatSamples
        );

    const source =
        audioContext
            .createBufferSource();

    source.buffer =
        audioBuffer;

    source.connect(
        audioContext.destination
    );

    const minimumStartTime =
        audioContext.currentTime +
        0.025;

    const scheduledStart =
        Math.max(
            minimumStartTime,
            geminiRuntime
                .nextAudioPlaybackTime
        );

    source.start(
        scheduledStart
    );

    geminiRuntime.nextAudioPlaybackTime =
        scheduledStart +
        audioBuffer.duration;

    geminiRuntime
        .audioPlaybackSources
        .add(
            source
        );

    source.onended =
        function () {

            geminiRuntime
                .audioPlaybackSources
                .delete(
                    source
                );

            if (
                geminiRuntime
                    .audioPlaybackSources
                    .size === 0 &&
                geminiRuntime
                    .aiCurrentlySpeaking
            ) {

                setAiSpeakingState(
                    false
                );

            }

        };

    setAiSpeakingState(
        true
    );

}


/* =========================================================
   44. TRANSCRIPTION CHUNKS
========================================================= */

function handleUserTranscriptionChunk(
    text
) {

    const cleanChunk =
        String(
            text || ""
        );

    if (!cleanChunk.trim()) {
        return;
    }

    geminiRuntime.currentUserTranscript =
        appendTranscriptChunk(
            geminiRuntime
                .currentUserTranscript,
            cleanChunk
        );

    interviewState.partialUserTranscript =
        geminiRuntime
            .currentUserTranscript;

    geminiRuntime.userCurrentlySpeaking =
        true;

    setUserSpeakingState(
        true
    );

    updateCurrentSpeechDisplay(
        "user",
        geminiRuntime
            .currentUserTranscript,
        true
    );

    renderPartialTranscriptMessage(
        "user",
        geminiRuntime
            .currentUserTranscript
    );

}


function handleAiTranscriptionChunk(
    text
) {

    const cleanChunk =
        String(
            text || ""
        );

    if (!cleanChunk.trim()) {
        return;
    }

    geminiRuntime.currentAiTranscript =
        appendTranscriptChunk(
            geminiRuntime
                .currentAiTranscript,
            cleanChunk
        );

    interviewState.partialAiTranscript =
        geminiRuntime
            .currentAiTranscript;

    setAiSpeakingState(
        true
    );

    updateCurrentSpeechDisplay(
        "ai",
        geminiRuntime
            .currentAiTranscript,
        true
    );

    renderPartialTranscriptMessage(
        "ai",
        geminiRuntime
            .currentAiTranscript
    );

}


/* =========================================================
   45. TURN COMPLETE
========================================================= */

function handleGeminiTurnComplete() {

    finalizeCurrentUserTranscript();

    finalizeCurrentAiTranscript();

    geminiRuntime.userCurrentlySpeaking =
        false;

    setUserSpeakingState(
        false
    );

    if (
        geminiRuntime
            .audioPlaybackSources
            .size === 0
    ) {

        setAiSpeakingState(
            false
        );

    }

    if (
        interviewState.interviewActive &&
        !geminiRuntime.aiCurrentlySpeaking
    ) {

        setInterviewActivityState(
            "listening",
            "Your turn — speak naturally"
        );

    }

}


/* =========================================================
   46. FINALIZE TRANSCRIPTS
========================================================= */

function finalizeCurrentUserTranscript() {

    const text =
        cleanTranscriptText(
            geminiRuntime
                .currentUserTranscript
        );

    if (text) {

        addFinalTranscriptEntry(
            "user",
            text
        );

    }

    geminiRuntime.currentUserTranscript =
        "";

    interviewState.partialUserTranscript =
        "";

    removePartialTranscriptMessage(
        "user"
    );

}


function finalizeCurrentAiTranscript() {

    const text =
        cleanTranscriptText(
            geminiRuntime
                .currentAiTranscript
        );

    if (text) {

        addFinalTranscriptEntry(
            "ai",
            text
        );

        if (
            isInterviewCompletionMessage(
                text
            )
        ) {

            interviewState.naturalCompletion =
                true;

            window.setTimeout(
                function () {

                    if (
                        interviewState
                            .interviewActive &&
                        !interviewState
                            .interviewEnding
                    ) {

                        requestNaturalInterviewCompletion();

                    }

                },
                1100
            );

        }

    }

    geminiRuntime.currentAiTranscript =
        "";

    interviewState.partialAiTranscript =
        "";

    removePartialTranscriptMessage(
        "ai"
    );

}


/* =========================================================
   47. TRANSCRIPT STORAGE
========================================================= */

function addFinalTranscriptEntry(
    role,
    text
) {

    const cleanText =
        cleanTranscriptText(
            text
        );

    if (!cleanText) {
        return;
    }

    const previousEntry =
        interviewState.transcript[
            interviewState
                .transcript
                .length - 1
        ];

    if (
        previousEntry &&
        previousEntry.role === role &&
        previousEntry.text === cleanText
    ) {

        return;

    }

    const entry = {

        id:
            `${role}-${Date.now()}-` +
            Math.random()
                .toString(16)
                .slice(2),

        role,

        text:
            cleanText,

        createdAt:
            new Date()
                .toISOString(),

        elapsedSeconds:
            interviewState
                .elapsedSeconds

    };

    interviewState
        .transcript
        .push(
            entry
        );

    removeTranscriptEmptyState();

    renderFinalTranscriptMessage(
        entry
    );

}


/* =========================================================
   48. TRANSCRIPT UI
========================================================= */

function renderPartialTranscriptMessage(
    role,
    text
) {

    if (!dom.transcriptMessages) {
        return;
    }

    removeTranscriptEmptyState();

    let element =
        dom.transcriptMessages
            .querySelector(
                `.transcript-message.partial[data-role="${role}"]`
            );

    if (!element) {

        element =
            createTranscriptMessageElement(
                {
                    role,
                    text,
                    partial:
                        true,
                    elapsedSeconds:
                        interviewState
                            .elapsedSeconds
                }
            );

        dom.transcriptMessages
            .appendChild(
                element
            );

    } else {

        const bubble =
            element.querySelector(
                ".transcript-message-bubble"
            );

        if (bubble) {

            bubble.textContent =
                text;

        }

    }

    scrollTranscriptToBottom();

}


function renderFinalTranscriptMessage(
    entry
) {

    removePartialTranscriptMessage(
        entry.role
    );

    const element =
        createTranscriptMessageElement(
            {
                role:
                    entry.role,

                text:
                    entry.text,

                partial:
                    false,

                elapsedSeconds:
                    entry.elapsedSeconds
            }
        );

    dom.transcriptMessages
        ?.appendChild(
            element
        );

    scrollTranscriptToBottom();

}


function createTranscriptMessageElement({

    role,
    text,
    partial,
    elapsedSeconds

}) {

    const message =
        document.createElement(
            "div"
        );

    message.className =
        `transcript-message ${role}`;

    message.dataset.role =
        role;

    if (partial) {

        message.classList.add(
            "partial"
        );

    }

    const label =
        role === "ai"
            ? "AI Recruiter"
            : "Candidate";

    message.innerHTML = `
        <span class="transcript-message-label">
            ${label}
        </span>

        <div class="transcript-message-bubble"></div>

        <span class="transcript-message-time">
            ${formatDuration(elapsedSeconds)}
        </span>
    `;

    message
        .querySelector(
            ".transcript-message-bubble"
        )
        .textContent =
            text;

    return message;

}


function removePartialTranscriptMessage(
    role
) {

    dom.transcriptMessages
        ?.querySelector(
            `.transcript-message.partial[data-role="${role}"]`
        )
        ?.remove();

}


function removeTranscriptEmptyState() {

    dom.transcriptMessages
        ?.querySelector(
            ".transcript-empty-state"
        )
        ?.remove();

}


function scrollTranscriptToBottom() {

    if (!dom.transcriptMessages) {
        return;
    }

    dom.transcriptMessages.scrollTop =
        dom.transcriptMessages
            .scrollHeight;

}


/* =========================================================
   49. LIVE INTERVIEW INTERFACE START
========================================================= */

function startLiveInterviewInterface(
    sessionData
) {

    interviewState.interviewActive =
        true;

    interviewState.interviewEnding =
        false;

    interviewState.startedAt =
        new Date();

    interviewState.endedAt =
        null;

    interviewState.elapsedSeconds =
        0;

    interviewState.microphoneMuted =
        false;

    clearTranscriptInterface();

    updateLiveCandidateMeta(
        sessionData
    );

    showScreen(
        "live"
    );

    startInterviewTimer();

    setLiveConnectionStatus(
        "connected",
        "Connected"
    );

    setInterviewActivityState(
        "thinking",
        "AI recruiter is preparing the opening..."
    );

    setMicrophoneUi(
        false
    );

    sendGeminiOpeningRequest();

}


/* =========================================================
   50. START OPENING CONVERSATION
========================================================= */

function sendGeminiOpeningRequest() {

    sendGeminiRealtimeText(
        "Begin the interview now according to your system instructions. " +
        "Greet the candidate naturally, introduce yourself briefly, " +
        "confirm that the candidate can hear you, and wait for the spoken response. " +
        "Ask only one thing at a time."
    );

}


function sendGeminiRealtimeText(
    text
) {

    const websocket =
        geminiRuntime.websocket;

    if (
        !websocket ||
        websocket.readyState !==
            WebSocket.OPEN ||
        !geminiRuntime
            .websocketSetupComplete
    ) {

        throw new Error(
            "Gemini Live connection is not ready."
        );

    }

    websocket.send(
        JSON.stringify({

            realtimeInput: {

                text:
                    String(text)

            }

        })
    );

}


/* =========================================================
   51. LIVE UI STATES
========================================================= */

function setAiSpeakingState(
    speaking
) {

    geminiRuntime.aiCurrentlySpeaking =
        Boolean(
            speaking
        );

    if (speaking) {

        setInterviewActivityState(
            "speaking",
            "AI recruiter is speaking..."
        );

        dom.currentSpeechCard
            ?.classList.remove(
                "user-speaking"
            );

    } else if (
        interviewState.interviewActive &&
        !geminiRuntime
            .userCurrentlySpeaking
    ) {

        setInterviewActivityState(
            "listening",
            "Your turn — speak naturally"
        );

    }

}


function setUserSpeakingState(
    speaking
) {

    geminiRuntime.userCurrentlySpeaking =
        Boolean(
            speaking
        );

    if (speaking) {

        setInterviewActivityState(
            "listening",
            "Listening to your answer..."
        );

        dom.currentSpeechCard
            ?.classList.add(
                "user-speaking"
            );

    } else {

        dom.currentSpeechCard
            ?.classList.remove(
                "user-speaking"
            );

        if (
            interviewState.interviewActive &&
            !geminiRuntime
                .aiCurrentlySpeaking
        ) {

            setInterviewActivityState(
                "thinking",
                "AI recruiter is understanding your answer..."
            );

        }

    }

}


function setInterviewActivityState(
    state,
    message
) {

    dom.aiAvatar
        ?.classList.remove(
            "speaking",
            "listening",
            "thinking",
            "muted"
        );

    dom.audioVisualizer
        ?.classList.remove(
            "active",
            "listening",
            "thinking"
        );

    if (state === "speaking") {

        dom.aiAvatar
            ?.classList.add(
                "speaking"
            );

        dom.audioVisualizer
            ?.classList.add(
                "active"
            );

    } else if (
        state === "listening"
    ) {

        dom.aiAvatar
            ?.classList.add(
                "listening"
            );

        dom.audioVisualizer
            ?.classList.add(
                "active",
                "listening"
            );

    } else if (
        state === "thinking"
    ) {

        dom.aiAvatar
            ?.classList.add(
                "thinking"
            );

        dom.audioVisualizer
            ?.classList.add(
                "thinking"
            );

    }

    if (
        interviewState
            .microphoneMuted
    ) {

        dom.aiAvatar
            ?.classList.add(
                "muted"
            );

    }

    if (
        dom.interviewActivityStatus
    ) {

        dom.interviewActivityStatus.textContent =
            message;

    }

}


function updateCurrentSpeechDisplay(
    role,
    text,
    partial = false
) {

    if (
        !dom.currentSpeechText ||
        !dom.currentSpeakerLabel
    ) {

        return;

    }

    dom.currentSpeakerLabel.textContent =
        role === "ai"
            ? "AI Recruiter"
            : "You";

    dom.currentSpeechText.textContent =
        text;

    dom.currentSpeechCard
        ?.classList.toggle(
            "user-speaking",
            role === "user"
        );

    dom.currentSpeechCard
        ?.classList.toggle(
            "is-partial",
            Boolean(partial)
        );

}


/* =========================================================
   52. CANDIDATE META
========================================================= */

function updateLiveCandidateMeta(
    sessionData
) {

    const candidate =
        sessionData.candidate ||
        {};

    if (dom.liveCallMeta) {

        dom.liveCallMeta.textContent =
            [
                candidate.targetJob,
                candidate.interviewType,
                candidate.language
            ]
                .filter(Boolean)
                .join(" • ") ||
            "Live Professional Interview";

    }

}


/* =========================================================
   53. LIVE CONNECTION STATUS
========================================================= */

function setLiveConnectionStatus(
    state,
    text
) {

    if (!dom.liveConnectionStatus) {
        return;
    }

    dom.liveConnectionStatus
        .classList.remove(
            "connecting",
            "reconnecting",
            "disconnected"
        );

    if (
        state &&
        state !== "connected"
    ) {

        dom.liveConnectionStatus
            .classList.add(
                state
            );

    }

    const iconClass =
        state === "disconnected"
            ? "bi-wifi-off"
            : state === "reconnecting"
                ? "bi-arrow-repeat"
                : "bi-wifi";

    dom.liveConnectionStatus.innerHTML = `
        <i class="bi ${iconClass}"></i>
        <span>${escapeHtml(text)}</span>
    `;

}


/* =========================================================
   54. MUTE / UNMUTE
========================================================= */

dom.muteMicrophoneBtn
    ?.addEventListener(
        "click",
        toggleMicrophoneMute
    );


function toggleMicrophoneMute() {

    if (
        !interviewState
            .microphoneStream ||
        !interviewState
            .interviewActive
    ) {

        return;

    }

    interviewState.microphoneMuted =
        !interviewState
            .microphoneMuted;

    interviewState
        .microphoneStream
        .getAudioTracks()
        .forEach(
            function (track) {

                track.enabled =
                    !interviewState
                        .microphoneMuted;

            }
        );

    setMicrophoneUi(
        interviewState
            .microphoneMuted
    );

}


function setMicrophoneUi(
    muted
) {

    dom.muteMicrophoneBtn
        ?.classList.toggle(
            "muted",
            muted
        );

    if (
        dom.muteMicrophoneBtn
    ) {

        dom.muteMicrophoneBtn.innerHTML =
            muted
                ? `
                    <i class="bi bi-mic-mute-fill"></i>
                    <span>Unmute</span>
                `
                : `
                    <i class="bi bi-mic-fill"></i>
                    <span>Mute</span>
                `;

        dom.muteMicrophoneBtn.setAttribute(
            "aria-label",
            muted
                ? "Unmute microphone"
                : "Mute microphone"
        );

    }

    dom.microphoneState
        ?.classList.toggle(
            "muted",
            muted
        );

    if (dom.microphoneState) {

        dom.microphoneState.innerHTML =
            muted
                ? `
                    <span class="microphone-state-icon">
                        <i class="bi bi-mic-mute-fill"></i>
                    </span>

                    <span>
                        Your microphone is muted.
                    </span>
                `
                : `
                    <span class="microphone-state-icon">
                        <i class="bi bi-mic-fill"></i>
                    </span>

                    <span>
                        Your microphone is active. Speak naturally
                        when the recruiter finishes.
                    </span>
                `;

    }

    if (muted) {

        dom.aiAvatar
            ?.classList.add(
                "muted"
            );

    } else {

        dom.aiAvatar
            ?.classList.remove(
                "muted"
            );

    }

}


/* =========================================================
   55. BARGE-IN / INTERRUPTION
========================================================= */

function handleGeminiInterruption() {

    stopAllGeminiAudioPlayback();

    setAiSpeakingState(
        false
    );

    setInterviewActivityState(
        "listening",
        "Listening to your interruption..."
    );

}


/* =========================================================
   56. STOP AUDIO PLAYBACK
========================================================= */

function stopAllGeminiAudioPlayback() {

    geminiRuntime
        .audioPlaybackSources
        .forEach(
            function (source) {

                try {

                    source.stop();

                } catch (error) {

                    // Source may already have ended.

                }

                try {

                    source.disconnect();

                } catch (error) {

                    // Ignore cleanup warning.

                }

            }
        );

    geminiRuntime
        .audioPlaybackSources
        .clear();

    if (
        geminiRuntime
            .outputAudioContext
    ) {

        geminiRuntime.nextAudioPlaybackTime =
            geminiRuntime
                .outputAudioContext
                .currentTime;

    }

    geminiRuntime.aiCurrentlySpeaking =
        false;

}


/* =========================================================
   57. GEMINI GO-AWAY MESSAGE
========================================================= */

function handleGeminiGoAway(
    goAway
) {

    const timeLeft =
        goAway?.timeLeft;

    console.warn(
        "Gemini Live session is approaching closure.",
        timeLeft || ""
    );

    setLiveConnectionStatus(
        "reconnecting",
        "Session ending soon"
    );

}


/* =========================================================
   58. DISCONNECT GEMINI LIVE SESSION
========================================================= */

async function disconnectGeminiLiveSession({

    preserveEvidence = true

} = {}) {

    geminiRuntime.websocketClosing =
        true;

    stopAllGeminiAudioPlayback();

    stopMicrophoneCapture();

    await closeAudioContexts();

    closeGeminiWebSocket();

    cleanupGeminiSetupPromise();

    geminiRuntime.websocketSetupComplete =
        false;

    geminiRuntime.aiCurrentlySpeaking =
        false;

    geminiRuntime.userCurrentlySpeaking =
        false;

    geminiRuntime.currentUserTranscript =
        "";

    geminiRuntime.currentAiTranscript =
        "";

    interviewState.liveSession =
        null;

    interviewState.microphoneStream =
        null;

    interviewState.microphoneMuted =
        false;

    if (!preserveEvidence) {

        interviewState.transcript =
            [];

        interviewState.partialUserTranscript =
            "";

        interviewState.partialAiTranscript =
            "";

    }

}


/* =========================================================
   59. STOP MICROPHONE CAPTURE
========================================================= */

function stopMicrophoneCapture() {

    try {

        geminiRuntime
            .microphoneWorklet
            ?.port
            ?.close();

    } catch (error) {

        // Ignore port cleanup errors.

    }

    try {

        geminiRuntime
            .microphoneWorklet
            ?.disconnect();

    } catch (error) {

        // Ignore node cleanup errors.

    }

    try {

        geminiRuntime
            .microphoneSource
            ?.disconnect();

    } catch (error) {

        // Ignore node cleanup errors.

    }

    try {

        geminiRuntime
            .microphoneSilentGain
            ?.disconnect();

    } catch (error) {

        // Ignore gain cleanup errors.

    }

    interviewState
        .microphoneStream
        ?.getTracks()
        ?.forEach(
            function (track) {

                track.stop();

            }
        );

    if (
        geminiRuntime
            .microphoneWorkletUrl
    ) {

        URL.revokeObjectURL(
            geminiRuntime
                .microphoneWorkletUrl
        );

    }

    geminiRuntime.microphoneWorklet =
        null;

    geminiRuntime.microphoneSource =
        null;

    geminiRuntime.microphoneSilentGain =
        null;

    geminiRuntime.microphoneWorkletUrl =
        null;

    interviewState.audioWorkletNode =
        null;

    interviewState.microphoneSource =
        null;

}


/* =========================================================
   60. CLOSE AUDIO CONTEXTS
========================================================= */

async function closeAudioContexts() {

    const contexts = [

        geminiRuntime
            .inputAudioContext,

        geminiRuntime
            .outputAudioContext

    ];

    for (
        const context of contexts
    ) {

        if (
            context &&
            context.state !== "closed"
        ) {

            try {

                await context.close();

            } catch (error) {

                console.warn(
                    "Audio context close warning:",
                    error.message
                );

            }

        }

    }

    geminiRuntime.inputAudioContext =
        null;

    geminiRuntime.outputAudioContext =
        null;

    interviewState.audioContext =
        null;

}


/* =========================================================
   61. CLOSE WEBSOCKET
========================================================= */

function closeGeminiWebSocket() {

    const websocket =
        geminiRuntime.websocket;

    if (!websocket) {
        return;
    }

    try {

        if (
            websocket.readyState ===
                WebSocket.OPEN ||
            websocket.readyState ===
                WebSocket.CONNECTING
        ) {

            websocket.close(
                1000,
                "Interview session closed"
            );

        }

    } catch (error) {

        console.warn(
            "Gemini WebSocket close warning:",
            error.message
        );

    }

    geminiRuntime.websocket =
        null;

    interviewState.liveSession =
        null;

}


/* =========================================================
   62. SETUP PROMISE CLEANUP
========================================================= */

function rejectGeminiSetup(
    error
) {

    if (
        typeof geminiRuntime
            .setupReject ===
        "function"
    ) {

        const reject =
            geminiRuntime.setupReject;

        geminiRuntime.setupResolve =
            null;

        geminiRuntime.setupReject =
            null;

        reject(
            error
        );

    }

    cleanupGeminiSetupPromise();

}


function cleanupGeminiSetupPromise() {

    if (
        geminiRuntime.setupTimeout
    ) {

        window.clearTimeout(
            geminiRuntime.setupTimeout
        );

    }

    geminiRuntime.setupTimeout =
        null;

}


/* =========================================================
   63. LIVE CONNECTION ERROR
========================================================= */

function showLiveConnectionError(
    message
) {

    setInterviewActivityState(
        "thinking",
        "Interview connection issue"
    );

    if (
        interviewState.interviewActive
    ) {

        showInterviewError(
            message
        );

    }

}


/* =========================================================
   64. AUDIO RESAMPLING
========================================================= */

function resampleFloat32Audio(

    inputSamples,
    sourceSampleRate,
    targetSampleRate

) {

    if (
        sourceSampleRate ===
        targetSampleRate
    ) {

        return inputSamples;

    }

    const ratio =
        sourceSampleRate /
        targetSampleRate;

    const outputLength =
        Math.max(
            1,
            Math.round(
                inputSamples.length /
                ratio
            )
        );

    const output =
        new Float32Array(
            outputLength
        );

    for (
        let outputIndex = 0;
        outputIndex < outputLength;
        outputIndex += 1
    ) {

        const sourcePosition =
            outputIndex *
            ratio;

        const leftIndex =
            Math.floor(
                sourcePosition
            );

        const rightIndex =
            Math.min(
                inputSamples.length - 1,
                leftIndex + 1
            );

        const fraction =
            sourcePosition -
            leftIndex;

        const leftSample =
            inputSamples[
                leftIndex
            ] || 0;

        const rightSample =
            inputSamples[
                rightIndex
            ] || 0;

        output[outputIndex] =
            leftSample +
            (
                rightSample -
                leftSample
            ) *
            fraction;

    }

    return output;

}


/* =========================================================
   65. FLOAT32 TO PCM16
========================================================= */

function float32ToPcm16(
    floatSamples
) {

    const pcmSamples =
        new Int16Array(
            floatSamples.length
        );

    for (
        let index = 0;
        index < floatSamples.length;
        index += 1
    ) {

        const sample =
            Math.max(
                -1,
                Math.min(
                    1,
                    floatSamples[index]
                )
            );

        pcmSamples[index] =
            sample < 0
                ? sample * 32768
                : sample * 32767;

    }

    return pcmSamples;

}


/* =========================================================
   66. BASE64 HELPERS
========================================================= */

function arrayBufferToBase64(
    arrayBuffer
) {

    const bytes =
        new Uint8Array(
            arrayBuffer
        );

    const chunkSize =
        0x8000;

    let binary =
        "";

    for (
        let offset = 0;
        offset < bytes.length;
        offset += chunkSize
    ) {

        const chunk =
            bytes.subarray(
                offset,
                Math.min(
                    offset + chunkSize,
                    bytes.length
                )
            );

        binary +=
            String.fromCharCode(
                ...chunk
            );

    }

    return window.btoa(
        binary
    );

}


function base64ToArrayBuffer(
    base64
) {

    const binary =
        window.atob(
            base64
        );

    const bytes =
        new Uint8Array(
            binary.length
        );

    for (
        let index = 0;
        index < binary.length;
        index += 1
    ) {

        bytes[index] =
            binary.charCodeAt(
                index
            );

    }

    return bytes.buffer;

}


/* =========================================================
   67. WEBSOCKET PAYLOAD HELPER
========================================================= */

async function websocketPayloadToText(
    payload
) {

    if (
        typeof payload ===
        "string"
    ) {

        return payload;

    }

    if (
        payload instanceof Blob
    ) {

        return await payload.text();

    }

    if (
        payload instanceof
        ArrayBuffer
    ) {

        return new TextDecoder()
            .decode(
                payload
            );

    }

    return String(
        payload || ""
    );

}


/* =========================================================
   68. TRANSCRIPT TEXT HELPERS
========================================================= */

function appendTranscriptChunk(
    existing,
    incoming
) {

    const previous =
        String(
            existing || ""
        );

    const chunk =
        String(
            incoming || ""
        );

    if (!previous) {

        return chunk;

    }

    if (
        chunk.startsWith(
            previous
        )
    ) {

        return chunk;

    }

    if (
        previous.endsWith(
            chunk
        )
    ) {

        return previous;

    }

    const needsSpace =
        !previous.endsWith(" ") &&
        !chunk.startsWith(" ") &&
        !/^[,.;:!?]/.test(
            chunk
        );

    return (
        previous +
        (
            needsSpace
                ? " "
                : ""
        ) +
        chunk
    );

}


function cleanTranscriptText(
    value
) {

    return String(
        value || ""
    )
        .replace(/\s+/g, " ")
        .trim()
        .slice(
            0,
            10000
        );

}


/* =========================================================
   69. COMPLETION DETECTION
========================================================= */

function isInterviewCompletionMessage(
    text
) {

    const normalized =
        String(
            text || ""
        ).toLowerCase();

    return normalized.includes(
        "your interview is complete"
    ) &&
    normalized.includes(
        "professional report"
    );

}


/* =========================================================
   70. NATURAL COMPLETION PLACEHOLDER

   Full interview ending and report generation
   will be implemented in Part 3.
========================================================= */

function requestNaturalInterviewCompletion() {

    if (
        typeof finishInterviewAndGenerateReport ===
        "function"
    ) {

        finishInterviewAndGenerateReport({

            naturalCompletion:
                true

        });

    }

}


/* =========================================================
   71. DELAY HELPER
========================================================= */

function delay(milliseconds) {

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
   END OF MOCK INTERVIEW JAVASCRIPT — PART 2

   PASTE PART 3 DIRECTLY BELOW THIS COMMENT.

   PART 3 WILL INCLUDE:
   - End Interview modal
   - Minimum-answer validation
   - Interview evidence validation
   - Safe session shutdown
   - Backend report request
   - Report-loading progress
   - Dynamic professional report rendering
   - Insufficient-evidence report
   - Print and PDF download
========================================================= */

/* =========================================================
   JOBQUESTAI — AI LIVE RECRUITER

   MOCK INTERVIEW JAVASCRIPT
   PART 3

   Includes:
   - Manual interview ending
   - Natural interview completion
   - Evidence validation
   - Safe Gemini shutdown
   - Backend report request
   - Report-loading progress
   - Professional report rendering
   - Insufficient-evidence handling
   - Print and PDF actions
========================================================= */


/* =========================================================
   72. REPORT CONFIGURATION
========================================================= */

const REPORT_CONFIG = Object.freeze({

    minimumDetailedAnswers:
        2,

    minimumInterviewSeconds:
        30,

    reportRequestTimeout:
        60000

});


/* =========================================================
   73. BIND INTERVIEW END EVENTS
========================================================= */

dom.endInterviewBtn
    ?.addEventListener(
        "click",
        openEndInterviewConfirmation
    );


dom.confirmEndInterviewBtn
    ?.addEventListener(
        "click",
        function () {

            endInterviewModalInstance
                ?.hide();

            finishInterviewAndGenerateReport({

                naturalCompletion:
                    false

            });

        }
    );


/* =========================================================
   74. OPEN END CONFIRMATION MODAL
========================================================= */

function openEndInterviewConfirmation() {

    if (
        !interviewState.interviewActive ||
        interviewState.interviewEnding
    ) {

        return;

    }

    finalizeCurrentUserTranscript();
    finalizeCurrentAiTranscript();

    const evidence =
        getInterviewEvidence();

    const hasEnoughEvidence =
        isEvidenceEnoughForReport(
            evidence
        );

    if (
        dom.insufficientEvidenceWarning
    ) {

        dom.insufficientEvidenceWarning.hidden =
            hasEnoughEvidence;

    }

    if (
        dom.endInterviewModalMessage
    ) {

        dom.endInterviewModalMessage.textContent =
            hasEnoughEvidence
                ? (
                    "Your interview is still active. " +
                    "Do you want to end it and prepare a report " +
                    "from the answers recorded so far?"
                )
                : (
                    "Your interview does not yet contain enough " +
                    "detailed answers for a scored professional report. " +
                    "You may continue or end the session without scores."
                );

    }

    if (endInterviewModalInstance) {

        endInterviewModalInstance.show();

    } else {

        const confirmed =
            window.confirm(
                dom.endInterviewModalMessage
                    ?.textContent ||
                "Do you want to end the interview?"
            );

        if (confirmed) {

            finishInterviewAndGenerateReport({

                naturalCompletion:
                    false

            });

        }

    }

}


/* =========================================================
   75. INTERVIEW EVIDENCE
========================================================= */

function getInterviewEvidence() {

    const transcript =
        normalizeFrontendTranscript(
            interviewState.transcript
        );

    const candidateAnswers =
        transcript.filter(
            function (entry) {

                return (
                    entry.role === "user" &&
                    isDetailedCandidateAnswer(
                        entry.text
                    )
                );

            }
        );

    return {

        transcript,

        candidateAnswers,

        answerCount:
            candidateAnswers.length,

        durationSeconds:
            Math.max(
                0,
                Number(
                    interviewState
                        .elapsedSeconds
                ) || 0
            ),

        transcriptEntries:
            transcript.length

    };

}


function normalizeFrontendTranscript(
    transcript
) {

    if (!Array.isArray(transcript)) {

        return [];

    }

    return transcript
        .map(
            function (entry) {

                const role =
                    entry?.role === "ai"
                        ? "ai"
                        : entry?.role === "user"
                            ? "user"
                            : "";

                const text =
                    cleanTranscriptText(
                        entry?.text
                    );

                if (!role || !text) {

                    return null;

                }

                return {

                    role,

                    text,

                    elapsedSeconds:
                        Math.max(
                            0,
                            Number(
                                entry
                                    ?.elapsedSeconds
                            ) || 0
                        )

                };

            }
        )
        .filter(Boolean)
        .slice(
            0,
            100
        );

}


function isDetailedCandidateAnswer(
    text
) {

    const normalized =
        cleanTranscriptText(
            text
        );

    if (
        normalized.length <
        15
    ) {

        return false;

    }

    const basicReplies =
        new Set([
            "yes",
            "yes i can",
            "yes i am ready",
            "i am ready",
            "okay",
            "ok",
            "sure",
            "ji",
            "jee",
            "han",
            "haan",
            "yes sir",
            "yes maam",
            "yes madam",
            "i can hear you"
        ]);

    return !basicReplies.has(
        normalized.toLowerCase()
    );

}


function isEvidenceEnoughForReport(
    evidence
) {

    return (
        evidence.answerCount >=
            REPORT_CONFIG
                .minimumDetailedAnswers &&
        evidence.durationSeconds >=
            REPORT_CONFIG
                .minimumInterviewSeconds
    );

}


/* =========================================================
   76. FINISH INTERVIEW
========================================================= */

async function finishInterviewAndGenerateReport({

    naturalCompletion = false

} = {}) {

    if (
        interviewState.interviewEnding
    ) {

        return;

    }

    interviewState.interviewEnding =
        true;

    interviewState.naturalCompletion =
        Boolean(
            naturalCompletion
        );

    interviewState.interviewActive =
        false;

    interviewState.endedAt =
        new Date();

    stopInterviewTimer();

    finalizeCurrentUserTranscript();
    finalizeCurrentAiTranscript();

    const evidence =
        getInterviewEvidence();

    disableLiveCallControls(
        true
    );

    setInterviewActivityState(
        "thinking",
        "Finalizing interview evidence..."
    );

    try {

        await disconnectGeminiLiveSession({

            preserveEvidence:
                true

        });

    } catch (error) {

        console.warn(
            "Interview shutdown warning:",
            error.message
        );

    }

    showScreen(
        "reportLoading"
    );

    startReportLoadingProgress();

    if (
        !isEvidenceEnoughForReport(
            evidence
        )
    ) {

        await delay(
            700
        );

        stopReportLoadingProgress();

        renderInsufficientEvidenceReport(
            evidence
        );

        showScreen(
            "report"
        );

        interviewState.interviewEnding =
            false;

        disableLiveCallControls(
            false
        );

        return;

    }

    try {

        updateReportLoadingState(
            42,
            "Reviewing your actual interview answers..."
        );

        const reportResponse =
            await requestProfessionalInterviewReport(
                evidence
            );

        updateReportLoadingState(
            84,
            "Preparing your strengths and improvement plan..."
        );

        await delay(
            550
        );

        updateReportLoadingState(
            100,
            "Your professional report is ready."
        );

        await delay(
            400
        );

        renderProfessionalInterviewReport(
            reportResponse.report,
            reportResponse.evidence ||
            evidence
        );

        showScreen(
            "report"
        );

    } catch (error) {

        console.error(
            "INTERVIEW REPORT ERROR:",
            error
        );

        renderReportGenerationError(
            normalizeApplicationError(
                error
            ),
            evidence
        );

        showScreen(
            "report"
        );

    } finally {

        stopReportLoadingProgress();

        interviewState.interviewEnding =
            false;

        disableLiveCallControls(
            false
        );

    }

}


/* =========================================================
   77. DISABLE LIVE CALL CONTROLS
========================================================= */

function disableLiveCallControls(
    disabled
) {

    [
        dom.muteMicrophoneBtn,
        dom.endInterviewBtn,
        dom.toggleTranscriptBtn
    ].forEach(
        function (button) {

            if (button) {

                button.disabled =
                    Boolean(disabled);

            }

        }
    );

}


/* =========================================================
   78. REPORT REQUEST
========================================================= */

async function requestProfessionalInterviewReport(
    evidence
) {

    const abortController =
        new AbortController();

    const timeoutId =
        window.setTimeout(
            function () {

                abortController.abort();

            },
            REPORT_CONFIG
                .reportRequestTimeout
        );

    const candidate = {

        candidateName:
            interviewState.candidate
                ?.candidateName ||
            "",

        targetJob:
            interviewState.candidate
                ?.targetJob ||
            "",

        interviewType:
            interviewState.candidate
                ?.interviewType ||
            "",

        experienceLevel:
            interviewState.candidate
                ?.experienceLevel ||
            "",

        interviewLanguage:
            interviewState.candidate
                ?.interviewLanguage ||
            "English"

    };

    try {

        const response =
            await fetch(
                `${INTERVIEW_CONFIG.apiBaseUrl}${INTERVIEW_CONFIG.reportEndpoint}`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            candidate,

                            transcript:
                                evidence
                                    .transcript,

                            durationSeconds:
                                evidence
                                    .durationSeconds

                        }),

                    signal:
                        abortController
                            .signal

                }
            );

        const responseText =
            await response.text();

        let responseData = {};

        try {

            responseData =
                responseText
                    ? JSON.parse(
                        responseText
                    )
                    : {};

        } catch (error) {

            throw new Error(
                "The report server returned an unreadable response."
            );

        }

        if (!response.ok) {

            const reportError =
                new Error(
                    responseData.error ||
                    "The interview report could not be generated."
                );

            reportError.code =
                responseData.code ||
                "REPORT_REQUEST_FAILED";

            reportError.status =
                response.status;

            reportError.evidence =
                responseData.evidence ||
                evidence;

            throw reportError;

        }

        if (!responseData.report) {

            throw new Error(
                "The server did not return a professional interview report."
            );

        }

        return responseData;

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new Error(
                "The report request took too long. Check your internet connection and try again."
            );

        }

        if (
            String(
                error.message
            )
                .toLowerCase()
                .includes(
                    "failed to fetch"
                )
        ) {

            throw new Error(
                "Could not connect to the report server. Confirm that server.js is running."
            );

        }

        throw error;

    } finally {

        window.clearTimeout(
            timeoutId
        );

    }

}


/* =========================================================
   79. REPORT LOADING PROGRESS
========================================================= */

let reportProgressInterval =
    null;

let reportProgressValue =
    12;


function startReportLoadingProgress() {

    stopReportLoadingProgress();

    reportProgressValue =
        12;

    updateReportLoadingState(
        reportProgressValue,
        "Capturing and organizing your interview evidence..."
    );

    reportProgressInterval =
        window.setInterval(
            function () {

                if (
                    reportProgressValue >=
                    78
                ) {

                    return;

                }

                reportProgressValue +=
                    Math.floor(
                        Math.random() *
                        5
                    ) + 2;

                reportProgressValue =
                    Math.min(
                        78,
                        reportProgressValue
                    );

                if (
                    reportProgressValue <
                    35
                ) {

                    updateReportLoadingState(
                        reportProgressValue,
                        "Capturing and organizing your interview evidence..."
                    );

                } else if (
                    reportProgressValue <
                    58
                ) {

                    updateReportLoadingState(
                        reportProgressValue,
                        "Evaluating communication and answer relevance..."
                    );

                } else {

                    updateReportLoadingState(
                        reportProgressValue,
                        "Identifying strengths and improvement areas..."
                    );

                }

            },
            700
        );

}


function stopReportLoadingProgress() {

    if (reportProgressInterval) {

        window.clearInterval(
            reportProgressInterval
        );

    }

    reportProgressInterval =
        null;

}


function updateReportLoadingState(
    progress,
    message
) {

    const safeProgress =
        Math.max(
            0,
            Math.min(
                100,
                Number(progress) || 0
            )
        );

    if (dom.analysisProgressBar) {

        dom.analysisProgressBar
            .style
            .width =
                `${safeProgress}%`;

    }

    if (
        dom.reportLoadingMessage &&
        message
    ) {

        dom.reportLoadingMessage
            .textContent =
                message;

    }

}


/* =========================================================
   80. PROFESSIONAL REPORT RENDERING
========================================================= */

function renderProfessionalInterviewReport(
    rawReport,
    evidence
) {

    const report =
        normalizeInterviewReport(
            rawReport
        );

    const recommendationClass =
        getRecommendationClass(
            report.recommendation
        );

    dom.reportContainer.innerHTML = `

        <article class="report-card report-overview-card">

            <div class="report-overview-layout">

                <div class="overall-score-block">

                    <div class="overall-score-circle">

                        <strong>
                            ${report.overallScore}
                        </strong>

                        <span>
                            Overall Score
                        </span>

                    </div>

                    <h3>
                        ${escapeHtml(
                            report.candidateName ||
                            interviewState.candidate
                                ?.candidateName ||
                            "Candidate"
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            report.targetJob ||
                            interviewState.candidate
                                ?.targetJob ||
                            "Selected Role"
                        )}
                    </p>

                </div>


                <div class="report-summary-content">

                    <span class="section-eyebrow">
                        Interview Summary
                    </span>

                    <h3>
                        Professional Assessment
                    </h3>

                    <p>
                        ${escapeHtml(
                            report.summary
                        )}
                    </p>

                    <span
                        class="report-recommendation ${recommendationClass}"
                    >

                        <i class="bi bi-award-fill"></i>

                        ${escapeHtml(
                            report.recommendation
                        )}

                    </span>

                </div>

            </div>

        </article>


        <article class="report-card">

            <div class="report-card-header">

                <div>

                    <h3>
                        Performance Scores
                    </h3>

                    <p>
                        Scores are based on evidence recorded
                        during this interview.
                    </p>

                </div>

            </div>

            <div class="report-score-grid">

                ${createReportScoreCard(
                    "Communication",
                    report.communicationScore,
                    report.scoreReasons.communication
                )}

                ${createReportScoreCard(
                    "Relevance",
                    report.relevanceScore,
                    report.scoreReasons.relevance
                )}

                ${createReportScoreCard(
                    "Job Knowledge",
                    report.jobKnowledgeScore,
                    report.scoreReasons.jobKnowledge
                )}

                ${createReportScoreCard(
                    "Professionalism",
                    report.professionalismScore,
                    report.scoreReasons.professionalism
                )}

                ${createReportScoreCard(
                    "Answer Structure",
                    report.answerStructureScore,
                    report.scoreReasons.answerStructure
                )}

            </div>

        </article>


        <div class="report-two-column-grid">

            ${createReportListCard(
                "Strengths",
                "bi-check-circle-fill",
                report.strengths,
                "success"
            )}

            ${createReportListCard(
                "Improvement Areas",
                "bi-exclamation-triangle-fill",
                report.improvementAreas,
                "warning"
            )}

        </div>


        <div class="report-two-column-grid">

            ${createAnswerReviewCard(
                "Strong Answers",
                report.strongAnswers,
                "bi-hand-thumbs-up-fill"
            )}

            ${createAnswerReviewCard(
                "Answers to Improve",
                report.weakAnswers,
                "bi-pencil-square"
            )}

        </div>


        <article class="report-card">

            <div class="report-card-header">

                <div>

                    <h3>
                        Recommended Practice Plan
                    </h3>

                    <p>
                        Follow these practical steps before your
                        next interview.
                    </p>

                </div>

            </div>

            <div class="practice-plan-list">

                ${createPracticePlanMarkup(
                    report.practicePlan
                )}

            </div>

        </article>


        <div class="final-feedback-box">

            <h3>
                Final Feedback
            </h3>

            <p>
                ${escapeHtml(
                    report.finalFeedback
                )}
            </p>

        </div>


        <article class="report-card">

            <div class="report-card-header">

                <div>

                    <h3>
                        Interview Evidence
                    </h3>

                    <p>
                        ${evidence.answerCount} detailed answers,
                        ${formatDuration(
                            evidence.durationSeconds
                        )} duration and
                        ${evidence.transcriptEntries}
                        transcript entries.
                    </p>

                </div>

            </div>

            ${createReportTranscriptMarkup(
                evidence.transcript ||
                interviewState.transcript
            )}

        </article>

    `;

}


/* =========================================================
   81. NORMALIZE REPORT
========================================================= */

function normalizeInterviewReport(
    rawReport
) {

    const report =
        rawReport &&
        typeof rawReport ===
            "object"
            ? rawReport
            : {};

    return {

        candidateName:
            cleanSingleLine(
                report.candidateName ||
                interviewState.candidate
                    ?.candidateName ||
                "Candidate",
                100
            ),

        targetJob:
            cleanSingleLine(
                report.targetJob ||
                interviewState.candidate
                    ?.targetJob ||
                "Selected Role",
                160
            ),

        interviewType:
            cleanSingleLine(
                report.interviewType ||
                interviewState.candidate
                    ?.interviewType ||
                "Interview",
                100
            ),

        summary:
            cleanReportText(
                report.summary,
                "The candidate completed the live interview and provided sufficient evidence for assessment."
            ),

        overallScore:
            normalizeScore(
                report.overallScore
            ),

        communicationScore:
            normalizeScore(
                report.communicationScore
            ),

        relevanceScore:
            normalizeScore(
                report.relevanceScore
            ),

        jobKnowledgeScore:
            normalizeScore(
                report.jobKnowledgeScore
            ),

        professionalismScore:
            normalizeScore(
                report.professionalismScore
            ),

        answerStructureScore:
            normalizeScore(
                report.answerStructureScore
            ),

        recommendation:
            normalizeRecommendation(
                report.recommendation
            ),

        scoreReasons: {

            overall:
                cleanReportText(
                    report.scoreReasons
                        ?.overall,
                    "Based on the overall quality of the recorded answers."
                ),

            communication:
                cleanReportText(
                    report.scoreReasons
                        ?.communication,
                    "Based on clarity and communication in the recorded answers."
                ),

            relevance:
                cleanReportText(
                    report.scoreReasons
                        ?.relevance,
                    "Based on how closely the answers addressed the questions."
                ),

            jobKnowledge:
                cleanReportText(
                    report.scoreReasons
                        ?.jobKnowledge,
                    "Based on role-related knowledge demonstrated in the interview."
                ),

            professionalism:
                cleanReportText(
                    report.scoreReasons
                        ?.professionalism,
                    "Based on professional wording and interview conduct."
                ),

            answerStructure:
                cleanReportText(
                    report.scoreReasons
                        ?.answerStructure,
                    "Based on organization and completeness of answers."
                )

        },

        strengths:
            normalizeStringArray(
                report.strengths,
                [
                    "Completed the live interview and provided assessable responses."
                ]
            ),

        improvementAreas:
            normalizeStringArray(
                report.improvementAreas,
                [
                    "Continue practicing structured and example-based answers."
                ]
            ),

        strongAnswers:
            normalizeAnswerReviewArray(
                report.strongAnswers
            ),

        weakAnswers:
            normalizeAnswerReviewArray(
                report.weakAnswers
            ),

        practicePlan:
            normalizePracticePlanArray(
                report.practicePlan
            ),

        finalFeedback:
            cleanReportText(
                report.finalFeedback,
                "Continue practicing role-specific questions and support each answer with a clear example."
            )

    };

}


function normalizeScore(value) {

    const number =
        Number.parseInt(
            value,
            10
        );

    if (!Number.isFinite(number)) {

        return 0;

    }

    return Math.max(
        0,
        Math.min(
            100,
            number
        )
    );

}


function normalizeRecommendation(
    value
) {

    const recommendation =
        cleanSingleLine(
            value,
            100
        );

    const allowed =
        new Set([
            "Ready",
            "Almost Ready",
            "Needs Practice",
            "Not Enough Role Knowledge"
        ]);

    return allowed.has(
        recommendation
    )
        ? recommendation
        : "Needs Practice";

}


function cleanReportText(
    value,
    fallback = ""
) {

    const text =
        String(
            value || ""
        )
            .replace(/\0/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(
                0,
                3000
            );

    return text ||
        fallback;

}


/* =========================================================
   82. NORMALIZE REPORT ARRAYS
========================================================= */

function normalizeStringArray(
    value,
    fallback = []
) {

    if (!Array.isArray(value)) {

        return fallback;

    }

    const normalized =
        value
            .map(
                function (item) {

                    if (
                        typeof item ===
                        "string"
                    ) {

                        return cleanReportText(
                            item
                        );

                    }

                    if (
                        item &&
                        typeof item ===
                            "object"
                    ) {

                        return cleanReportText(
                            item.text ||
                            item.feedback ||
                            item.description ||
                            item.title
                        );

                    }

                    return "";

                }
            )
            .filter(Boolean)
            .slice(
                0,
                8
            );

    return normalized.length
        ? normalized
        : fallback;

}


function normalizeAnswerReviewArray(
    value
) {

    if (!Array.isArray(value)) {

        return [];

    }

    return value
        .map(
            function (
                item,
                index
            ) {

                if (
                    typeof item ===
                    "string"
                ) {

                    return {

                        title:
                            `Answer ${index + 1}`,

                        answer:
                            cleanReportText(
                                item
                            ),

                        feedback:
                            ""

                    };

                }

                if (
                    item &&
                    typeof item ===
                        "object"
                ) {

                    return {

                        title:
                            cleanReportText(
                                item.title ||
                                item.question ||
                                `Answer ${index + 1}`
                            ),

                        answer:
                            cleanReportText(
                                item.answer ||
                                item.response ||
                                item.text
                            ),

                        feedback:
                            cleanReportText(
                                item.feedback ||
                                item.reason ||
                                item.analysis
                            )

                    };

                }

                return null;

            }
        )
        .filter(Boolean)
        .slice(
            0,
            5
        );

}


function normalizePracticePlanArray(
    value
) {

    if (!Array.isArray(value)) {

        return [
            {
                title:
                    "Practice role questions",

                description:
                    "Review common questions for the selected position."
            },
            {
                title:
                    "Use clear examples",

                description:
                    "Support answers with education, project or work examples."
            },
            {
                title:
                    "Improve answer structure",

                description:
                    "Use concise introductions, details and clear conclusions."
            }
        ];

    }

    const normalized =
        value
            .map(
                function (
                    item,
                    index
                ) {

                    if (
                        typeof item ===
                        "string"
                    ) {

                        return {

                            title:
                                `Practice Step ${index + 1}`,

                            description:
                                cleanReportText(
                                    item
                                )

                        };

                    }

                    if (
                        item &&
                        typeof item ===
                            "object"
                    ) {

                        return {

                            title:
                                cleanReportText(
                                    item.title ||
                                    item.step ||
                                    `Practice Step ${index + 1}`
                                ),

                            description:
                                cleanReportText(
                                    item.description ||
                                    item.action ||
                                    item.text
                                )

                        };

                    }

                    return null;

                }
            )
            .filter(Boolean)
            .slice(
                0,
                6
            );

    return normalized.length
        ? normalized
        : normalizePracticePlanArray(
            null
        );

}


/* =========================================================
   83. REPORT COMPONENT MARKUP
========================================================= */

function createReportScoreCard(
    title,
    score,
    reason
) {

    return `
        <div class="report-score-card">

            <h4>
                ${normalizeScore(score)}
            </h4>

            <span>
                ${escapeHtml(title)}
            </span>

            <p>
                ${escapeHtml(
                    cleanReportText(
                        reason
                    )
                )}
            </p>

        </div>
    `;

}


function createReportListCard(
    title,
    icon,
    items,
    className = ""
) {

    const safeItems =
        normalizeStringArray(
            items,
            [
                "No specific evidence was available."
            ]
        );

    const listMarkup =
        safeItems
            .map(
                function (item) {

                    return `
                        <li>
                            ${escapeHtml(item)}
                        </li>
                    `;

                }
            )
            .join("");

    return `
        <article class="report-section-card ${className}">

            <h3>

                <i class="bi ${escapeHtml(icon)}"></i>

                ${escapeHtml(title)}

            </h3>

            <ul class="report-list">
                ${listMarkup}
            </ul>

        </article>
    `;

}


function createAnswerReviewCard(
    title,
    items,
    icon
) {

    const normalizedItems =
        normalizeAnswerReviewArray(
            items
        );

    let content = "";

    if (!normalizedItems.length) {

        content = `
            <div class="answer-review-item">

                <p>
                    No specific answer was identified for
                    this section.
                </p>

            </div>
        `;

    } else {

        content =
            normalizedItems
                .map(
                    function (item) {

                        return `
                            <div class="answer-review-item">

                                <span class="answer-review-label">

                                    <i class="bi ${escapeHtml(icon)}"></i>

                                    ${escapeHtml(item.title)}

                                </span>

                                ${
                                    item.answer
                                        ? `
                                            <strong>
                                                ${escapeHtml(item.answer)}
                                            </strong>
                                        `
                                        : ""
                                }

                                ${
                                    item.feedback
                                        ? `
                                            <p>
                                                ${escapeHtml(item.feedback)}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>
                        `;

                    }
                )
                .join("");

    }

    return `
        <article class="report-section-card">

            <h3>

                <i class="bi ${escapeHtml(icon)}"></i>

                ${escapeHtml(title)}

            </h3>

            ${content}

        </article>
    `;

}


function createPracticePlanMarkup(
    practicePlan
) {

    return normalizePracticePlanArray(
        practicePlan
    )
        .map(
            function (item) {

                return `
                    <div class="practice-plan-item">

                        <h4>
                            ${escapeHtml(item.title)}
                        </h4>

                        <p>
                            ${escapeHtml(
                                item.description
                            )}
                        </p>

                    </div>
                `;

            }
        )
        .join("");

}


/* =========================================================
   84. REPORT TRANSCRIPT MARKUP
========================================================= */

function createReportTranscriptMarkup(
    transcript
) {

    const entries =
        normalizeFrontendTranscript(
            transcript
        );

    if (!entries.length) {

        return `
            <div class="report-transcript">

                <div class="report-transcript-entry">

                    <p>
                        No transcript was recorded.
                    </p>

                </div>

            </div>
        `;

    }

    const markup =
        entries
            .map(
                function (entry) {

                    const speaker =
                        entry.role === "ai"
                            ? "AI Recruiter"
                            : "Candidate";

                    return `
                        <div
                            class="report-transcript-entry ${entry.role}"
                        >

                            <strong>
                                ${speaker}
                                •
                                ${formatDuration(
                                    entry.elapsedSeconds
                                )}
                            </strong>

                            <p>
                                ${escapeHtml(
                                    entry.text
                                )}
                            </p>

                        </div>
                    `;

                }
            )
            .join("");

    return `
        <div class="report-transcript">
            ${markup}
        </div>
    `;

}


/* =========================================================
   85. RECOMMENDATION CLASS
========================================================= */

function getRecommendationClass(
    recommendation
) {

    const normalized =
        String(
            recommendation || ""
        ).toLowerCase();

    if (
        normalized ===
        "ready"
    ) {

        return "ready";

    }

    if (
        normalized ===
        "almost ready"
    ) {

        return "warning";

    }

    return "danger";

}


/* =========================================================
   86. INSUFFICIENT EVIDENCE REPORT
========================================================= */

function renderInsufficientEvidenceReport(
    evidence
) {

    dom.reportContainer.innerHTML = `

        <article class="report-card insufficient-evidence-card">

            <div class="insufficient-evidence-icon">

                <i class="bi bi-info-circle-fill"></i>

            </div>

            <h3>
                Interview Not Completed
            </h3>

            <p>
                A scored professional report was not generated
                because the session did not contain enough
                detailed interview evidence. JobQuestAI does not
                display generic or invented scores.
            </p>

            <div class="evidence-summary-grid">

                <div class="evidence-summary-item">

                    <strong>
                        ${evidence.answerCount}
                    </strong>

                    <span>
                        Detailed Answers
                    </span>

                </div>

                <div class="evidence-summary-item">

                    <strong>
                        ${formatDuration(
                            evidence.durationSeconds
                        )}
                    </strong>

                    <span>
                        Interview Time
                    </span>

                </div>

                <div class="evidence-summary-item">

                    <strong>
                        ${REPORT_CONFIG.minimumDetailedAnswers}
                    </strong>

                    <span>
                        Answers Required
                    </span>

                </div>

            </div>

        </article>


        <article class="report-card">

            <div class="report-card-header">

                <div>

                    <h3>
                        Available Interview Transcript
                    </h3>

                    <p>
                        The available conversation has been
                        preserved below.
                    </p>

                </div>

            </div>

            ${createReportTranscriptMarkup(
                evidence.transcript
            )}

        </article>

    `;

}


/* =========================================================
   87. REPORT GENERATION ERROR
========================================================= */

function renderReportGenerationError(
    message,
    evidence
) {

    dom.reportContainer.innerHTML = `

        <article class="report-card insufficient-evidence-card">

            <div class="insufficient-evidence-icon">

                <i class="bi bi-exclamation-triangle-fill"></i>

            </div>

            <h3>
                Report Could Not Be Generated
            </h3>

            <p>
                ${escapeHtml(message)}
            </p>

            <div class="evidence-summary-grid">

                <div class="evidence-summary-item">

                    <strong>
                        ${evidence.answerCount}
                    </strong>

                    <span>
                        Detailed Answers
                    </span>

                </div>

                <div class="evidence-summary-item">

                    <strong>
                        ${formatDuration(
                            evidence.durationSeconds
                        )}
                    </strong>

                    <span>
                        Interview Time
                    </span>

                </div>

                <div class="evidence-summary-item">

                    <strong>
                        ${evidence.transcriptEntries}
                    </strong>

                    <span>
                        Transcript Entries
                    </span>

                </div>

            </div>

        </article>


        <article class="report-card">

            <div class="report-card-header">

                <div>

                    <h3>
                        Preserved Interview Transcript
                    </h3>

                    <p>
                        Your recorded interview evidence has not
                        been lost.
                    </p>

                </div>

            </div>

            ${createReportTranscriptMarkup(
                evidence.transcript
            )}

        </article>

    `;

}


/* =========================================================
   88. PRINT AND PDF ACTIONS
========================================================= */

dom.downloadReportBtn
    ?.addEventListener(
        "click",
        downloadReportAsPdf
    );


function downloadReportAsPdf() {

    /*
       The browser print dialog allows the user to select:
       "Save as PDF".

       This avoids adding another heavy PDF library and keeps
       the report layout consistent with the CSS print rules.
    */

    const originalTitle =
        document.title;

    const candidateName =
        interviewState.candidate
            ?.candidateName ||
        "Candidate";

    document.title =
        `${candidateName} - JobQuestAI Interview Report`;

    window.print();

    window.setTimeout(
        function () {

            document.title =
                originalTitle;

        },
        500
    );

}


/* =========================================================
   89. RESET REPORT INTERFACE
========================================================= */

function resetReportInterface() {

    if (dom.reportContainer) {

        dom.reportContainer.innerHTML =
            "";

    }

    updateReportLoadingState(
        12,
        "Reviewing your actual answers and interview evidence."
    );

}


/* =========================================================
   90. EXTEND APPLICATION RESET
========================================================= */

const originalResetApplicationForNewInterview =
    resetApplicationForNewInterview;


resetApplicationForNewInterview =
    async function () {

        resetReportInterface();

        await originalResetApplicationForNewInterview();

        interviewState.selectedCvFile =
            null;

        removeSelectedCv();

        dom.interviewSetupForm
            ?.reset();

        updateBackgroundCharacterCount();

        dom.candidateName
            ?.focus();

    };


/* =========================================================
   91. MOBILE TRANSCRIPT BACKDROP CLOSING
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            window.innerWidth >
            991
        ) {

            return;

        }

        if (
            !dom.transcriptPanel
                ?.classList
                .contains(
                    "open"
                )
        ) {

            return;

        }

        const clickedInsidePanel =
            dom.transcriptPanel
                .contains(
                    event.target
                );

        const clickedToggleButton =
            dom.toggleTranscriptBtn
                ?.contains(
                    event.target
                );

        if (
            !clickedInsidePanel &&
            !clickedToggleButton
        ) {

            dom.transcriptPanel
                .classList
                .remove(
                    "open"
                );

        }

    }
);


/* =========================================================
   92. ESCAPE KEY BEHAVIOUR
========================================================= */

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
            dom.transcriptPanel
                ?.classList
                .contains(
                    "open"
                )
        ) {

            dom.transcriptPanel
                .classList
                .remove(
                    "open"
                );

        }

    }
);


/* =========================================================
   93. FINAL APPLICATION READY LOG
========================================================= */

console.info(
    "JobQuestAI AI Live Recruiter frontend loaded successfully."
);


/* =========================================================
   MOCK INTERVIEW JAVASCRIPT COMPLETE

   Completed:
   - Setup form
   - CV upload
   - Backend session request
   - Gemini Live WebSocket
   - Microphone PCM streaming
   - AI audio playback
   - Live transcription
   - Mute/unmute
   - Interview ending
   - Evidence validation
   - Professional report request
   - Dynamic report rendering
   - Print and Save-as-PDF support
========================================================= */