"use client"

export type FormLevel = "Form 1" | "Form 2" | "Form 3" | "Form 4"

export interface UserProfile {
  id: string
  name: string
  school: string
  form: FormLevel
  createdAt: string
}

export interface QuizAttempt {
  quizId: string
  score: number
  totalQuestions: number
  completedAt: string
  timeSpent: number
}

export interface TopicProgress {
  topicId: string
  subjectId: string
  progress: number
  lastAccessedAt: string
  completed: boolean
}

export interface UserData {
  profile: UserProfile
  quizHistory: QuizAttempt[]
  topicProgress: Record<string, TopicProgress>
  achievements: string[]
  totalStudyTime: number
  streakDays: number
  lastActiveAt: string
}

// Generate a unique user ID
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get the current user's data key (based on their unique ID)
function getUserDataKey(userId: string): string {
  return `maneb_user_${userId}`
}

// Get list of all user IDs on this device
export function getLocalUserIds(): string[] {
  if (typeof window === "undefined") return []
  const ids = localStorage.getItem("maneb_user_ids")
  return ids ? JSON.parse(ids) : []
}

// Add a user ID to the local list
function addUserIdToList(userId: string): void {
  const ids = getLocalUserIds()
  if (!ids.includes(userId)) {
    ids.push(userId)
    localStorage.setItem("maneb_user_ids", JSON.stringify(ids))
  }
}

// Get current active user ID
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("maneb_current_user_id")
}

// Set current active user
export function setCurrentUserId(userId: string): void {
  localStorage.setItem("maneb_current_user_id", userId)
}

// Create a new user
export function createUser(profile: Omit<UserProfile, "id" | "createdAt">): UserData {
  const userId = generateUserId()
  const userData: UserData = {
    profile: {
      ...profile,
      id: userId,
      createdAt: new Date().toISOString(),
    },
    quizHistory: [],
    topicProgress: {},
    achievements: [],
    totalStudyTime: 0,
    streakDays: 0,
    lastActiveAt: new Date().toISOString(),
  }
  
  saveUserData(userId, userData)
  addUserIdToList(userId)
  setCurrentUserId(userId)
  
  return userData
}

// Save user data
export function saveUserData(userId: string, data: UserData): void {
  localStorage.setItem(getUserDataKey(userId), JSON.stringify(data))
}

// Get user data
export function getUserData(userId: string): UserData | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(getUserDataKey(userId))
  return data ? JSON.parse(data) : null
}

// Get current user's data
export function getCurrentUserData(): UserData | null {
  const userId = getCurrentUserId()
  if (!userId) return null
  return getUserData(userId)
}

// Update user profile
export function updateUserProfile(userId: string, profile: Partial<UserProfile>): void {
  const data = getUserData(userId)
  if (data) {
    data.profile = { ...data.profile, ...profile }
    saveUserData(userId, data)
  }
}

// Add quiz attempt
export function addQuizAttempt(userId: string, attempt: QuizAttempt): void {
  const data = getUserData(userId)
  if (data) {
    data.quizHistory.push(attempt)
    data.lastActiveAt = new Date().toISOString()
    saveUserData(userId, data)
  }
}

// Update topic progress
export function updateTopicProgress(userId: string, subjectId: string, topicId: string, progress: number): void {
  const data = getUserData(userId)
  if (data) {
    const key = `${subjectId}_${topicId}`
    data.topicProgress[key] = {
      topicId,
      subjectId,
      progress,
      lastAccessedAt: new Date().toISOString(),
      completed: progress >= 100,
    }
    data.lastActiveAt = new Date().toISOString()
    saveUserData(userId, data)
  }
}

// Get user's quiz history for a specific form
export function getUserQuizHistory(userId: string): QuizAttempt[] {
  const data = getUserData(userId)
  return data?.quizHistory || []
}

// Delete user data (for logout)
export function deleteUserData(userId: string): void {
  localStorage.removeItem(getUserDataKey(userId))
  const ids = getLocalUserIds().filter(id => id !== userId)
  localStorage.setItem("maneb_user_ids", JSON.stringify(ids))
  
  const currentId = getCurrentUserId()
  if (currentId === userId) {
    localStorage.removeItem("maneb_current_user_id")
  }
}

// Switch to a different user account
export function switchUser(userId: string): UserData | null {
  const data = getUserData(userId)
  if (data) {
    setCurrentUserId(userId)
    return data
  }
  return null
}
