import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { training } from '../services/apiClient'

export const MockTests = () => {
  const [tests, setTests] = useState([])
  const [attempts, setAttempts] = useState([])
  const [statistics, setStatistics] = useState(null)

  const [loading, setLoading] = useState(true)

  const [difficultyFilter, setDifficultyFilter] = useState('all')

  useEffect(() => {
    fetchMockTestsData()
  }, [])

  const fetchMockTestsData = async () => {
    try {
      setLoading(true)

      const [
        testsResponse,
        attemptsResponse,
        statsResponse
      ] = await Promise.all([
        training.getTests(),
        training.getMyAttempts(),
        training.getTestStatistics()
      ])

      const testsData = Array.isArray(testsResponse.data)
        ? testsResponse.data
        : testsResponse.data.results || []

      const attemptsData = Array.isArray(attemptsResponse.data)
        ? attemptsResponse.data
        : attemptsResponse.data.results || []

      setTests(testsData)
      setAttempts(attemptsData)
      setStatistics(statsResponse.data)

    } catch (error) {
      console.error('Failed to load mock tests:', error)
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // FILTER TESTS
  // ===============================

  const filteredTests =
    difficultyFilter === 'all'
      ? tests
      : tests.filter(
          test =>
            test.difficulty === difficultyFilter
        )

  // ===============================
  // GET ATTEMPTS FOR TEST
  // ===============================

  const getAttemptsForTest = (testId) => {
    return attempts.filter(
      attempt => attempt.test?.id === testId
    )
  }

  // ===============================
  // GET BEST ATTEMPT
  // ===============================

  const getBestAttempt = (testId) => {
    const testAttempts = getAttemptsForTest(testId)

    if (!testAttempts.length) return null

    return testAttempts.reduce((best, current) =>
      current.percentage > best.percentage
        ? current
        : best
    )
  }

  // ===============================
  // DIFFICULTY COLORS
  // ===============================

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success'

      case 'medium':
        return 'warning'

      case 'hard':
        return 'danger'

      default:
        return 'secondary'
    }
  }

  // ===============================
  // LOADING STATE
  // ===============================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-600 text-lg">
            Loading mock tests...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Mock Tests
            </h1>

            <p className="text-slate-600">
              Practice aptitude, coding & placement assessments
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">

            <Button
              variant={
                difficultyFilter === 'all'
                  ? 'primary'
                  : 'secondary'
              }
              size="sm"
              onClick={() =>
                setDifficultyFilter('all')
              }
            >
              All
            </Button>

            <Button
              variant={
                difficultyFilter === 'easy'
                  ? 'primary'
                  : 'secondary'
              }
              size="sm"
              onClick={() =>
                setDifficultyFilter('easy')
              }
            >
              Easy
            </Button>

            <Button
              variant={
                difficultyFilter === 'medium'
                  ? 'primary'
                  : 'secondary'
              }
              size="sm"
              onClick={() =>
                setDifficultyFilter('medium')
              }
            >
              Medium
            </Button>

            <Button
              variant={
                difficultyFilter === 'hard'
                  ? 'primary'
                  : 'secondary'
              }
              size="sm"
              onClick={() =>
                setDifficultyFilter('hard')
              }
            >
              Hard
            </Button>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >

        {/* Total Attempts */}
        <div className="p-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <Icons.FileCheck className="w-8 h-8 text-indigo-600" />

            <Badge variant="primary">
              Tests
            </Badge>
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            {statistics?.total_attempts || 0}
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            Total Attempts
          </p>
        </div>

        {/* Average Score */}
        <div className="p-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <Icons.TrendingUp className="w-8 h-8 text-emerald-600" />

            <Badge variant="success">
              Avg
            </Badge>
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            {statistics?.average_score || 0}%
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            Average Score
          </p>
        </div>

        {/* Passed */}
        <div className="p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <Icons.CheckCircle2 className="w-8 h-8 text-blue-600" />

            <Badge variant="info">
              Passed
            </Badge>
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            {statistics?.passed || 0}
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            Tests Passed
          </p>
        </div>

        {/* Pass Rate */}
        <div className="p-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <Icons.Award className="w-8 h-8 text-purple-600" />

            <Badge variant="secondary">
              Rate
            </Badge>
          </div>

          <h3 className="text-3xl font-bold text-slate-900">
            {Math.round(statistics?.pass_rate || 0)}%
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            Pass Rate
          </p>
        </div>
      </motion.div>

      {/* TEST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {filteredTests.map((test, index) => {
          const testAttempts =
            getAttemptsForTest(test.id)

          const bestAttempt =
            getBestAttempt(test.id)

          const completed =
            testAttempts.length > 0

          return (
            <motion.div
              key={test.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.05
              }}
              whileHover={{
                y: -5
              }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
            >

              {/* TOP */}
              <div className="flex items-start justify-between mb-5">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {test.title}
                  </h2>

                  <p className="text-slate-600 mt-1">
                    {test.description || 'No description available'}
                  </p>
                </div>

                <Badge
                  variant={getDifficultyColor(
                    test.difficulty
                  )}
                >
                  {test.difficulty}
                </Badge>
              </div>

              {/* TEST INFO */}
              <div className="grid grid-cols-2 gap-4 mb-6">

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">
                    Questions
                  </p>

                  <p className="text-xl font-bold text-slate-900">
                    {test.total_questions}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">
                    Duration
                  </p>

                  <p className="text-xl font-bold text-slate-900">
                    {test.duration_minutes}m
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">
                    Attempts
                  </p>

                  <p className="text-xl font-bold text-indigo-600">
                    {testAttempts.length}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">
                    Best Score
                  </p>

                  <p className="text-xl font-bold text-emerald-600">
                    {bestAttempt
                      ? `${bestAttempt.percentage}%`
                      : '--'}
                  </p>
                </div>
              </div>

              {/* PERFORMANCE */}
              {bestAttempt && (
                <div className="mb-6">

                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-slate-600">
                      Performance
                    </p>

                    <p className="text-sm font-semibold text-indigo-600">
                      {bestAttempt.percentage}%
                    </p>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

                    <motion.div
                      initial={{
                        width: 0
                      }}
                      animate={{
                        width: `${bestAttempt.percentage}%`
                      }}
                      transition={{
                        duration: 1
                      }}
                      className={`h-full ${
                        bestAttempt.is_passed
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                          : 'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* STATUS */}
              <div className="mb-6">

                {completed ? (
                  bestAttempt?.is_passed ? (
                    <Badge variant="success">
                      Passed
                    </Badge>
                  ) : (
                    <Badge variant="danger">
                      Failed
                    </Badge>
                  )
                ) : (
                  <Badge variant="warning">
                    Not Attempted
                  </Badge>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">

                <Button
                  variant="primary"
                  className="flex-1"
                >
                  {completed
                    ? 'Retake Test'
                    : 'Start Test'}
                </Button>

                {completed && (
                  <Button
                    variant="secondary"
                  >
                    <Icons.Eye className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredTests.length === 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="py-24 text-center rounded-2xl border border-slate-200 bg-white"
        >
          <Icons.FileSearch className="w-16 h-16 text-slate-400 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            No Tests Found
          </h2>

          <p className="text-slate-600">
            No mock tests available for this filter.
          </p>
        </motion.div>
      )}
    </div>
  )
}