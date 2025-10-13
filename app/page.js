"use client";

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Trophy, Zap, Clock, Target, Moon, Sun, Plus, Flame, Timer } from 'lucide-react';

const ProcrastinationHelper = () => {
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

  // Motivational quotes
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

  // Achievement definitions
  const achievementDefinitions = [
    { id: 'first_task', name: 'Getting Started', desc: 'Complete your first task', icon: '🌟', requirement: 1 },
    { id: 'streak_5', name: 'On Fire', desc: 'Reach a 5-task streak', icon: '🔥', requirement: 5 },
    { id: 'streak_10', name: 'Unstoppable', desc: 'Reach a 10-task streak', icon: '⚡', requirement: 10 },
    { id: 'level_2', name: 'Level Up', desc: 'Reach level 2', icon: '🚀', requirement: 2 },
    { id: 'social_butterfly', name: 'Social Butterfly', desc: 'Complete 5 social tasks', icon: '🦋', requirement: 5 },
    { id: 'health_nut', name: 'Health Enthusiast', desc: 'Complete 5 health tasks', icon: '💪', requirement: 5 },
    { id: 'creative_soul', name: 'Creative Soul', desc: 'Complete 5 creative tasks', icon: '🎨', requirement: 5 }
  ];

  // Task categories with difficulty levels
  const taskDatabase = {
    health: [
      { task: "Do 10 jumping jacks", time: "30s", points: 5, difficulty: "super-easy" },
      { task: "Drink a full glass of water", time: "1min", points: 5, difficulty: "super-easy" },
      { task: "Take 5 deep breaths", time: "1min", points: 5, difficulty: "super-easy" },
      { task: "Do 20 push-ups or modified push-ups", time: "2min", points: 10, difficulty: "easy" },
      { task: "Stretch for 3 minutes", time: "3min", points: 10, difficulty: "easy" },
      { task: "Walk around the block", time: "5min", points: 15, difficulty: "medium" }
    ],
    cleaning: [
      { task: "Make your bed", time: "2min", points: 10, difficulty: "easy" },
      { task: "Clear your desk/workspace", time: "3min", points: 10, difficulty: "easy" },
      { task: "Put 10 items back where they belong", time: "2min", points: 10, difficulty: "easy" },
      { task: "Wipe down one surface", time: "1min", points: 5, difficulty: "super-easy" },
      { task: "Organize one drawer", time: "5min", points: 15, difficulty: "medium" },
      { task: "Do dishes for 5 minutes", time: "5min", points: 15, difficulty: "medium" }
    ],
    learning: [
      { task: "Read one Wikipedia article", time: "3min", points: 10, difficulty: "easy" },
      { task: "Learn 3 new words in any language", time: "2min", points: 10, difficulty: "easy" },
      { task: "Watch a 2-minute educational video", time: "2min", points: 10, difficulty: "easy" },
      { task: "Write down 3 things you learned today", time: "2min", points: 10, difficulty: "easy" },
      { task: "Look up something you've always wondered about", time: "5min", points: 15, difficulty: "medium" }
    ],
    creative: [
      { task: "Draw or doodle for 2 minutes", time: "2min", points: 10, difficulty: "easy" },
      { task: "Write a haiku about your day", time: "3min", points: 10, difficulty: "easy" },
      { task: "Take 5 photos of interesting things around you", time: "3min", points: 10, difficulty: "easy" },
      { task: "Come up with 5 ideas for anything", time: "2min", points: 10, difficulty: "easy" },
      { task: "Write a short story in 50 words", time: "5min", points: 15, difficulty: "medium" }
    ],
    social: [
      { task: "Text someone you haven't talked to in a while", time: "1min", points: 10, difficulty: "easy" },
      { task: "Give someone a genuine compliment", time: "1min", points: 10, difficulty: "easy" },
      { task: "Call a family member or friend", time: "5min", points: 15, difficulty: "medium" },
      { task: "Write a thank you message to someone", time: "2min", points: 10, difficulty: "easy" },
      { task: "Smile at 3 strangers (or yourself in the mirror)", time: "30s", points: 5, difficulty: "super-easy" }
    ],
    custom: customTasks
  };

  // Load data from localStorage on mount ONLY
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('procrastination-helper-data');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setCompletedTasks(data.completedTasks || 0);
          setStreak(data.streak || 0);
          setPoints(data.points || 0);
          setTaskHistory(data.taskHistory || []);
          setCustomTasks(data.customTasks || []);
          setAchievements(data.achievements || []);
          setDarkMode(data.darkMode || false);
        } catch (e) {
          console.log('Error loading saved data');
        }
      }
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, []); // Empty dependency array - runs only once

  // Save data to localStorage - with proper dependencies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataToSave = {
        completedTasks,
        streak,
        points,
        taskHistory,
        customTasks,
        achievements,
        darkMode
      };
      localStorage.setItem('procrastination-helper-data', JSON.stringify(dataToSave));
    }
  }, [completedTasks, streak, points, taskHistory, customTasks, achievements, darkMode]);

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
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer]);

  // Sound effects
  const playSound = (type) => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let frequency;
      
      switch (type) {
        case 'complete':
          frequency = 800;
          break;
        case 'level-up':
          frequency = 1000;
          break;
        case 'timer-end':
          frequency = 600;
          break;
        default:
          frequency = 400;
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Check for new achievements
  const checkAchievements = (newCompletedTasks, newStreak, newLevel, newTaskHistory) => {
    const newAchievements = [];
    
    achievementDefinitions.forEach(achievement => {
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
        }
      }
    });
    
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
      playSound('level-up');
    }
  };

  // Get random task from all categories
  const getRandomTask = () => {
    const allTasks = Object.values(taskDatabase).flat();
    if (allTasks.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * allTasks.length);
    return allTasks[randomIndex];
  };

  // Get task by category
  const getTaskByCategory = (category) => {
    const categoryTasks = taskDatabase[category];
    if (!categoryTasks || categoryTasks.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * categoryTasks.length);
    return { ...categoryTasks[randomIndex], category };
  };

  // Generate new task
  const generateNewTask = (category = null) => {
    const newTask = category ? getTaskByCategory(category) : getRandomTask();
    if (!newTask) return;
    
    setCurrentTask(newTask);
    
    // Start timer
    const timeInSeconds = parseFloat(newTask.time) * (newTask.time.includes('min') ? 60 : 1);
    setTimer(timeInSeconds);
    setIsTimerRunning(true);
    
    // New motivational quote
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  // Start timer manually
  const startTimer = () => {
    if (currentTask && timer > 0) {
      setIsTimerRunning(true);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  // Add custom task
  const addCustomTask = () => {
    if (newTaskText.trim()) {
      const customTask = {
        task: newTaskText,
        time: newTaskTime,
        points: newTaskTime.includes('min') ? parseInt(newTaskTime) * 5 : 5,
        difficulty: "custom",
        category: "custom"
      };
      setCustomTasks([...customTasks, customTask]);
      setNewTaskText('');
      setShowCustomTaskForm(false);
    }
  };

  // Complete current task
  const completeTask = () => {
    if (!currentTask) return;
    
    const newCompletedTasks = completedTasks + 1;
    const newPoints = points + currentTask.points;
    const newStreak = streak + 1;
    const newLevel = Math.floor(newPoints / 50) + 1;
    const oldLevel = getLevel();

    setCompletedTasks(newCompletedTasks);
    setPoints(newPoints);
    setStreak(newStreak);
    
    const updatedHistory = [...taskHistory, { ...currentTask, completedAt: new Date().toISOString() }];
    setTaskHistory(updatedHistory);
    setShowCelebration(true);
    setIsTimerRunning(false);
    setTimer(0);

    // Play sound
    if (newLevel > oldLevel) {
      playSound('level-up');
    } else {
      playSound('complete');
    }

    // Check achievements
    checkAchievements(newCompletedTasks, newStreak, newLevel, updatedHistory);

    // Hide celebration after 2 seconds
    setTimeout(() => setShowCelebration(false), 2000);

    setCurrentTask(null);
  };

  // Skip current task
  const skipTask = () => {
    setCurrentTask(null);
    setIsTimerRunning(false);
    setTimer(0);
  };

  // Get level based on points
  const getLevel = () => Math.floor(points / 50) + 1;

  // Get progress to next level
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

  // Format timer display
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

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="max-w-2xl mx-auto">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
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
        </div>

        {/* Header Stats */}
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
          
          {/* Level Progress Bar */}
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

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mt-4">
              <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Recent Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {achievements.slice(-3).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs"
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
              
              {/* Random Task Button */}
              <button
                onClick={() => generateNewTask()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-semibold mb-6 transition-all transform hover:scale-105"
              >
                🎲 Give me any quick task!
              </button>

              {/* Category Selection */}
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

              {/* Custom Task Form */}
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
                  <div className="flex gap-3 flex-wrap">
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
        {currentQuote && !currentTask && (
          <div className={`rounded-2xl shadow-lg p-4 mb-6 text-center ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
          }`}>
            <p className="italic">"{currentQuote}"</p>
          </div>
        )}

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        {/* Motivational Messages */}
        {completedTasks > 0 && (
          <div className={`rounded-2xl p-4 text-center ${
            darkMode 
              ? 'bg-gradient-to-r from-green-900 to-blue-900 text-green-100' 
              : 'bg-gradient-to-r from-green-100 to-blue-100 text-gray-700'
          }`}>
            <p className="font-medium">
              {completedTasks >= 5 
                ? "🚀 Incredible momentum! You're unstoppable today!"
                : completedTasks >= 3 
                ? "🔥 You're on fire! Maybe it's time to tackle that big task you've been avoiding?"
                : "✨ Great start! Every small action builds momentum."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcrastinationHelper;