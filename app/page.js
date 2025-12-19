"use client";

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Trophy, Zap, Clock, Target, Moon, Sun, Plus, Award, Flame, Timer, LogOut, User } from 'lucide-react';
import { supabase } from '../Lib/Supabase';

const ProcrastinationHelper = () => {
  // Auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // App state
  const [currentTask, setCurrentTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [taskHistory, setTaskHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [customTasks, setCustomTasks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCustomTaskForm, setShowCustomTaskForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('2min');
  const [currentQuote, setCurrentQuote] = useState('');
  const [syncing, setSyncing] = useState(false);

  const quotes = [
    "The secret to getting ahead is getting started.",
    "Small progress is still progress.",
    "You don't have to be perfect, just consistent.",
    "Every master was once a beginner.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Success is the sum of small efforts repeated daily.",
    "You are capable of amazing things.",
    "Progress, not perfection.",
    "Start where you are, use what you have, do what you can.",
    "A journey of a thousand miles begins with a single step."
  ];

  const achievementDefinitions = [
    { id: 'first_task', name: 'Getting Started', desc: 'Complete your first task', icon: '🌟', requirement: 1 },
    { id: 'streak_5', name: 'On Fire', desc: 'Reach a 5-task streak', icon: '🔥', requirement: 5 },
    { id: 'streak_10', name: 'Unstoppable', desc: 'Reach a 10-task streak', icon: '⚡', requirement: 10 },
    { id: 'level_2', name: 'Level Up', desc: 'Reach level 2', icon: '🚀', requirement: 2 },
    { id: 'social_butterfly', name: 'Social Butterfly', desc: 'Complete 5 social tasks', icon: '🦋', requirement: 5 },
    { id: 'health_nut', name: 'Health Enthusiast', desc: 'Complete 5 health tasks', icon: '💪', requirement: 5 },
    { id: 'creative_soul', name: 'Creative Soul', desc: 'Complete 5 creative tasks', icon: '🎨', requirement: 5 }
  ];

  const taskDatabase = {
    health: [
      { task: "Do 10 jumping jacks", time: "30s", points: 5, difficulty: "super-easy", category: "health" },
      { task: "Drink a full glass of water", time: "1min", points: 5, difficulty: "super-easy", category: "health" },
      { task: "Take 5 deep breaths", time: "1min", points: 5, difficulty: "super-easy", category: "health" },
      { task: "Do 20 push-ups or modified push-ups", time: "2min", points: 10, difficulty: "easy", category: "health" },
      { task: "Stretch for 3 minutes", time: "3min", points: 10, difficulty: "easy", category: "health" },
      { task: "Walk around the block", time: "5min", points: 15, difficulty: "medium", category: "health" }
    ],
    cleaning: [
      { task: "Make your bed", time: "2min", points: 10, difficulty: "easy", category: "cleaning" },
      { task: "Clear your desk/workspace", time: "3min", points: 10, difficulty: "easy", category: "cleaning" },
      { task: "Put 10 items back where they belong", time: "2min", points: 10, difficulty: "easy", category: "cleaning" },
      { task: "Wipe down one surface", time: "1min", points: 5, difficulty: "super-easy", category: "cleaning" },
      { task: "Organize one drawer", time: "5min", points: 15, difficulty: "medium", category: "cleaning" },
      { task: "Do dishes for 5 minutes", time: "5min", points: 15, difficulty: "medium", category: "cleaning" }
    ],
    learning: [
      { task: "Read one Wikipedia article", time: "3min", points: 10, difficulty: "easy", category: "learning" },
      { task: "Learn 3 new words in any language", time: "2min", points: 10, difficulty: "easy", category: "learning" },
      { task: "Watch a 2-minute educational video", time: "2min", points: 10, difficulty: "easy", category: "learning" },
      { task: "Write down 3 things you learned today", time: "2min", points: 10, difficulty: "easy", category: "learning" },
      { task: "Look up something you've always wondered about", time: "5min", points: 15, difficulty: "medium", category: "learning" }
    ],
    creative: [
      { task: "Draw or doodle for 2 minutes", time: "2min", points: 10, difficulty: "easy", category: "creative" },
      { task: "Write a haiku about your day", time: "3min", points: 10, difficulty: "easy", category: "creative" },
      { task: "Take 5 photos of interesting things around you", time: "3min", points: 10, difficulty: "easy", category: "creative" },
      { task: "Come up with 5 ideas for anything", time: "2min", points: 10, difficulty: "easy", category: "creative" },
      { task: "Write a short story in 50 words", time: "5min", points: 15, difficulty: "medium", category: "creative" }
    ],
    social: [
      { task: "Text someone you haven't talked to in a while", time: "1min", points: 10, difficulty: "easy", category: "social" },
      { task: "Give someone a genuine compliment", time: "1min", points: 10, difficulty: "easy", category: "social" },
      { task: "Call a family member or friend", time: "5min", points: 15, difficulty: "medium", category: "social" },
      { task: "Write a thank you message to someone", time: "2min", points: 10, difficulty: "easy", category: "social" },
      { task: "Smile at 3 strangers (or yourself in the mirror)", time: "30s", points: 5, difficulty: "super-easy", category: "social" }
    ]
  };

  // Check authentication status on mount
  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Check if user is logged in
  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load user data from Supabase
  const loadUserData = async (userId) => {
    try {
      setSyncing(true);
      
      // Load progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (progress) {
        setCompletedTasks(progress.completed_tasks);
        setStreak(progress.streak);
        setPoints(progress.points);
        setDarkMode(progress.dark_mode);
      } else {
        // Create initial progress record
        await supabase.from('user_progress').insert([
          { user_id: userId, completed_tasks: 0, streak: 0, points: 0 }
        ]);
      }

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);
      
      if (achievementsData) {
        setAchievements(achievementsData.map(a => ({
          id: a.achievement_id,
          name: a.achievement_name,
          icon: a.achievement_icon,
          desc: a.achievement_desc
        })));
      }

      // Load task history
      const { data: historyData } = await supabase
        .from('task_history')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(50);
      
      if (historyData) {
        setTaskHistory(historyData);
      }

      // Load custom tasks
      const { data: customData } = await supabase
        .from('custom_tasks')
        .select('*')
        .eq('user_id', userId);
      
      if (customData) {
        setCustomTasks(customData.map(t => ({
          task: t.task,
          time: t.time,
          points: t.points,
          difficulty: t.difficulty,
          category: 'custom'
        })));
      }

      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Save progress to Supabase
  const saveProgress = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_progress')
        .update({
          completed_tasks: completedTasks,
          streak: streak,
          points: points,
          dark_mode: darkMode,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Save progress whenever it changes
  useEffect(() => {
    if (user) {
      saveProgress();
    }
  }, [completedTasks, streak, points, darkMode]);

  // Authentication handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setAuthError('Check your email for confirmation link!');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCompletedTasks(0);
    setStreak(0);
    setPoints(0);
    setTaskHistory([]);
    setCustomTasks([]);
    setAchievements([]);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playSound('timer-end');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = type === 'complete' ? 800 : type === 'level-up' ? 1000 : 600;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const checkAchievements = async (newCompletedTasks, newStreak, newLevel, newTaskHistory) => {
    if (!user) return;

    const newAchievements = [];
    
    for (const achievement of achievementDefinitions) {
      if (!achievements.find(a => a.id === achievement.id)) {
        let earned = false;
        
        switch (achievement.id) {
          case 'first_task':
            earned = newCompletedTasks >= 1;
            break;
          case 'streak_5':
            earned = newStreak >= 5;
            break;
          case 'streak_10':
            earned = newStreak >= 10;
            break;
          case 'level_2':
            earned = newLevel >= 2;
            break;
          case 'social_butterfly':
            earned = newTaskHistory.filter(t => t.category === 'social').length >= 5;
            break;
          case 'health_nut':
            earned = newTaskHistory.filter(t => t.category === 'health').length >= 5;
            break;
          case 'creative_soul':
            earned = newTaskHistory.filter(t => t.category === 'creative').length >= 5;
            break;
        }
        
        if (earned) {
          newAchievements.push(achievement);
          
          // Save to Supabase
          await supabase.from('user_achievements').insert([{
            user_id: user.id,
            achievement_id: achievement.id,
            achievement_name: achievement.name,
            achievement_icon: achievement.icon,
            achievement_desc: achievement.desc
          }]);
        }
      }
    }
    
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
      playSound('level-up');
    }
  };

  const getRandomTask = () => {
    const allCategories = Object.keys(taskDatabase);
    const allTasks = allCategories.flatMap(cat => taskDatabase[cat]);
    return allTasks[Math.floor(Math.random() * allTasks.length)];
  };

  const getTaskByCategory = (category) => {
    const categoryTasks = taskDatabase[category] || [];
    if (categoryTasks.length === 0) return null;
    return categoryTasks[Math.floor(Math.random() * categoryTasks.length)];
  };

  const generateNewTask = (category = null) => {
    const newTask = category ? getTaskByCategory(category) : getRandomTask();
    if (!newTask) return;
    
    setCurrentTask(newTask);
    const timeInSeconds = parseFloat(newTask.time) * (newTask.time.includes('min') ? 60 : 1);
    setTimer(timeInSeconds);
    setIsTimerRunning(true);
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const startTimer = () => {
    if (currentTask && timer > 0) {
      setIsTimerRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const addCustomTask = async () => {
    if (!newTaskText.trim() || !user) return;
    
    const customTask = {
      task: newTaskText,
      time: newTaskTime,
      points: newTaskTime.includes('min') ? parseInt(newTaskTime) * 5 : 5,
      difficulty: "custom",
      category: "custom"
    };

    // Save to Supabase
    await supabase.from('custom_tasks').insert([{
      user_id: user.id,
      task: customTask.task,
      time: customTask.time,
      points: customTask.points,
      difficulty: customTask.difficulty
    }]);

    setCustomTasks([...customTasks, customTask]);
    setNewTaskText('');
    setShowCustomTaskForm(false);
  };

  const completeTask = async () => {
    if (!currentTask || !user) return;
    
    const newCompletedTasks = completedTasks + 1;
    const newPoints = points + currentTask.points;
    const newStreak = streak + 1;
    const newLevel = Math.floor(newPoints / 50) + 1;
    const oldLevel = getLevel();

    setCompletedTasks(newCompletedTasks);
    setPoints(newPoints);
    setStreak(newStreak);
    
    // Save task to history in Supabase
    await supabase.from('task_history').insert([{
      user_id: user.id,
      task: currentTask.task,
      category: currentTask.category,
      difficulty: currentTask.difficulty,
      time: currentTask.time,
      points: currentTask.points
    }]);

    const updatedHistory = [{...currentTask, completed_at: new Date()}, ...taskHistory];
    setTaskHistory(updatedHistory);
    setShowCelebration(true);
    setIsTimerRunning(false);
    setTimer(0);

    if (newLevel > oldLevel) {
      playSound('level-up');
    } else {
      playSound('complete');
    }

    checkAchievements(newCompletedTasks, newStreak, newLevel, updatedHistory);
    setTimeout(() => setShowCelebration(false), 2000);
    setCurrentTask(null);
  };

  const skipTask = () => {
    setCurrentTask(null);
    setIsTimerRunning(false);
    setTimer(0);
    setStreak(0);
  };

  const getLevel = () => Math.floor(points / 50) + 1;
  const getLevelProgress = () => (points % 50) / 50 * 100;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'super-easy': return 'text-green-600 bg-green-100';
      case 'easy': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'custom': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [
    { key: 'health', name: 'Health', icon: Zap, color: 'bg-green-500' },
    { key: 'cleaning', name: 'Cleaning', icon: Target, color: 'bg-blue-500' },
    { key: 'learning', name: 'Learning', icon: Trophy, color: 'bg-purple-500' },
    { key: 'creative', name: 'Creative', icon: Play, color: 'bg-pink-500' },
    { key: 'social', name: 'Social', icon: CheckCircle, color: 'bg-orange-500' },
    { key: 'custom', name: 'Custom', icon: Plus, color: 'bg-indigo-500' }
  ];

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-600">Loading...</div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2">Procrastination Helper</h1>
          <p className="text-gray-600 text-center mb-6">Beat procrastination, one task at a time! 🚀</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {authError && (
              <div className={`p-3 rounded-lg text-sm ${
                authError.includes('Check your email') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {authMode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main app (when logged in)
  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {user.email}
            </span>
            {syncing && <span className="text-xs text-purple-600">Syncing...</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } shadow-lg`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className={`p-3 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-800 text-red-400 hover:bg-gray-700' 
                  : 'bg-white text-red-600 hover:bg-gray-100'
              } shadow-lg`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <h1 className="text-3xl font-bold mb-4 text-center">
            Procrastination Helper
          </h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tasks Done</div>
            </div>
            <div className="text-center relative">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                {streak}
                {streak >= 5 && <Flame className="w-5 h-5 text-orange-500 animate-pulse" />}
                {streak >= 10 && <Flame className="w-4 h-4 text-red-500 animate-bounce" />}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Level {getLevel()}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{points} points</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className={`flex justify-between text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Level {getLevel()}</span>
              <span>Level {getLevel() + 1}</span>
            </div>
            <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress()}%` }}
              ></div>
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="mt-4">
              <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Recent Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {achievements.slice(-3).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs animate-pulse"
                  >
                    <span>{achievement.icon}</span>
                    <span>{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timer Display */}
        {currentTask && (
          <div className={`rounded-2xl shadow-lg p-4 mb-6 text-center ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <div className="flex items-center justify-center gap-4">
              <div className={`text-3xl font-bold ${timer <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                {formatTime(timer)}
              </div>
              <div className="flex gap-2">
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Timer className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Task or Task Selection */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          {currentTask ? (
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${getDifficultyColor(currentTask.difficulty)}`}>
                <Clock className="w-4 h-4 mr-1" />
                {currentTask.time} • {currentTask.points} points
              </div>
              
              <h2 className="text-2xl font-semibold mb-6">
                {currentTask.task}
              </h2>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={completeTask}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Done!
                </button>
                <button
                  onClick={skipTask}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  Skip
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Ready to beat procrastination?
              </h2>
              
              <button
                onClick={() => generateNewTask()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-semibold mb-6 transition-all transform hover:scale-105"
              >
                🎲 Give me any quick task!
              </button>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.key}
                      onClick={() => category.key === 'custom' ? setShowCustomTaskForm(true) : generateNewTask(category.key)}
                      className={`${category.color} hover:opacity-90 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>

              {showCustomTaskForm && (
                <div className={`border-2 border-dashed rounded-xl p-4 mt-4 ${
                  darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                }`}>
                  <h3 className="font-semibold mb-3">Add Your Own Task</h3>
                  <input
                    type="text"
                    placeholder="e.g., Water my plants"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    className={`w-full p-3 rounded-lg mb-3 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    } border`}
                  />
                  <div className="flex gap-3">
                    <select
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className={`p-2 rounded-lg ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } border`}
                    >
                      <option value="30s">30 seconds</option>
                      <option value="1min">1 minute</option>
                      <option value="2min">2 minutes</option>
                      <option value="3min">3 minutes</option>
                      <option value="5min">5 minutes</option>
                    </select>
                    <button
                      onClick={addCustomTask}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => setShowCustomTaskForm(false)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        {currentQuote && (
          <div className={`rounded-2xl shadow-lg p-6 mb-6 text-center ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <div className="text-lg italic mb-2">"{currentQuote}"</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Keep going! 💪
            </div>
          </div>
        )}

        {/* Success Celebration */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`rounded-2xl shadow-2xl p-8 text-center animate-bounce ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Awesome!</h2>
              <p className="text-lg">+{currentTask?.points} points</p>
            </div>
          </div>
        )}

        {/* All Achievements Panel */}
        {achievements.length > 0 && (
          <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Your Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`text-center p-3 rounded-xl ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="font-semibold text-sm">{achievement.name}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {achievement.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Task History */}
        {taskHistory.length > 0 && (
          <div className={`rounded-2xl shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Recent Completions</h3>
            <div className="space-y-2">
              {taskHistory.slice(0, 5).map((task, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{task.task}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {task.category} • {task.time}
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">+{task.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcrastinationHelper;