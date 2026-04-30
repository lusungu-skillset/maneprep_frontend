"use client"

import { useEffect, useState } from "react"
import { Header } from "./header"
import { BottomNav } from "./bottom-nav"
import { HomeScreen } from "./screens/home-screen"
import { SubjectsScreen } from "./screens/subjects-screen"
import { PracticeScreen } from "./screens/practice-screen"
import { ProfileScreen } from "./screens/profile-screen"
import { OnboardingScreen } from "./screens/onboarding-screen"
import { SubjectDetailScreen } from "./screens/subject-detail-screen"
import { TopicLessonScreen } from "./screens/topic-lesson-screen"
import { AchievementsScreen } from "./screens/achievements-screen"
import { LeaderboardScreen } from "./screens/leaderboard-screen"
import { StudyTipsScreen } from "./screens/study-tips-screen"
import { SettingsScreen } from "./screens/settings-screen"
import { DownloadsScreen } from "./screens/downloads-screen"
import { HelpScreen } from "./screens/help-screen"
import { SearchScreen, type SearchResult } from "./screens/search-screen"
import { EditProfileScreen } from "./screens/edit-profile-screen"
import { FormSelectorScreen } from "./screens/form-selector-screen"
import { PastPapersScreen } from "./screens/past-papers-screen"
import { QuizUI } from "./quiz-ui"
import { InstallPrompt } from "./install-prompt"
import { UpdatePrompt } from "./update-prompt"
import {
  createProgress,
  fetchProgress,
  fetchSubjectQuestionBundle,
  fetchSubjects,
  type BackendProgressEntry,
  type BackendQuestion,
  type SubjectQuestionBundle,
} from "@/lib/maneb-api"
import {
  formatDifficulty,
  formLevelToNumber,
  getSubjectPresentation,
} from "@/lib/maneb"
import {
  type UserData,
  type FormLevel,
  createUser,
  getCurrentUserId,
  getCurrentUserData,
  updateUserProfile,
  addQuizAttempt,
  deleteUserData,
} from "@/lib/user-data"

type Tab = "home" | "subjects" | "practice" | "profile"
type Screen =
  | "main"
  | "onboarding"
  | "subject-detail"
  | "topic-lesson"
  | "quiz"
  | "achievements"
  | "leaderboard"
  | "study-tips"
  | "settings"
  | "downloads"
  | "help"
  | "search"
  | "edit-profile"
  | "form-selector"
  | "past-papers"

type AppQuestion = {
  id: number
  question: string
  options: string[]
  answer: string
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

type AppTopic = {
  id: number
  name: string
  subjectId: number
  subjectName: string
  questionCount: number
  attemptedCount: number
  progress: number
  isCompleted: boolean
  questions: AppQuestion[]
}

type AppSubject = {
  id: number
  name: string
  form: number
  progress: number
  questionCount: number
  description: string
  icon: ReturnType<typeof getSubjectPresentation>["icon"]
  color: string
  image: string
  topics: AppTopic[]
}

type PracticeQuiz = {
  id: string
  topicId: number | null
  topic: string
  subject: string
  questionCount: number
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  questions: AppQuestion[]
}

type ActiveQuiz = {
  id: string
  title: string
  questions: AppQuestion[]
  returnScreen: Screen
}

const tabTitles: Record<Tab, string> = {
  home: "MANEB Prep",
  subjects: "Subjects",
  practice: "Practice",
  profile: "Profile",
}

function getLatestProgressMap(entries: BackendProgressEntry[]): Map<number, BackendProgressEntry> {
  const latestProgress = new Map<number, BackendProgressEntry>()

  for (const entry of entries) {
    const existingEntry = latestProgress.get(entry.questionId)

    if (
      !existingEntry ||
      new Date(entry.timestamp).getTime() > new Date(existingEntry.timestamp).getTime()
    ) {
      latestProgress.set(entry.questionId, entry)
    }
  }

  return latestProgress
}

function calculateDifficulty(questions: AppQuestion[]): "Easy" | "Medium" | "Hard" {
  if (questions.some((question) => question.difficulty === "Hard")) {
    return "Hard"
  }

  if (questions.some((question) => question.difficulty === "Medium")) {
    return "Medium"
  }

  return "Easy"
}

function estimateQuizTime(questionCount: number): string {
  return `${Math.max(5, questionCount)} mins`
}

function transformQuestion(question: BackendQuestion): AppQuestion {
  return {
    id: question.id,
    question: question.question,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
    difficulty: formatDifficulty(question.difficulty),
  }
}

function buildSubjects(
  bundles: SubjectQuestionBundle[],
  progressEntries: BackendProgressEntry[],
): AppSubject[] {
  const latestProgress = getLatestProgressMap(progressEntries)

  return bundles.map((bundle) => {
    const presentation = getSubjectPresentation(bundle.subject.name)
    const topics = bundle.topics.map((topic) => {
      const questions = topic.questions.map(transformQuestion)
      const attemptedQuestions = questions.filter((question) =>
        latestProgress.has(question.id),
      )
      const progress =
        questions.length > 0
          ? Math.round((attemptedQuestions.length / questions.length) * 100)
          : 0

      return {
        id: topic.id,
        name: topic.name,
        subjectId: bundle.subject.id,
        subjectName: bundle.subject.name,
        questionCount: topic.questionCount,
        attemptedCount: attemptedQuestions.length,
        progress,
        isCompleted:
          questions.length > 0 && attemptedQuestions.length === questions.length,
        questions,
      }
    })

    const questionCount = topics.reduce(
      (total, topic) => total + topic.questionCount,
      0,
    )
    const attemptedCount = topics.reduce(
      (total, topic) => total + topic.attemptedCount,
      0,
    )

    return {
      id: bundle.subject.id,
      name: bundle.subject.name,
      form: bundle.subject.form,
      progress:
        questionCount > 0
          ? Math.round((attemptedCount / questionCount) * 100)
          : 0,
      questionCount,
      description: `${topics.length} topics and ${questionCount} backend questions are available for ${bundle.subject.name}.`,
      icon: presentation.icon,
      color: presentation.color,
      image: presentation.image,
      topics,
    }
  })
}

function buildPracticeQuizzes(subjects: AppSubject[]): PracticeQuiz[] {
  return subjects.flatMap((subject) =>
    subject.topics.map((topic) => ({
      id: `topic-${topic.id}`,
      topicId: topic.id,
      topic: topic.name,
      subject: subject.name,
      questionCount: topic.questionCount,
      difficulty: calculateDifficulty(topic.questions),
      estimatedTime: estimateQuizTime(topic.questionCount),
      questions: topic.questions,
    })),
  )
}

function buildExamQuiz(quizzes: PracticeQuiz[]): PracticeQuiz | null {
  const questions = quizzes.flatMap((quiz) => quiz.questions)

  if (questions.length === 0) {
    return null
  }

  return {
    id: "exam-mode",
    topicId: null,
    topic: "Combined Exam Mode",
    subject: "All Subjects",
    questionCount: questions.length,
    difficulty: calculateDifficulty(questions),
    estimatedTime: `${Math.max(20, questions.length)} mins`,
    questions,
  }
}

function buildSearchResults(subjects: AppSubject[]): SearchResult[] {
  const results: SearchResult[] = []

  for (const subject of subjects) {
    results.push({
      id: `subject-${subject.id}`,
      title: subject.name,
      type: "subject",
      subtitle: `${subject.topics.length} topics, ${subject.questionCount} questions`,
      subjectId: subject.id,
    })

    for (const topic of subject.topics) {
      results.push({
        id: `topic-${topic.id}`,
        title: topic.name,
        type: "topic",
        subtitle: `${subject.name} - ${topic.questionCount} questions`,
        subjectId: subject.id,
        topicId: topic.id,
      })
      results.push({
        id: `quiz-${topic.id}`,
        title: `${topic.name} Quiz`,
        type: "quiz",
        subtitle: `${subject.name} - ${topic.questionCount} live questions`,
        subjectId: subject.id,
        topicId: topic.id,
      })
    }
  }

  return results
}

export function MANEBApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [isOnline, setIsOnline] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBackendLoading, setIsBackendLoading] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)
  const [subjectBundles, setSubjectBundles] = useState<SubjectQuestionBundle[]>([])
  const [progressEntries, setProgressEntries] = useState<BackendProgressEntry[]>([])
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null)

  useEffect(() => {
    const userId = getCurrentUserId()

    if (userId) {
      const data = getCurrentUserData()

      if (data) {
        setUserData(data)
        setCurrentScreen("main")
      }
    }

    setIsLoading(false)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!userData) {
      return
    }

    const profile = userData.profile
    let isActive = true

    async function loadBackendData() {
      setIsBackendLoading(true)
      setBackendError(null)

      try {
        const formNumber = formLevelToNumber(profile.form)
        const [subjectsResponse, progressResponse] = await Promise.all([
          fetchSubjects(formNumber),
          fetchProgress(profile.id),
        ])

        const bundles = await Promise.all(
          subjectsResponse.data.map((subject) =>
            fetchSubjectQuestionBundle(subject.name, formNumber),
          ),
        )

        if (!isActive) {
          return
        }

        setSubjectBundles(bundles)
        setProgressEntries(progressResponse.data)
        setLastSyncedAt(
          progressResponse.syncedAt ??
            bundles[0]?.syncedAt ??
            subjectsResponse.syncedAt ??
            null,
        )
        setSelectedSubjectId((currentValue) => currentValue ?? bundles[0]?.subject.id ?? null)
      } catch (error) {
        if (!isActive) {
          return
        }

        setSubjectBundles([])
        setProgressEntries([])
        setLastSyncedAt(null)
        setBackendError(
          error instanceof Error
            ? error.message
            : "Unable to load backend content.",
        )
      } finally {
        if (isActive) {
          setIsBackendLoading(false)
        }
      }
    }

    void loadBackendData()

    return () => {
      isActive = false
    }
  }, [userData?.profile.form, userData?.profile.id])

  const subjects = buildSubjects(subjectBundles, progressEntries)
  const practiceQuizzes = buildPracticeQuizzes(subjects)
  const examQuiz = buildExamQuiz(practiceQuizzes)
  const searchResults = buildSearchResults(subjects)
  const featuredSearchResults = searchResults
    .filter((result) => result.type !== "subject")
    .slice(0, 6)
  const selectedSubject =
    subjects.find((subject) => subject.id === selectedSubjectId) ?? null
  const selectedTopic =
    subjects
      .flatMap((subject) => subject.topics)
      .find((topic) => topic.id === selectedTopicId) ?? null
  const dailyChallengeTopic =
    subjects
      .flatMap((subject) => subject.topics)
      .find((topic) => topic.progress < 100) ??
    subjects.flatMap((subject) => subject.topics)[0] ??
    null

  const handleOnboardingComplete = (profile: {
    name: string
    school: string
    form: FormLevel
  }) => {
    const newUserData = createUser(profile)
    setUserData(newUserData)
    setCurrentScreen("main")
  }

  const handleProfileUpdate = (updates: {
    name: string
    school: string
    form: FormLevel
  }) => {
    if (!userData) {
      return
    }

    updateUserProfile(userData.profile.id, updates)
    setUserData({
      ...userData,
      profile: { ...userData.profile, ...updates },
    })
    setCurrentScreen("main")
  }

  const handleFormChange = (form: FormLevel) => {
    if (!userData) {
      return
    }

    updateUserProfile(userData.profile.id, { form })
    setUserData({
      ...userData,
      profile: { ...userData.profile, form },
    })
    setCurrentScreen("main")
  }

  const handleQuizComplete = async (
    quizId: string,
    result: {
      score: number
      total: number
      attempts: Array<{
        questionId: number
        selectedOption: string
        isCorrect: boolean
      }>
    },
  ) => {
    if (!userData) {
      return
    }

    addQuizAttempt(userData.profile.id, {
      quizId,
      score: result.score,
      totalQuestions: result.total,
      completedAt: new Date().toISOString(),
      timeSpent: result.total * 60,
    })

    const refreshedData = getCurrentUserData()

    if (refreshedData) {
      setUserData(refreshedData)
    }

    try {
      await Promise.all(
        result.attempts.map((attempt) =>
          createProgress({
            userId: userData.profile.id,
            questionId: attempt.questionId,
            selectedAnswer: attempt.selectedOption,
            timestamp: new Date().toISOString(),
          }),
        ),
      )

      const progressResponse = await fetchProgress(userData.profile.id)
      setProgressEntries(progressResponse.data)
      setLastSyncedAt(progressResponse.syncedAt)
      setBackendError(null)
    } catch (error) {
      setBackendError(
        error instanceof Error
          ? error.message
          : "Unable to save quiz progress.",
      )
    }
  }

  const handleLogout = () => {
    if (userData) {
      deleteUserData(userData.profile.id)
    }

    setUserData(null)
    setSubjectBundles([])
    setProgressEntries([])
    setActiveQuiz(null)
    setSelectedSubjectId(null)
    setSelectedTopicId(null)
    setCurrentScreen("onboarding")
  }

  const openSubject = (subjectId: number) => {
    setSelectedSubjectId(subjectId)
    setCurrentScreen("subject-detail")
  }

  const openTopic = (subjectId: number, topicId: number) => {
    setSelectedSubjectId(subjectId)
    setSelectedTopicId(topicId)
    setCurrentScreen("topic-lesson")
  }

  const openQuiz = (quiz: PracticeQuiz, returnScreen: Screen) => {
    setActiveQuiz({
      id: quiz.id,
      title: quiz.topic,
      questions: quiz.questions,
      returnScreen,
    })
    setCurrentScreen("quiz")
  }

  const handleSearchResultSelect = (result: SearchResult) => {
    if (result.subjectId && result.type === "subject") {
      openSubject(result.subjectId)
      return
    }

    if (result.subjectId && result.topicId && result.type === "topic") {
      openTopic(result.subjectId, result.topicId)
      return
    }

    if (result.topicId && result.type === "quiz") {
      const quiz = practiceQuizzes.find((item) => item.topicId === result.topicId)

      if (quiz) {
        openQuiz(quiz, "search")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentScreen === "onboarding" || !userData) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  if (isBackendLoading && subjectBundles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-5 text-lg text-foreground font-semibold">Loading your content</p>
          <p className="mt-2 text-base text-muted-foreground">
            Getting subjects, topics, and questions ready for you.
          </p>
        </div>
      </div>
    )
  }

  if (backendError && subjectBundles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="bg-card border border-border rounded-3xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We could not load your content. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (currentScreen === "form-selector") {
    return (
      <FormSelectorScreen
        currentForm={userData.profile.form}
        onSelectForm={handleFormChange}
        onBack={() => setCurrentScreen("main")}
      />
    )
  }

  if (currentScreen === "subject-detail" && selectedSubject) {
    return (
      <SubjectDetailScreen
        subject={{
          id: selectedSubject.id,
          name: selectedSubject.name,
          icon: selectedSubject.icon,
          color: selectedSubject.color,
          image: selectedSubject.image,
          description: selectedSubject.description,
          topics: selectedSubject.topics.map((topic) => ({
            id: topic.id,
            title: topic.name,
            description: `${topic.questionCount} questions available to practice.`,
            questionsCount: topic.questionCount,
            isCompleted: topic.isCompleted,
            progress: topic.progress,
          })),
        }}
        onBack={() => setCurrentScreen("main")}
        onTopicSelect={(topicId) => openTopic(selectedSubject.id, topicId)}
      />
    )
  }

  if (currentScreen === "topic-lesson" && selectedTopic) {
    return (
      <TopicLessonScreen
        topic={{
          id: selectedTopic.id,
          title: selectedTopic.name,
          subject: selectedTopic.subjectName,
          questionsCount: selectedTopic.questionCount,
          progress: selectedTopic.progress,
          questions: selectedTopic.questions,
        }}
        onBack={() => setCurrentScreen("subject-detail")}
        onStartQuiz={() => {
          const quiz = practiceQuizzes.find((item) => item.topicId === selectedTopic.id)

          if (quiz) {
            openQuiz(quiz, "topic-lesson")
          }
        }}
      />
    )
  }

  if (currentScreen === "quiz" && activeQuiz) {
    return (
      <QuizUI
        questions={activeQuiz.questions.map((question) => ({
          id: question.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.answer,
          explanation: question.explanation,
        }))}
        topic={activeQuiz.title}
        onClose={() => {
          setCurrentScreen(activeQuiz.returnScreen)
          setActiveQuiz(null)
        }}
        onComplete={(result) => {
          void handleQuizComplete(activeQuiz.id, result)
        }}
      />
    )
  }

  if (currentScreen === "achievements") {
    return <AchievementsScreen onBack={() => setCurrentScreen("main")} />
  }

  if (currentScreen === "leaderboard") {
    return <LeaderboardScreen onBack={() => setCurrentScreen("main")} />
  }

  if (currentScreen === "study-tips") {
    return <StudyTipsScreen onBack={() => setCurrentScreen("main")} />
  }

  if (currentScreen === "settings") {
    return (
      <SettingsScreen
        onBack={() => setCurrentScreen("main")}
        onNavigateToDownloads={() => setCurrentScreen("downloads")}
        onNavigateToHelp={() => setCurrentScreen("help")}
        onNavigateToEditProfile={() => setCurrentScreen("edit-profile")}
      />
    )
  }

  if (currentScreen === "downloads") {
    return <DownloadsScreen onBack={() => setCurrentScreen("main")} />
  }

  if (currentScreen === "help") {
    return <HelpScreen onBack={() => setCurrentScreen("main")} />
  }

  if (currentScreen === "search") {
    return (
      <SearchScreen
        onBack={() => setCurrentScreen("main")}
        results={searchResults}
        featuredResults={featuredSearchResults}
        onResultSelect={handleSearchResultSelect}
      />
    )
  }

  if (currentScreen === "edit-profile") {
    return (
      <EditProfileScreen
        onBack={() => setCurrentScreen("main")}
        currentProfile={userData.profile}
        onSave={handleProfileUpdate}
      />
    )
  }

  if (currentScreen === "past-papers") {
    return (
      <PastPapersScreen
        userForm={userData.profile.form}
        onPaperSelect={() => {
          // Can add more functionality here if needed
        }}
      />
    )
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            onNavigateToSubjects={() => setActiveTab("subjects")}
            onNavigateToPractice={() => setActiveTab("practice")}
            onNavigateToAchievements={() => setCurrentScreen("achievements")}
            onNavigateToLeaderboard={() => setCurrentScreen("leaderboard")}
            onNavigateToStudyTips={() => setCurrentScreen("study-tips")}
            onNavigateToPastPapers={() => setCurrentScreen("past-papers")}
            onNavigateToFormSelector={() => setCurrentScreen("form-selector")}
            onSelectSubject={openSubject}
            userProfile={userData.profile}
            subjects={subjects.map((subject) => ({
              id: subject.id,
              name: subject.name,
              icon: subject.icon,
              progress: subject.progress,
              color: subject.color,
              questionCount: subject.questionCount,
              topicCount: subject.topics.length,
              isOffline: false,
            }))}
            lastSynced={lastSyncedAt}
            dailyChallenge={
              dailyChallengeTopic
                ? {
                    label: `${dailyChallengeTopic.subjectName} - ${dailyChallengeTopic.name}`,
                    questionCount: dailyChallengeTopic.questionCount,
                    onStart: () => {
                      const quiz = practiceQuizzes.find(
                        (item) => item.topicId === dailyChallengeTopic.id,
                      )

                      if (quiz) {
                        openQuiz(quiz, "main")
                      }
                    },
                  }
                : null
            }
          />
        )
      case "subjects":
        return (
          <SubjectsScreen
            subjects={subjects.map((subject) => ({
              id: subject.id,
              name: subject.name,
              icon: subject.icon,
              color: subject.color,
              image: subject.image,
              isOffline: false,
              questionCount: subject.questionCount,
              progress: subject.progress,
              topics: subject.topics.map((topic) => ({
                id: topic.id,
                title: topic.name,
                questionsCount: topic.questionCount,
                isCompleted: topic.isCompleted,
                progress: topic.progress,
              })),
            }))}
            onSubjectSelect={openSubject}
            onTopicSelect={openTopic}
            userForm={userData.profile.form}
          />
        )
      case "practice":
        return (
          <PracticeScreen
            userForm={userData.profile.form}
            quizzes={practiceQuizzes.map((quiz) => ({
              id: quiz.id,
              topic: quiz.topic,
              subject: quiz.subject,
              questionCount: quiz.questionCount,
              difficulty: quiz.difficulty,
              estimatedTime: quiz.estimatedTime,
            }))}
            onStartQuiz={(quizId) => {
              const quiz = practiceQuizzes.find((item) => item.id === quizId)

              if (quiz) {
                openQuiz(quiz, "main")
              }
            }}
            onStartExamMode={() => {
              if (examQuiz) {
                openQuiz(examQuiz, "main")
              }
            }}
          />
        )
      case "profile":
        return (
          <ProfileScreen
            onNavigateToSettings={() => setCurrentScreen("settings")}
            onNavigateToDownloads={() => setCurrentScreen("downloads")}
            onNavigateToHelp={() => setCurrentScreen("help")}
            onNavigateToEditProfile={() => setCurrentScreen("edit-profile")}
            userProfile={userData.profile}
            quizHistory={userData.quizHistory}
            syncedAnswerCount={progressEntries.length}
            lastSyncedAt={lastSyncedAt}
            onLogout={handleLogout}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        title={tabTitles[activeTab]}
        isOnline={isOnline}
        onSearchClick={() => setCurrentScreen("search")}
      />
      <main className="pb-20">
        {backendError && (
          <div className="mx-auto max-w-lg px-4 pt-4">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {backendError}
            </div>
          </div>
        )}
        {renderScreen()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <InstallPrompt />
      <UpdatePrompt />
    </div>
  )
}
